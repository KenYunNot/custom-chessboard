import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import { type Move, Chess, DEFAULT_POSITION } from 'chess.js';
import { GameStore } from './gameStore';
import { SessionStore } from './sessionStore';

declare module 'socket.io' {
  interface Socket {
    sessionId: string;
    gameId: string;
  }
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4173', 'http://localhost:5173'],
  },
});

const gameStore = new GameStore();
const sessionStore = new SessionStore();

app.get('/', (_, res) => {
  res.sendFile(join(__dirname, '../', 'index.html'));
});

io.use((socket, next) => {
  const { userId, sessionId } = socket.handshake.auth;
  if (!userId) {
    return next(new Error('Must be authenticated!'));
  }
  if (sessionId) {
    const session = sessionStore.findSession(sessionId);
    const game = gameStore.findGame(session?.gameId);
    if (!session || session.me !== userId) {
      return next(new Error('Invalid session.'));
    }
    if (!game) {
      return next(new Error("Game doesn't exist!"));
    }
    socket.sessionId = sessionId;
    socket.gameId = session.gameId;
  }

  socket.data.userId = userId;
  socket.in(userId).disconnectSockets();
  socket.join(userId);
  next();
});

io.on('connection', (socket) => {
  console.log('A user has connected!');

  socket.on('find-opponent', async (timeControl: { category: string; time: number; increment: number }) => {
    if (socket.sessionId) return socket.emit('found-opponent', socket.sessionId, socket.gameId);
    const { category, time, increment } = timeControl;
    const pool = `${category}-${time}-${increment}`;
    const sockets = await io.in(pool).fetchSockets();
    if (sockets.length === 0) {
      socket.join(pool);
    } else {
      const opponentSocket = sockets[Math.floor(Math.random() * sockets.length)];
      const [playerWhiteSocket, playerBlackSocket] =
        Math.random() < 0.5 ? [socket, opponentSocket] : [opponentSocket, socket];
      const gameId = gameStore.saveGame({
        fen: DEFAULT_POSITION,
        playerWhiteId: playerWhiteSocket.data.userId,
        playerBlackId: playerBlackSocket.data.userId,
      });
      const playerWhiteSessionId = sessionStore.saveSession({
        me: playerWhiteSocket.data.userId,
        opponent: playerBlackSocket.data.userId,
        gameId,
      });
      const playerBlackSessionId = sessionStore.saveSession({
        me: playerBlackSocket.data.userId,
        opponent: playerWhiteSocket.data.userId,
        gameId,
      });
      playerWhiteSocket.data.gameId = gameId;
      playerBlackSocket.data.gameId = gameId;
      playerWhiteSocket.join(gameId);
      playerBlackSocket.join(gameId);
      playerWhiteSocket.emit('found-opponent', playerWhiteSessionId, gameId);
      playerBlackSocket.emit('found-opponent', playerBlackSessionId, gameId);
    }
  });

  socket.on('play-game', (gameId: string) => {
    const game = gameStore.findGame(gameId);
    const color = socket.data.userId === game.playerWhiteId ? 'w' : 'b';
    socket.emit('session', {
      color,
      opponentId: color === 'w' ? game.playerBlackId : game.playerWhiteId,
      fen: game.fen,
    });

    socket.on('move', (move: Move) => {
      const { fen, playerWhiteId, playerBlackId } = gameStore.findGame(gameId);
      const chess = new Chess(fen);
      if (chess.turn() === 'w' && socket.data.userId !== playerWhiteId) return;
      if (chess.turn() === 'b' && socket.data.userId !== playerBlackId) return;
      try {
        chess.move({
          from: move.from,
          to: move.to,
        });
        gameStore.updateFen(gameId, chess.fen());
        socket.to(gameId).emit('move', move);
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            const [winnerId, loserId] =
              chess.turn() === 'w' ? [playerBlackId, playerWhiteId] : [playerWhiteId, playerBlackId];
            // Emit isWinner boolean
            io.to(winnerId).emit('checkmate', true);
            io.to(loserId).emit('checkmate', false);
          } else if (chess.isDraw()) {
            io.to(gameId).emit('draw', {
              stalemate: chess.isStalemate(),
              repetition: chess.isThreefoldRepetition(),
              fiftyMoveRule: chess.isDrawByFiftyMoves(),
              insufficientMaterial: chess.isInsufficientMaterial(),
            });
          }
          io.in(gameId).disconnectSockets();
          gameStore.removeGame(gameId);
        }
      } catch (error) {
        socket.emit('invalid-move', fen);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected!');
    // gameStore.removeGame(socket.gameId);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000...');
});

import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import { type Move, Chess, DEFAULT_POSITION } from 'chess.js';
import { GameStore } from './gameStore';
import { SessionStore } from './sessionStore';

declare module 'socket.io' {
  interface Socket {
    userId: string;
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
    return next(new Error('Must be authenticated.'));
  }
  if (sessionId) {
    const session = sessionStore.findSession(sessionId);
    if (session && session.me === userId) {
      socket.sessionId = sessionId;
      socket.gameId = session.gameId;
    }
  }
  socket.userId = userId;
  next();
});

io.on('connection', (socket) => {
  console.log('A user has connected!');

  socket.on('find-opponent', async (timeControl: { category: string; time: number; increment: number }) => {
    // Guard against users who already have gameId set
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
        playerWhiteId: playerWhiteSocket.id,
        playerBlackId: playerBlackSocket.id,
      });
      playerWhiteSocket.join(gameId);
      playerBlackSocket.join(gameId);
      playerWhiteSocket.emit('found-opponent', gameId, 'w', playerBlackSocket.id);
      playerBlackSocket.emit('found-opponent', gameId, 'b', playerWhiteSocket.id);
    }
  });

  socket.on('play-game', (gameId: string) => {
    socket.on('move', (move: Move) => {
      const { fen, playerWhiteId, playerBlackId } = gameStore.findGame(gameId);
      const chess = new Chess(fen);
      if (chess.turn() === 'w' && socket.id !== playerWhiteId) return;
      if (chess.turn() === 'b' && socket.id !== playerBlackId) return;
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

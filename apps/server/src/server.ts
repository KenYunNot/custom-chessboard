import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import { type Move, Chess, DEFAULT_POSITION } from 'chess.js';
import { GameStore } from './gameStore';
import { SessionStore } from './sessionStore';

declare module 'socket.io' {
  interface Socket {
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
  const { userId, gameId } = socket.handshake.auth;
  if (!userId) {
    return next(new Error('Must be authenticated!'));
  }
  if (gameId) {
    const game = gameStore.findGame(gameId);
    if (!game || (userId !== game.playerWhiteId && userId !== game.playerBlackId)) {
      return next(new Error('Invalid session.'));
    }
    socket.data.gameId = gameId;
  }

  socket.data.userId = userId;
  socket.in(userId).disconnectSockets();
  socket.join(userId);
  next();
});

io.on('connection', (socket) => {
  console.log('A user has connected!');

  socket.on('find-opponent', async (timeControl: { category: string; time: number; increment: number }) => {
    if (socket.gameId) return socket.emit('found-opponent', socket.gameId);
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
      playerWhiteSocket.data.gameId = gameId;
      playerBlackSocket.data.gameId = gameId;
      playerWhiteSocket.join(gameId);
      playerBlackSocket.join(gameId);
      playerWhiteSocket.emit('found-opponent', gameId);
      playerBlackSocket.emit('found-opponent', gameId);
    }
  });

  socket.on('play-game', () => {
    console.log(socket.data.gameId);
    const game = gameStore.findGame(socket.data.gameId);
    if (!game) {
      return socket.emit('invalid-game');
    }
    if (socket.data.userId !== game.playerWhiteId && socket.data.userId !== game.playerBlackId) {
      return socket.emit('not-your-game', socket.data.gameId);
    }
    const color = socket.data.userId === game.playerWhiteId ? 'w' : 'b';
    socket.emit('session', {
      color,
      opponentId: color === 'w' ? game.playerBlackId : game.playerWhiteId,
      fen: game.fen,
    });

    socket.on('move', (move: Move) => {
      const { fen, playerWhiteId, playerBlackId } = gameStore.findGame(socket.data.gameId);
      const chess = new Chess(fen);
      if (chess.turn() === 'w' && socket.data.userId !== playerWhiteId) return;
      if (chess.turn() === 'b' && socket.data.userId !== playerBlackId) return;
      try {
        chess.move({
          from: move.from,
          to: move.to,
        });
        gameStore.updateFen(socket.data.gameId, chess.fen());
        socket.to(socket.data.gameId).emit('move', move);
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            const [winnerId, loserId] =
              chess.turn() === 'w' ? [playerBlackId, playerWhiteId] : [playerWhiteId, playerBlackId];
            // Emit isWinner boolean
            io.to(winnerId).emit('checkmate', true);
            io.to(loserId).emit('checkmate', false);
          } else if (chess.isDraw()) {
            io.to(socket.data.gameId).emit('draw', {
              stalemate: chess.isStalemate(),
              repetition: chess.isThreefoldRepetition(),
              fiftyMoveRule: chess.isDrawByFiftyMoves(),
              insufficientMaterial: chess.isInsufficientMaterial(),
            });
          }
          io.in(socket.data.gameId).disconnectSockets();
          gameStore.removeGame(socket.data.gameId);
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

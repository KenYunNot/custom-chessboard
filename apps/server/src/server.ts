import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:4173'],
  },
});

app.get('/', (_, res) => {
  res.sendFile(join(__dirname, '../', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user has connected!');
  socket.on('find-game', async ({ category, time, increment }) => {
    // Fetch all sockets in pool
    // If there are sockets, pick one to start game with
    // Else, join the pool and wait
    const pool = `${category}-${time}-${increment}`;
    const sockets = await io.in(pool).fetchSockets();
    if (sockets.length === 0) {
      socket.join(pool);
    } else {
      const opponentSocket = sockets[Math.floor(Math.random() * sockets.length)];
      const gameId = Math.ceil(Math.random() * 1000000);
      opponentSocket.emit('play-game', gameId);
      socket.emit('play-game', gameId);
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000...');
});

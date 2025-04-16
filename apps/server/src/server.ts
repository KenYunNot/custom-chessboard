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

io.on('connection', (_) => {
  console.log('A user connected!');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000...');
});

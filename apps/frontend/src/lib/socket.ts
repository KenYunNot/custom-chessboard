import { io } from 'socket.io-client';
import type { TimeControl } from './types';
import type { Color } from 'chess.js';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

declare module 'socket.io-client' {
  interface Socket {
    gameId: string;
    color: Color;
    timeControl: TimeControl;
  }
}

export const socket = io(URL, {
  autoConnect: false,
});

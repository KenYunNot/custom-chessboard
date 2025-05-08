import React from 'react';
import { socket } from '@/lib/socket';

const PlayGame = () => {
  React.useEffect(() => {}, []);

  return <div>{socket.id}</div>;
};

export default PlayGame;

import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { socket } from '@/lib/socket';

const Game = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!gameId) {
      navigate('/');
    } else {
      socket.auth = { gameId };
      socket.connect();
    }
  }, []);

  return <div>{gameId}</div>;
};

export default Game;

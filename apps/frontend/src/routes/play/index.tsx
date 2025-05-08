import React from 'react';
import { socket } from '@/lib/socket';
import { useNavigate } from 'react-router';

const FindGame = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!socket.sessionId) {
      navigate('/');
      return;
    }

    localStorage.setItem('sessionId', socket.sessionId);

    const onPlayGame = (gameId: string) => {
      navigate(`/game/${gameId}`, { replace: true });
    };

    socket.on('play-game', onPlayGame);

    return () => {
      socket.off('play-game', onPlayGame);
    };
  }, []);

  return <div>Find Game</div>;
};

export default FindGame;

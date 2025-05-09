import React from 'react';
import { socket } from '@/lib/socket';
import { useNavigate } from 'react-router';
import CreateGameDialog from '@/components/create-game';

const FindGame = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = React.useState<boolean>(socket.connected);

  React.useEffect(() => {
    const onSession = ({ sessionId, gameId }: { sessionId: string; gameId?: string }) => {
      socket.auth = { sessionId };
      localStorage.setItem('sessionId', sessionId);
      if (gameId) {
        socket.gameId = gameId;
        navigate(`/play/${gameId}`);
      } else {
        socket.emit('find-opponent', socket.timeControl);
      }
    };

    const onFoundOpponent = (gameId: string) => {
      socket.gameId = gameId;
      socket.emit('play-game', gameId);
      navigate(`/play/${gameId}`);
    };

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onConnectError = () => {
      console.log('There was an error');
    };

    socket.on('session', onSession);
    socket.on('found-opponent', onFoundOpponent);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('session');
      socket.off('found-opponent');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  return (
    <div className='p-5 w-full'>
      <CreateGameDialog isConnected={isConnected} />
    </div>
  );
};

export default FindGame;

import React from 'react';
import { socket } from '@/lib/socket';
import { useNavigate } from 'react-router';
import CreateGameDialog from '@/components/create-game';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';

const FindGame = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isConnected, setIsConnected] = React.useState<boolean>(socket.connected);

  React.useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit('find-opponent', socket.timeControl);
    };

    const onFoundOpponent = (sessionId: string, gameId: string) => {
      socket.auth = { userId: user?.id, sessionId };
      localStorage.setItem('sessionId', sessionId);
      navigate(`/play/${gameId}`);
    };

    const onDisconnect = () => {
      toast.error('You have been disconnected.');
      setIsConnected(false);
    };

    const onConnectError = (error: Error) => {};

    socket.on('connect', onConnect);
    socket.on('found-opponent', onFoundOpponent);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect');
      socket.off('found-opponent');
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

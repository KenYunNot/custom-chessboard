import React from 'react';
import { socket } from '@/lib/socket';
import { useNavigate, useParams } from 'react-router';
import Board from '@/components/board';
import { Chess, type Color, type Move, type Square } from 'chess.js';
import { toast } from 'sonner';
import { match } from 'ts-pattern';
import { useUser } from '@clerk/clerk-react';

const PlayGame = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { user } = useUser();
  const [isConnected, setIsConnected] = React.useState<boolean>(socket.connected);
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen());
  const [color, setColor] = React.useState<Color>();
  const [opponentId, setOpponentId] = React.useState<string>();
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
  const [popupContent, setPopupContent] = React.useState<{ title: string; message: string } | null>(null);

  React.useEffect(() => {
    if (!user) return;

    const gameId = localStorage.getItem('gameId');
    if (gameId) {
      socket.auth = { userId: user?.id, gameId };
      socket.connect();
    } else {
      navigate('/play');
    }

    const onConnect = () => {
      setIsConnected(true);
    };

    const onConnectError = (error: Error) => {
      toast.error(error.message);
      localStorage.removeItem('gameId');
      navigate('/play');
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect');
      socket.off('connect_error');
    };
  }, [user]);

  React.useEffect(() => {
    if (!isConnected) return;

    socket.emit('play-game', gameId);

    const onInvalidGame = () => {
      navigate('/play');
    };

    const onNotYourGame = (gameId: string) => {
      navigate(`/play/${gameId}`);
    };

    const onSession = ({ color, opponentId, fen }: { color: Color; opponentId: string; fen: string }) => {
      chess.load(fen);
      setFen(chess.fen());
      setColor(color);
      setOpponentId(opponentId);
    };

    const onMove = (move: Move) => {
      console.log('Got the move!');
      chess.move({
        from: move.from,
        to: move.to,
      });
      setFen(chess.fen());
    };

    const onInvalidMove = (oldFen: string) => {
      chess.load(oldFen);
      toast.error('Invalid move!');
    };

    const onCheckmate = (isWinner: boolean) => {
      setPopupContent({
        title: 'Game Over',
        message: isWinner ? 'You won by checkmate!' : 'Opponent won by checkmate.',
      });
      setIsGameOver(true);
    };

    const onDraw = (results: {
      stalemate: boolean;
      repetition: boolean;
      fiftyMoveRule: boolean;
      insufficientMaterial: boolean;
    }) => {
      const message = match(results)
        .with({ stalemate: true }, () => 'by stalemate.')
        .with({ repetition: true }, () => 'by three-fold repetition.')
        .with({ fiftyMoveRule: true }, () => 'by fifty move rule.')
        .with({ insufficientMaterial: true }, () => 'by insufficient material.')
        .otherwise(() => 'by game rule.');
      setPopupContent({
        title: 'Draw',
        message,
      });
    };

    socket.on('session', onSession);
    socket.on('invalid-game', onInvalidGame);
    socket.on('not-your-game', onNotYourGame);
    socket.on('move', onMove);
    socket.on('invalid-move', onInvalidMove);
    socket.on('checkmate', onCheckmate);
    socket.on('draw', onDraw);

    return () => {
      socket.off('session');
      socket.off('invalid-game');
      socket.off('not-your-game');
      socket.off('move');
      socket.off('invalid-move');
      socket.off('checkmate');
      socket.off('draw');
    };
  }, [isConnected]);

  const onDrop = (from: Square, to: Square) => {
    if (from === to) return;
    if (chess.turn() !== color) return;
    try {
      const move = chess.move({
        from,
        to,
      });
      setFen(chess.fen());
      socket.emit('move', move);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-full h-full'>
      <div className='w-auto h-full relative'>
        {isGameOver && (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit p-5 flex flex-col items-center justify-center gap-3 bg-body-foreground text-white rounded-md z-50'>
            <p className='text-2xl font-bold'>{popupContent?.title}</p>
            {popupContent?.message}
          </div>
        )}
        <Board
          fen={fen}
          orientation={color}
          onDrop={onDrop}
        />
      </div>
    </div>
  );
};

export default PlayGame;

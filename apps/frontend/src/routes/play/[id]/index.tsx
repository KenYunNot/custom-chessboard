import React from 'react';
import { socket } from '@/lib/socket';
import { useNavigate, useParams } from 'react-router';
import Board from '@/components/board';
import { Chess, type Move, type Square } from 'chess.js';
import { toast } from 'sonner';
import { match } from 'ts-pattern';

const PlayGame = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen());
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
  const [popupContent, setPopupContent] = React.useState<{ title: string; message: string } | null>(null);

  React.useEffect(() => {
    if (!socket.gameId) {
      navigate('/play');
      return;
    } else if (socket.gameId !== gameId) {
      navigate(`/play/${socket.gameId}`);
      return;
    }

    socket.emit('play-game', gameId);

    socket.on('move', (move: Move) => {
      console.log('Got the move!');
      chess.move({
        from: move.from,
        to: move.to,
      });
      setFen(chess.fen());
    });
    socket.on('invalid-move', (oldFen: string) => {
      chess.load(oldFen);
      toast.error('Invalid move!');
    });
    socket.on('checkmate', (isWinner: boolean) => {
      setPopupContent({
        title: 'Game Over',
        message: isWinner ? 'You won by checkmate!' : 'Opponent won by checkmate.',
      });
      setIsGameOver(true);
    });
    socket.on(
      'draw',
      (results: { stalemate: boolean; repetition: boolean; fiftyMoveRule: boolean; insufficientMaterial: boolean }) => {
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
      }
    );

    return () => {
      socket.off('move');
      socket.off('invalid-move');
    };
  }, []);

  const onDrop = (from: Square, to: Square) => {
    if (from === to) return;
    if (chess.turn() !== socket.color) return;
    try {
      const move = chess.move({
        from,
        to,
      });
      setFen(chess.fen());
      socket.emit('move', move);
    } catch (error) {}
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
          orientation={socket.color}
          onDrop={onDrop}
        />
      </div>
    </div>
  );
};

export default PlayGame;

import React from 'react';
import { socket } from '@/lib/socket';
import { useNavigate, useParams } from 'react-router';
import Board from '@/components/board';
import { Chess, type Move, type Square } from 'chess.js';
import { toast } from 'sonner';

const PlayGame = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen());

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
      <Board
        fen={fen}
        orientation={socket.color}
        onDrop={onDrop}
      />
    </div>
  );
};

export default PlayGame;

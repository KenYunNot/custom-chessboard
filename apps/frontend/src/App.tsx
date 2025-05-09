import React from 'react';
import { Chess, type Move, type Square } from 'chess.js';
import Board from '@/components/board';
import MoveHistory from '@/components/move-history';

function App() {
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen());
  const [isBoardFlipped, _] = React.useState(false);

  const onDrop = (from: Square, to: Square) => {
    try {
      if (fen !== chess.fen()) return;
      // const _ = chess.move({
      chess.move({
        from,
        to,
        promotion: 'q',
      });
      setFen(chess.fen());
    } catch (error) {}
  };

  const viewPastBoardState = (move: Move) => {
    setFen(move.after);
  };

  return (
    <div className='w-full h-screen p-20'>
      <div className='flex w-full h-full'>
        <Board
          fen={fen}
          orientation={isBoardFlipped ? 'b' : 'w'}
          onDrop={onDrop}
        />
        <MoveHistory
          history={chess.history({ verbose: true })}
          currentFen={fen}
          viewPastBoardState={viewPastBoardState}
        />
      </div>
    </div>
  );
}

export default App;

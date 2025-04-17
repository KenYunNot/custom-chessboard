import React from 'react';
import type { Move, Square } from 'chess.js';
import { Chess } from 'chess.js';
import Board from '@/components/board';
import MoveHistory from '@/components/move-history';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

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
    <div className='w-full h-screen flex justify-center p-20'>
      <SignedOut>
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
      </SignedOut>
      <SignedIn>
        <div className='flex items-center gap-3'>
          <button className='w-36 h-12 bg-accent-primary text-white text-shadow-xs text-shadow-neutral-500 font-semibold rounded-md hover:bg-accent-secondary hover:cursor-pointer'>
            Create Game
          </button>
          <button className='w-36 h-12 bg-accent-primary text-white text-shadow-xs text-shadow-neutral-500 font-semibold rounded-md hover:bg-accent-secondary hover:cursor-pointer'>
            Find Game
          </button>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;

import React from 'react';
import type { Move, Square } from 'chess.js';
import { Chess } from 'chess.js';
import Board from "./ui/board";
import MoveHistory from './ui/move-history';
import type { Arrow } from './ui/overlays/arrows';


function App() {
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen())
  const [isBoardFlipped, setIsBoardFlipped] = React.useState(false);
  // const [mostRecentMove, setMostRecentMove] = React.useState<Move | null>(null);

  const onDrop = (from: Square, to: Square) => {
    try {
      if (fen !== chess.fen()) return;
      const move = chess.move({
        from,
        to,
        promotion: 'q',
      });
      setFen(chess.fen());
    } catch(error) {

    }
  }

  const viewPastBoardState = (move: Move) => {
    setFen(move.after);
  }

  return (
    <div className="App">
      <div className="w-full h-screen flex justify-center p-20">
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

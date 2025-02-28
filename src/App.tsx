import React from 'react';
import type { Move, Square } from 'chess.js';
import { Chess } from 'chess.js';
import Board from "./ui/board";
import MoveHistory from './ui/move-history';


function App() {
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen())
  const [isBoardFlipped, setIsBoardFlipped] = React.useState(false);
  const [highlightedSquares, setHighlightedSquares] = React.useState<{ [key in Square]?: string }>({});
  const [mostRecentMove, setMostRecentMove] = React.useState<Move>();

  const RED = 'rgb(235, 97, 80, 0.8)';
  const YELLOW = 'rgb(255, 255, 51, 0.5)';

  const onDrop = (source: Square, target: Square) => {
    try {
      if (fen !== chess.fen()) return;
      const move = chess.move({
        from: source,
        to: target,
        promotion: 'q',
      });
      setMostRecentMove(move);
      setFen(chess.fen());
    } catch(error) {

    }
  }

  const onPieceClick = (square: Square) => {
    
  }

  const onSquareMouseDown = (square: Square) => {
    
  }
  
  const onSquareMouseUp = (square: Square) => {
    
  }

  const onSquareRightMouseUp = (square: Square) => {

  }

  const onSquareRightMouseDown = (square: Square) => {

  }

  const viewPastBoardState = (move: Move) => {
    setFen(move.after);
    setMostRecentMove(move);
  }

  return (
    <div className="App">
      <div className="w-full h-screen flex justify-center p-20">
        <Board 
          fen={fen} 
          orientation={isBoardFlipped ? 'b' : 'w'}
          highlightedSquares={highlightedSquares}
          onDrop={onDrop}
          onPieceClick={onPieceClick}
          onSquareMouseDown={onSquareMouseDown}
          onSquareMouseUp={onSquareMouseUp}
          onSquareRightMouseDown={onSquareRightMouseDown}
          onSquareRightMouseUp={onSquareRightMouseUp}
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

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
  const [highlightedSquares, setHighlightedSquares] = React.useState<{ [key: string]: string }>({});
  const [arrows, setArrows] = React.useState<{ [key: string]: Arrow }>({});
  const [mostRecentMove, setMostRecentMove] = React.useState<Move | null>(null);
  
  const [clickStart, setClickStart] = React.useState<Square | null>(null);

  const RED = 'rgb(235, 97, 80, 0.8)';
  const ORANGE = 'rgba(255, 170, 0, 0.8)';

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

  const onPieceClick = (square: Square) => {
    
  }

  const onSquareMouseDown = (square: Square) => {
    setArrows({});
    setHighlightedSquares({})
  }
  
  const onSquareMouseUp = (square: Square) => {
    
  }

  const onSquareRightMouseDown = (square: Square) => {
    setClickStart(square)
  }

  const onSquareRightMouseUp = (square: Square) => {
    if (!clickStart) return;
    if (clickStart === square) {
      setHighlightedSquares(prev => {
        let copy = { ...prev }
        if (square in copy)
          delete copy[square];
        else
          copy[square] = RED;
        return copy;
      })
    } else {
      setArrows(prev => {
        let copy = { ... prev }
        const arrowKey = `${clickStart}-${square}`;
        if (arrowKey in copy) 
          delete copy[arrowKey];
        else 
          copy[arrowKey] = { from: clickStart, to: square, color: ORANGE };
        return copy;
      })
    }
    setClickStart(null);
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
          highlightedSquares={highlightedSquares}
          arrows={arrows}
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

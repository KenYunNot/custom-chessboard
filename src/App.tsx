import React from 'react';
import type { Square } from 'chess.js';
import { Chess } from 'chess.js';
import Board from "./ui/board";
import Chessboard from 'chessboardjsx';
import MoveHistory from './ui/move-history';


function App() {
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen())
  const [isBoardFlipped, setIsBoardFlipped] = React.useState(false);
  const [highlightedSquares, setHighlightedSquares] = React.useState<{ [key in Square]?: string }>({});

  const onDrop = (source: Square, target: Square) => {
    try {
      chess.move({
        from: source,
        to: target,
        promotion: 'q',
      });
      setFen(chess.fen());
    } catch(error) {

    }
  }

  const onSquareRightClick = (square: Square) => {
    setHighlightedSquares(prevSquares => {
      const newSquares = { ...prevSquares };
      if (square in newSquares)
        delete newSquares[square]
      else
        newSquares[square] = 'red';
      return newSquares;
    })
  }

  return (
    <div className="App">
      <div className="w-full h-screen flex justify-center items-center p-20">
        <Board 
          fen={fen} 
          orientation={isBoardFlipped ? 'b' : 'w'}
          highlightedSquares={highlightedSquares}
          onDrop={onDrop}
          onSquareRightClick={onSquareRightClick}
        />
        {/* <Chessboard position='start' /> */}
        {/* <MoveHistory history={chess.history()} /> */}
      </div>
    </div>
  );
}

export default App;

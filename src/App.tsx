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
      setHighlightedSquares(prev => {
        const copy = { ...prev };
        copy[move.from] = YELLOW;
        copy[move.to] = YELLOW;
        if (mostRecentMove) {
          delete copy[mostRecentMove.from];
          delete copy[mostRecentMove.to];
        }
        return copy;
      })
      setMostRecentMove(move);
      setFen(chess.fen());
    } catch(error) {

    }
  }

  const onPieceClick = (square: Square) => {
    setHighlightedSquares(mostRecentMove ? {
      [mostRecentMove.from]: YELLOW,
      [mostRecentMove.to]: YELLOW,
    }: {});
  }

  const onSquareClick = (square: Square) => {
    setHighlightedSquares(mostRecentMove ? {
      [mostRecentMove.from]: YELLOW,
      [mostRecentMove.to]: YELLOW,
    }: {});
  }

  const onSquareRightClick = (square: Square) => {
    setHighlightedSquares(prev => {
      const copy = { ...prev };
      if (square in copy && copy[square] === RED) {
        if (square === mostRecentMove?.from) 
          copy[square] = YELLOW;
        else if (square === mostRecentMove?.to) 
          copy[square] = YELLOW;
        else 
          delete copy[square];
      } else {
        copy[square] = RED;
      }
      return copy;
    });
  }

  const viewPastBoardState = (move: Move) => {
    setFen(move.after);
    setMostRecentMove(move);
    setHighlightedSquares(move ? {
      [move.from]: YELLOW,
      [move.to]: YELLOW,
    }: {});
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
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
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

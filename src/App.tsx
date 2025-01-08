import React from 'react';
import { Chess } from 'chess.js';
import Board from "./ui/board";
import Chessboard from 'chessboardjsx';
import MoveHistory from './ui/move-history';
import { DndContext } from '@dnd-kit/core';

type Move = {
  from: string,
  to: string,
}

function App() {
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen())

  const makeMove = React.useCallback((move: Move) => {
    try {
      const result = chess.move(move);
      setFen(chess.fen());
    } catch(e) {
      return null;
    }
  }, [chess])

  const onPieceDrop = (from: string, to: string) => {
    const move = makeMove({ from, to });

    return move !== null;
  }

  return (
    <div className="App">
      <div className="w-full h-screen flex justify-center items-center p-20">
        <DndContext modifiers={[]}>
          <Board fen={fen} onPieceDrop={onPieceDrop}/>
        </DndContext>
        <Chessboard position='start' />
        {/* <MoveHistory history={chess.history()} /> */}
      </div>
    </div>
  );
}

export default App;

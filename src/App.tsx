import React from 'react';
import { Chess } from 'chess.js';
import Board from "./ui/board";
import Chessboard from 'chessboardjsx';
import MoveHistory from './ui/move-history';


type Move = {
  from: string,
  to: string,
}

function App() {
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen())
  const [isBoardFlipped, setIsBoardFlipped] = React.useState(false);

  return (
    <div className="App">
      <div className="w-full h-screen flex justify-center items-center p-20">
        <Board 
          fen={fen} 
          orientation={isBoardFlipped ? 'b' : 'w'}
        />
        {/* <Chessboard position='start' /> */}
        {/* <MoveHistory history={chess.history()} /> */}
      </div>
    </div>
  );
}

export default App;

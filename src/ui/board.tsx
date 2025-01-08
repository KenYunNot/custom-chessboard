import React from "react";
import Piece from "./piece";
import Square from "./square";
import { convertFenToBoard } from "../utils/helpers";

import './styles/board.css';


const Board = ({ 
  fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  onPieceDrop 
} : {
  fen?: string;
  onPieceDrop: (source: string, target: string) => void,
}) => {
  const position = convertFenToBoard(fen);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const boardRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div
      id='board'
      ref={boardRef}
      className="flex flex-wrap aspect-square w-full max-w-5xl h-auto bg-gray-100"
    >
      {position.map((row, r) => {
        return row.map((piece, c) => {
          return (
            <Square
              row={8-r}
              col={c+1}
            >
              {piece ? <Piece key={`${r}${c}`} {...piece} /> : null}
            </Square>
          )
        })
      })}
    </div>
  );
};

export default Board;

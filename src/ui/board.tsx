import React from "react";
import type { Color } from "chess.js";
import Piece from "./piece";
import Square from "./square";
import NotationOverlay from "./overlays/notation";
import { convertFenToBoard } from "../utils/helpers";
import { DndContext } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { restrictToBoard } from "../utils/dnd-modifiers/restrictToBoard";

import './styles/board.css';


type BoardProps = {
  fen?: string;
  orientation?: Color;
}

const Board = ({ 
  fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  orientation="w",
} : BoardProps) => {
  const position = convertFenToBoard(fen);
  const boardRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <DndContext modifiers={[restrictToBoard, snapCenterToCursor]}>
      <div
        id='board'
        ref={boardRef}
        className="relative aspect-square w-full max-w-5xl h-auto"
      >
        <NotationOverlay orientation={orientation} />
        <div className="relative flex flex-wrap w-full h-full z-10">
          {[...Array(8)].map((_, r) => {
            return [...Array(8)].map((_, c) => {
              const [row, col] = orientation === 'w' ? [r, c] : [7-r, 7-c]
              const piece = position[row][col];
              return (
                <Square
                  row={r}
                  col={c}
                >
                  {piece ? <Piece key={`${r}${c}`} {...piece} /> : null}
                </Square>
              )
            })
          })}
        </div>
      </div>
    </DndContext>
  );
};

export default Board;

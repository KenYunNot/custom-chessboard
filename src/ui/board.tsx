import React from "react";
import type { Color, Square } from "chess.js";
import { DEFAULT_POSITION } from "chess.js";
import Piece from "./piece";
import BoardSquare from "./square";
import HighlightsOverlay from "./overlays/highlights";
import NotationOverlay from "./overlays/notation";
import { convertFenToBoard } from "../utils/helpers";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { restrictToBoard } from "../utils/dnd-modifiers/restrictToBoard";

import './styles/board.css';


type BoardProps = {
  fen?: string;
  orientation?: Color;
  highlightedSquares?: { [key in Square]? : string };
  onDrop?: ((source: Square, target: Square) => void) | (() => void);
  onPieceClick?: ((square: Square) => void) | (() => void);
  onSquareClick?: ((square: Square) => void) | (() => void);
  onSquareRightClick?: ((square: Square) => void) | (() => void);
}

const Board = ({ 
  fen=DEFAULT_POSITION,
  orientation="w",
  highlightedSquares={},
  onDrop=() => {},
  onPieceClick=() => {},
  onSquareClick=() => {},
  onSquareRightClick=() => {},
} : BoardProps) => {
  const position = convertFenToBoard(fen);
  const boardRef = React.useRef<HTMLDivElement | null>(null);

  const handleOnDragEnd = (event: DragEndEvent) => {
    if (!event.active || !event.over) return;

    const source = event.active.id as Square;
    const target = event.over.id as Square;
    onDrop(source, target);
  }

  return (
    <DndContext modifiers={[restrictToBoard, snapCenterToCursor]} onDragEnd={handleOnDragEnd}>
      <div
        id='board'
        ref={boardRef}
        className="relative aspect-square w-auto h-auto max-h-full"
      >
        <NotationOverlay orientation={orientation} />
        <HighlightsOverlay orientation={orientation} highlightedSquares={highlightedSquares} />
        <div className="relative flex flex-wrap w-full h-full z-10">
          {[...Array(8)].map((_, r) => {
            return [...Array(8)].map((_, c) => {
              const [row, col] = orientation === 'w' ? [r, c] : [7-r, 7-c]
              const { square, type, color } = position[row][col];
              return (
                <BoardSquare
                  square={square}
                  onSquareClick={onSquareClick}
                  onSquareRightClick={onSquareRightClick}
                >
                  {type && color ? 
                    <Piece 
                      key={`${r}${c}`} 
                      onPieceClick={onPieceClick}
                      square={square}
                      type={type}
                      color={color}
                    /> : null}
                </BoardSquare>
              )
            })
          })}
        </div>
      </div>
    </DndContext>
  );
};

export default Board;

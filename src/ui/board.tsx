import React from "react";
import type { Color, Square } from "chess.js";
import Piece from "./piece";
import BoardSquare from "./square";
import HighlightsOverlay from "./overlays/highlights";
import NotationOverlay from "./overlays/notation";
import { convertFenToBoard } from "../utils/helpers";
import { DndContext } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { restrictToBoard } from "../utils/dnd-modifiers/restrictToBoard";

import './styles/board.css';


type BoardProps = {
  fen?: string;
  orientation?: Color;
  onDrop?: Function;
  onPieceClick?: Function;
}

const Board = ({ 
  fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  orientation="w",
  onDrop=() => {},
  onPieceClick=() => {},
} : BoardProps) => {
  const position = convertFenToBoard(fen);
  const boardRef = React.useRef<HTMLDivElement | null>(null);
  const [highlightedSquares, setHighlightedSquares] = React.useState<{ [key: string]: string }>({})

  const onSquareRightClick = (square: Square, color: string) => {
    setHighlightedSquares(prevSquares => {
      const newSquares = { ...prevSquares };
      if (newSquares[square] === color)
        delete newSquares[square]
      else
        newSquares[square] = color;
      return newSquares;
    })
  }

  return (
    <DndContext modifiers={[restrictToBoard, snapCenterToCursor]}>
      <div
        id='board'
        ref={boardRef}
        className="relative aspect-square w-full max-w-5xl h-auto"
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
                  onDrop={onDrop}
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

import React from 'react';
import type { Color, Square } from 'chess.js';
import { DEFAULT_POSITION } from 'chess.js';
import Piece from './piece';
import BoardSquare from './square';
import HighlightsOverlay from './overlays/highlights';
import NotationOverlay from './overlays/notation';
import type { Arrow } from './overlays/arrows';
import ArrowsOverlay from './overlays/arrows';
import { convertFenToBoard } from '../utils/helpers';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { restrictToBoard } from '../utils/dnd-modifiers/restrictToBoard';

import './styles/board.css';

type BoardProps = {
  fen?: string;
  orientation?: Color;
  onDrop?: (source: Square, target: Square) => void;
  onPieceClick?: (square: Square) => void;
  onSquareMouseDown?: (square: Square) => void;
  onSquareMouseUp?: (square: Square) => void;
  onSquareRightMouseDown?: (square: Square) => void;
  onSquareRightMouseUp?: (square: Square) => void;
};

const Board = ({
  fen = DEFAULT_POSITION,
  orientation = 'w',
  onDrop = () => {},
  onPieceClick = () => {},
  onSquareMouseDown = () => {},
  onSquareMouseUp = () => {},
  onSquareRightMouseDown = () => {},
  onSquareRightMouseUp = () => {},
}: BoardProps) => {
  const position = convertFenToBoard(fen);
  const boardRef = React.useRef<HTMLDivElement | null>(null);
  const [highlightedSquares, setHighlightedSquares] = React.useState<{ [key: string]: string }>({});
  const [arrows, setArrows] = React.useState<{ [key: string]: Arrow }>({});
  const [clickStart, setClickStart] = React.useState<Square | null>(null);

  const RED = 'rgb(235, 97, 80, 0.8)';
  const ORANGE = 'rgba(255, 170, 0, 0.8)';

  const handleOnDragEnd = (event: DragEndEvent) => {
    if (!event.active || !event.over) return;

    const source = event.active.id as Square;
    const target = event.over.id as Square;
    onDrop(source, target);
  };

  const _onSquareMouseDown = (square: Square) => {
    onSquareMouseDown(square);
    setArrows({});
    setHighlightedSquares({});
  };

  const _onSquareMouseUp = (square: Square) => {
    onSquareMouseUp(square);
  };

  const _onSquareRightMouseDown = (square: Square) => {
    onSquareRightMouseDown(square);
    setClickStart(square);
  };

  const _onSquareRightMouseUp = (square: Square) => {
    onSquareRightMouseUp(square);

    if (!clickStart) return;
    if (clickStart === square) {
      setHighlightedSquares((prev) => {
        let copy = { ...prev };
        if (square in copy) delete copy[square];
        else copy[square] = RED;
        return copy;
      });
    } else {
      setArrows((prev) => {
        let copy = { ...prev };
        const arrowKey = `${clickStart}-${square}`;
        if (arrowKey in copy) delete copy[arrowKey];
        else copy[arrowKey] = { from: clickStart, to: square, color: ORANGE };
        return copy;
      });
    }
    setClickStart(null);
  };

  return (
    <DndContext
      modifiers={[restrictToBoard, snapCenterToCursor]}
      onDragEnd={handleOnDragEnd}
    >
      <div
        id='board'
        ref={boardRef}
        className='relative aspect-square w-auto h-auto max-h-full m-5'
      >
        <NotationOverlay orientation={orientation} />
        <HighlightsOverlay
          highlightedSquares={highlightedSquares}
          orientation={orientation}
        />
        <ArrowsOverlay
          arrows={arrows}
          orientation={orientation}
        />
        <div className='absolute flex flex-wrap w-full h-full'>
          {[...Array(8)].map((_, r) => {
            return [...Array(8)].map((_, c) => {
              const [row, col] = orientation === 'w' ? [r, c] : [7 - r, 7 - c];
              const { square, type, color } = position[row][col];
              return (
                <BoardSquare
                  square={square}
                  onSquareMouseDown={_onSquareMouseDown}
                  onSquareMouseUp={_onSquareMouseUp}
                  onSquareRightMouseDown={_onSquareRightMouseDown}
                  onSquareRightMouseUp={_onSquareRightMouseUp}
                >
                  {type && color ? (
                    <Piece
                      key={`${r}${c}`}
                      onPieceClick={onPieceClick}
                      square={square}
                      type={type}
                      color={color}
                    />
                  ) : null}
                </BoardSquare>
              );
            });
          })}
        </div>
      </div>
    </DndContext>
  );
};

export default Board;

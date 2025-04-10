import React from 'react';
import type { Square } from 'chess.js';
import { cn } from '../utils/cn';
import { useDroppable } from '@dnd-kit/core';

type SquareProps = {
  square: Square;
  onSquareMouseDown?: (square: Square) => void;
  onSquareMouseUp?: (square: Square) => void;
  onSquareRightMouseDown?: (square: Square) => void;
  onSquareRightMouseUp?: (square: Square) => void;
  children?: React.ReactNode;
};

const Square = ({
  square,
  onSquareMouseDown = () => {},
  onSquareMouseUp = () => {},
  onSquareRightMouseDown = () => {},
  onSquareRightMouseUp = () => {},
  children,
}: SquareProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: square,
  });

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (event.button === 0) onSquareMouseDown(square);
    if (event.button === 2) onSquareRightMouseDown(square);
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    if (event.button === 0) onSquareMouseUp(square);
    if (event.button === 2) onSquareRightMouseUp(square);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(`square ${square}`, isOver && 'shadow-[0_0_0_4px_inset_#fcd34d]')}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
};

export default React.memo(Square);

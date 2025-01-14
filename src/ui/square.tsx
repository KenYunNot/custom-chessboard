import React from 'react'
import type { Square } from 'chess.js';
import { cn } from '../utils/cn';
import { useDroppable } from '@dnd-kit/core';


type SquareProps = {
  square: Square;
  onSquareClick?: ((square: Square) => void) | (() => void);
  onSquareRightClick?: ((square: Square) => void) | (() => {});
  children?: React.ReactNode;
}

const Square = ({
  square,
  onSquareClick=() => {},
  onSquareRightClick=() => {},
  children,
}: SquareProps) => {
  const { setNodeRef, over, isOver } = useDroppable({
    id: square,
  })

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (event.button === 0) onSquareClick(square);
    if (event.button === 2) onSquareRightClick(square);
  }

  return (
    <div 
      ref={setNodeRef} 
      className={cn(`square ${square}`, isOver && 'shadow-[0_0_0_4px_inset_#fcd34d]')}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  )
}

export default React.memo(Square)
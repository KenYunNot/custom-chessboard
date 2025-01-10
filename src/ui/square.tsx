import React from 'react'
import type { Square } from 'chess.js';
import { cn } from '../utils/cn';
import { useDroppable } from '@dnd-kit/core';


type SquareProps = {
  square: Square;
  onSquareRightClick?: ((square: Square) => void) | (() => {});
  children?: React.ReactNode;
}

const Square = ({
  square,
  onSquareRightClick=() => {},
  children,
}: SquareProps) => {
  const { setNodeRef, over, isOver } = useDroppable({
    id: square,
  })

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onSquareRightClick(square);
  }

  return (
    <div 
      ref={setNodeRef} 
      className={cn(`square ${square}`, isOver && 'shadow-[0_0_0_4px_inset_#fcd34d]')}
      onContextMenu={handleRightClick}
    >
      {children}
    </div>
  )
}

export default React.memo(Square)
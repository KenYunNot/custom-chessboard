import React from 'react'
import { cn } from '../utils/cn';
import { useDroppable } from '@dnd-kit/core';


type SquareProps = {
  row: number;
  col: number;
  children?: React.ReactNode;
}

const Square = ({
  row,
  col,
  children,
}: SquareProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${row}-${col}`
  })

  return (
    <div ref={setNodeRef} className={cn(`square ${row}${col}`, isOver && {
      'shadow-[0_0_0_4px_inset_#e5e7eb]' : (row + col) % 2 === 0, // odd squares are light squares
      'shadow-[0_0_0_4px_inset_#d1d5db]' : (row + col) % 2 === 1, // even squares are dark square
    })}>
      {children}
    </div>
  )
}

export default Square
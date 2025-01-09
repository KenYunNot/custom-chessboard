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
    <div ref={setNodeRef} className={cn(`square ${8-row}${col+1}`, {
      'bg-[#ebecd0]' : (row + col) % 2 === 0, // even squares are light square
      'bg-[#749552]' : (row + col) % 2 === 1, // odd squares are dark squares
    }, 
    isOver && {
      'shadow-[0_0_0_4px_inset_#d1d5db]' : (row + col) % 2 === 0, // even squares are light square
      'shadow-[0_0_0_4px_inset_#e5e7eb]' : (row + col) % 2 === 1, // odd squares are dark squares
    })}>
      {children}
    </div>
  )
}

export default Square
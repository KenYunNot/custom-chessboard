import React from 'react'
import { cn } from '../utils/cn';
import { useDroppable } from '@dnd-kit/core';


type SquareProps = {
  row: number;
  col: number;
  onDrop?: Function;
  children?: React.ReactNode;
}

const Square = ({
  row,
  col,
  children,
}: SquareProps) => {
  const { setNodeRef, over, isOver } = useDroppable({
    id: `${row}-${col}`
  })

  return (
    <div ref={setNodeRef} className={cn(`square ${row}${col}`, isOver && 'shadow-[0_0_0_4px_inset_#fcd34d]')}>
      {children}
    </div>
  )
}

export default Square
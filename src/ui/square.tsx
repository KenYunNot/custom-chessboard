import React from 'react'
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
  const { setNodeRef } = useDroppable({
    id: `${row}-${col}`
  })

  return (
    <div ref={setNodeRef} className={`square ${row}${col}`}>
      {children}
    </div>
  )
}

export default Square
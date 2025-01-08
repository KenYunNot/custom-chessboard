import React from 'react'
import type { Square, PieceSymbol, Color } from 'chess.js'
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';


type PieceProps = {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

const Piece = ({
  square,
  type,
  color,
}: PieceProps) => {
  const { listeners, setNodeRef, transform } = useDraggable({
    id: square,
  });

  return (
    <div
      {...listeners} 
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      id={square}
      className={`piece ${color}${type} w-full h-full`}
    />
  )
}

export default Piece
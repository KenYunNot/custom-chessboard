import React from 'react'
import type { Square, PieceSymbol, Color } from 'chess.js'
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';


type PieceProps = {
  square: Square;
  type: PieceSymbol;
  color: Color;
  onPieceClick?: Function;
}

const Piece = ({
  square,
  type,
  color,
  onPieceClick=() => {},
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
      className={`piece ${color}${type}`}
    />
  )
}

export default Piece
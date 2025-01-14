import React from 'react'
import type { Square, PieceSymbol, Color } from 'chess.js'
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';


type PieceProps = {
  square: Square;
  type: PieceSymbol;
  color: Color;
  onPieceClick?: ((square: Square) => void) | (() => void);
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

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (event.button === 0) onPieceClick(square);
  }

  return (
    <div
      {...listeners} 
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      id={square}
      className={`piece ${color}${type}`}
      onMouseDown={handleMouseDown}
    />
  )
}

export default React.memo(Piece)
import type { Color, Square } from 'chess.js'
import React from 'react'
import { cn } from '../../utils/cn'


export type Arrow = {
  from: Square,
  to: Square,
  color: string,
}

const ArrowsOverlay = ({
  arrows,
  orientation,
}: {
  arrows: { [key: string] : Arrow },
  orientation: Color,
}) => {
  return (
    <svg viewBox='0 0 100 100' className={cn('absolute pointer-events-none z-50', {
      '-scale-100' : orientation === 'b',
    })}>
      {Object.entries(arrows).map(([key, arrow]) => <ArrowPolygon key={key} {...arrow} />)}
    </svg>
  )
}

const ArrowPolygon = ({
  from,
  to,
  color,
}: Arrow) => {
  const [fromFile, fromRank] = from.split('');
  const [toFile, toRank] = to.split('');
  const [fromCol, fromRow] = [fromFile.charCodeAt(0) - 'a'.charCodeAt(0), 8 - Number(fromRank)];
  const [toCol, toRow] = [toFile.charCodeAt(0) - 'a'.charCodeAt(0), 8 - Number(toRank)];
  const distance = Math.sqrt(Math.pow(toCol - fromCol, 2) + Math.pow(toRow - fromRow, 2)) + 1;
  const angle = -Math.atan((toCol - fromCol)/(toRow - fromRow)) * (180 / Math.PI) + (toRow - fromRow < 0 ? 180 : 0);

  // Points of the arrow polygon, starting from the tip and working in a clockwise direction
  const A = `${(fromCol + 0.5) * 12.5},${(fromRow + distance - 0.5) * 12.5}`;
  const B = `${(fromCol + 0.25) * 12.5},${(fromRow + distance - 0.875) * 12.5}`;
  const C = `${(fromCol + 0.375) * 12.5},${(fromRow + distance - 0.875) * 12.5}`;
  const D = `${(fromCol + 0.375) * 12.5},${(fromRow + 0.85) * 12.5}`;
  const E = `${(fromCol + 0.625) * 12.5},${(fromRow + 0.85) * 12.5}`;
  const F = `${(fromCol + 0.625) * 12.5},${(fromRow + distance - 0.875) * 12.5}`;
  const G = `${(fromCol + 0.75) * 12.5},${(fromRow + distance - 0.875) * 12.5}`;

  return (
    <polygon id={`arrow-${from}${to}`} points={`${A} ${B} ${C} ${D} ${E} ${F} ${G}`} fill={color} opacity={0.8} transform={`rotate(${angle} ${(fromCol + 0.5) * 12.5} ${(fromRow + 0.5) * 12.5})`} />
  )
}

export default React.memo(ArrowsOverlay)
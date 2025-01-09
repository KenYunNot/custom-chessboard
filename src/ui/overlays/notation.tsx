import React from 'react'
import type { Color } from 'chess.js';
import { cn } from '../../utils/cn';


type NotationOverlayProps = {
  orientation?: Color;
}

const NotationOverlay = ({
  orientation='w',
} : NotationOverlayProps) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <svg viewBox='0 0 100 100' className='absolute z-0' >
      {[...Array(8)].map((_, index) => (
        <text x={0.75} y={3.5 + (12.5 * index)} fontSize={2.8} fontWeight={500} fill={index % 2 === 1 ? '#ebecd0' : '#749552'}>
          {orientation === 'w' ? ranks[7-index] : ranks[index]}
        </text>
      ))}
      {[...Array(8)].map((_, index) => (
        <text x={10 + (12.5 * index)} y={99} fontSize={2.8} fontWeight={500} fill={index % 2 === 0 ? '#ebecd0' : '#749552'}>
          {orientation === 'w' ? files[index] : files[7-index]}
        </text>
      ))}
    </svg>
  )
}

export default NotationOverlay
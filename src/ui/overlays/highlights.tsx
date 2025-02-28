import React from 'react'
import type { Color, Square } from 'chess.js';
import { cn } from '../../utils/cn';


type HighlightsOverlayProps = {
  orientation: Color;
  highlightedSquares: { [key: string]: string };
}

const HighlightsOverlay = ({
  orientation,
  highlightedSquares,
} : HighlightsOverlayProps) => {
  return (
    <svg viewBox='0 0 100 100' className={cn('absolute z-0', {
      '-scale-100' : orientation === 'b',
    })}>
      {Object.entries(highlightedSquares).map(([ square, color ]) => {
        if (!highlightedSquares[square]) return;

        const [file, rank] = square.split('');
        const col = file.charCodeAt(0) - 'a'.charCodeAt(0);
        const row = 8 - Number(rank);
        return (
          <rect 
            key={square} 
            x={12.5 * col} 
            y={12.5 * row}
            width={12.5}
            height={12.5}
            fill={color}
          />
        )
      })}
    </svg>
  )
}

export default React.memo(HighlightsOverlay)
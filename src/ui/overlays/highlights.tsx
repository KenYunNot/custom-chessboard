import React from 'react'
import type { Color, Square } from 'chess.js';


type HighlightsOverlayProps = {
  orientation: Color;
  highlightedSquares: { [key: string]: string };
}

const HighlightsOverlay = ({
  orientation,
  highlightedSquares,
} : HighlightsOverlayProps) => {
  return (
    <svg viewBox='0 0 100 100' className='absolute z-0'>
      {Object.entries(highlightedSquares).map(([ square, color ]) => {
        const [file, rank] = square.split('');
        const col = file.charCodeAt(0) - 'a'.charCodeAt(0);
        const row = 8 - Number(rank);
        return (
          <rect 
            key={square} 
            x={12.5 * (orientation === 'w' ? col : 8-(col+1))} 
            y={12.5 * (orientation === 'w' ? row : 8-(row+1))}
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
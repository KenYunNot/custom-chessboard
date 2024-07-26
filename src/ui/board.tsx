import React from 'react'
import { Chess, DEFAULT_POSITION } from 'chess.js';
import Pattern from './pattern';
import { convertNotationToXY, getPieceIconURL } from '../utils/helpers';

const Board = ({
  fen=DEFAULT_POSITION,
}: {
  fen?: string;
}) => {
  const chess = React.useMemo(() => new Chess(fen), [fen]);

  return (
    <div 
      className='relative aspect-square w-auto h-full bg-gray-100'
    >
      <Pattern />
      <svg className='absolute w-full h-full'>
        {chess.board().map(row => {
          return row.map(cell => {
            if (!cell) return null;

            const {x, y} = convertNotationToXY(cell.square);
            
            return (
              <image
                href={getPieceIconURL(cell.type, cell.color)}
                className='aspect-square w-[12.5%] h-[12.5%]'
                x={`${12.5 * x}%`}
                y={`${12.5 * y}%`}
              />
            )
          })
        })}
      </svg>
    </div>
  )
}

export default Board;
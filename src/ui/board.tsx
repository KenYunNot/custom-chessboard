import React from 'react'
import { Chess, DEFAULT_POSITION } from 'chess.js';
import Pattern from './pattern';
import { convertNotationToRowCol, getPieceIconURL } from '../utils/helpers';
import useBoard from '../utils/hooks/useBoard';

const Board = ({
  fen=DEFAULT_POSITION,
}: {
  fen?: string;
}) => {
  const chess = React.useMemo(() => new Chess(fen), [fen]);
  const board = React.useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const {from, to} = useBoard(board, isFlipped);

  return (
    <div 
      ref={board}
      className='relative aspect-square w-auto h-full bg-gray-100'
    >
      <Pattern />
      <svg 
        id='pieces'
        className='absolute w-full h-full'
      >
        {chess.board().map(row => {
          return row.map(cell => {
            if (!cell) return null;

            const {row, col} = convertNotationToRowCol(cell.square, isFlipped);
            
            return (
              <image
                key={cell.square}
                id={cell.square}
                href={getPieceIconURL(cell.type, cell.color)}
                className='aspect-square w-[12.5%] h-[12.5%]'
                x={`${12.5 * row}%`}
                y={`${12.5 * col}%`}
              />
            )
          })
        })}
      </svg>
    </div>
  )
}

export default Board;
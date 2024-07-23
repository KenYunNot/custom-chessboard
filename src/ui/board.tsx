import React from 'react'
import { Chess } from 'chess.js';
import Cell from './cell';

const Board = ({
  fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
}: {
  fen?: string;
}) => {
  return (
    <div>
      Board
    </div>
  )
}

export default Board;
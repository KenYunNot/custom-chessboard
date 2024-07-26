import type { PieceSymbol, Color, Square } from 'chess.js'
import {
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
} from 'chess.js'

export const getPieceIconURL = (type: PieceSymbol, color: Color) => {
  switch (type) {
    case PAWN:
      return `/pieces/pawn-${color}.svg`;
    case ROOK:
      return `/pieces/rook-${color}.svg`;
    case KNIGHT:
      return `/pieces/knight-${color}.svg`;
    case BISHOP:
      return `/pieces/bishop-${color}.svg`;
    case QUEEN:
      return `/pieces/queen-${color}.svg`;
    case KING:
      return `/pieces/king-${color}.svg`;
    default:
      throw new Error('Invalid piece type');
  }
}

export const convertNotationToXY = (square: Square) => {
  const [file, rank] = square.split('');

  return {
    x: file.charCodeAt(0) - 'a'.charCodeAt(0),
    y: Number(rank) - 1,
  }
}
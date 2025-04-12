import type { Square, PieceSymbol, Color } from "chess.js";


const isLowerCase = (s: string) => {
  return s.toLowerCase() === s;
}

type BoardSquare = {
  square: Square;
  type?: PieceSymbol,
  color?: Color,
}
export const convertFenToBoard = (fen: string): Array<Array<BoardSquare>> => {
  return fen.split(' ')[0].split('/').map((line, row) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const squares = [];
    for (let token of line) {
      if (Number.isNaN(Number(token))) {
        squares.push({
          square: `${files[squares.length]}${8-row}` as Square,
          type: token.toLowerCase() as PieceSymbol,
          color: isLowerCase(token) ? 'b' : 'w' as Color,
        })
      } else {
        squares.push(...Array.from(Array(Number(token)), (_, i) => ({
          square: `${files[squares.length+i]}${8-row}` as Square,
        })));
      }
    }
    return squares;
  });
}
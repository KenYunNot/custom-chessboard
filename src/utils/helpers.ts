import type { PieceSymbol, Color, Square } from 'chess.js'


export type BoardCell = {
  square: Square,
  type: PieceSymbol,
  color: Color,
} | null;


export const fenToBoard = (fen: string): Array<Array<BoardCell>> => {
  const board: Array<Array<BoardCell>> = [];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const notationParts = fen.split(' ');
  const position = notationParts[0];
  const fenRows = position.split('/');

  for (let i = 0; i < 8; i++) {
    let boardRow: Array<BoardCell> = [];
    let fenRow = fenRows[i].split('');
    for (let j = 0; j < 8; j++) {
      if (Number(fenRow[j])) {
        boardRow.push(...new Array(Number(fenRow[j])).fill(null) as Array<BoardCell>);
        j += Number(fenRow[j]) - 1;
      } else {
        const square = `${files[j]}${ranks[i]}` as Square;
        const type = fenRow[j].toLowerCase() as PieceSymbol;
        const color = (fenRow[j].charCodeAt(0) >= 'a'.charCodeAt(0) ? 'b' : 'w') as Color;
        boardRow.push({
          square,
          type,
          color,
        });
      }
    }

    board.push(boardRow); 
  }

  return board;
}
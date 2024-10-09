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

  for (let row of fenRows) {
    let boardRow: Array<BoardCell> = [];
    let tokens = row.split('');
    for (let token of tokens) {
      if (Number(token)) {
        boardRow.push(...new Array(Number(token)).fill(null) as Array<BoardCell>);
      } else {
        const square = `${files[boardRow.length]}${ranks[board.length]}` as Square;
        const type = token.toLowerCase() as PieceSymbol;
        const color = (token.charCodeAt(0) >= 'a'.charCodeAt(0) ? 'b' : 'w') as Color;
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
const isLowerCase = (s: string) => {
  return s.toLowerCase() === s;
}

export const convertFenToBoard = (fen: string) => {
  return fen.split(' ')[0].split('/').map((line, row) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const pieces = [];
    for (let token of line) {
      if (Number.isNaN(Number(token))) {
        pieces.push({
          square: `${files[pieces.length]}${8-row}`,
          type: token.toLowerCase(),
          color: isLowerCase(token) ? 'b' : 'w',
        })
      } else {
        pieces.push(...Array.from(Array(Number(token)), _ => null));
      }
    }
    return pieces;
  });
}
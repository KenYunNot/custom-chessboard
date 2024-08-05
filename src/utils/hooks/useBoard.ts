import React from 'react'
import type { RefObject } from 'react';
import type { Square } from 'chess.js';

const useBoard = (boardRef: RefObject<HTMLDivElement>, isFlipped: boolean) => {
  const [from, setFrom] = React.useState<Square | null>(null);
  const [to, setTo] = React.useState<Square | null>(null);

  const calculateFileAndRank = (mouseX: number, mouseY: number) => {
    const offsetX = mouseX - boardRef.current!.offsetWidth;
    const offsetY = mouseY - boardRef.current!.offsetHeight;
    const row = Math.floor(offsetX / boardRef.current!.offsetWidth / 0.125);
    const col = Math.floor(offsetY / boardRef.current!.offsetHeight / 0.125);
    const file = isFlipped 
      ? String.fromCharCode('h'.charCodeAt(0) - row) 
      : String.fromCharCode(row + 'a'.charCodeAt(0));
    const rank = isFlipped
      ? col + 1
      : 8 - col;

    return { file, rank };
  }

  const handleMouseDown = (event: MouseEvent) => {
    const { file, rank } = calculateFileAndRank(event.pageX, event.pageY);

    setFrom(`${file}${rank}` as Square);
    setTo(null);
  }

  const handleMouseUp = (event: MouseEvent) => {
    const { file, rank } = calculateFileAndRank(event.pageX, event.pageY);

    setTo(`${file}${rank}` as Square);
  }

  const handleMouseMove = (event: MouseEvent) => {
    
  }

  React.useEffect(() => {
    const board = boardRef.current;

    board?.addEventListener('mousedown', handleMouseDown);
    board?.addEventListener('mouseup', handleMouseUp);

    return () => {
      board?.removeEventListener('mousedown', handleMouseDown);
      board?.removeEventListener('mouseup', handleMouseUp);
    }
  }, [boardRef])

  return {
    from,
    to,
  }
}

export default useBoard;
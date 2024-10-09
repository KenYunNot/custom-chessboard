import React from "react";
import { DEFAULT_POSITION } from "chess.js";
import { fenToBoard } from "../utils/helpers";

import '../styles/board.css';


type BoardOffsets = {
  x: number,
  y: number,
  width: number,
}

type BoardProps = {
  fen?: string,
  onPieceDrop: (source: string, target: string) => void,
}

const Board = ({ fen=DEFAULT_POSITION, onPieceDrop }: BoardProps) => {
  const board = React.useMemo(() => fenToBoard(fen), [fen]);
  const boardRef = React.useRef<HTMLDivElement | null>(null);
  const [from, setFrom] = React.useState<string>('');
  const [clickedPiece, setClickedPiece] = React.useState<HTMLDivElement | null>(null);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const getClick = (absoluteX: number, absoluteY: number) => {
    const offsetLeft = boardRef.current?.offsetLeft || 0;
    const offsetTop = boardRef.current?.offsetTop || 0;
    const offsetWidth = boardRef.current?.offsetWidth || 0

    const relativeX = absoluteX - offsetLeft;
    const relativeY = absoluteY - offsetTop;
    const file = isFlipped
      ? String.fromCharCode('h'.charCodeAt(0) - Math.floor(relativeX / offsetWidth / 0.125))
      : String.fromCharCode('a'.charCodeAt(0) + Math.floor(relativeX / offsetWidth / 0.125));
    const rank = isFlipped
      ? 1 + Math.floor(relativeY / offsetWidth / 0.125)
      : 8 - Math.floor(relativeY / offsetWidth / 0.125);
    
    return {
      x: relativeX, 
      y: relativeY,
      square: `${file}${rank}`
    }
  }

  const handleOnMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!clickedPiece) return;

    const { x, y } = getClick(event.pageX, event.pageY);
    const halfSquareWidth = (boardRef.current?.offsetWidth || 0) / 16;

    clickedPiece!.style.transform = `translate(${x - halfSquareWidth}px, ${y - halfSquareWidth}px)`;
  }

  const handleOnMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLDivElement)) return;
    if (!(event.target.classList.contains('piece'))) return;

    const { x, y, square } = getClick(event.pageX, event.pageY);
    const halfSquareWidth = (boardRef.current?.offsetWidth || 0) / 16;

    event.target.style.transform = `translate(${x - halfSquareWidth}px, ${y - halfSquareWidth}px)`;
    setClickedPiece(event.target);
    setFrom(square);
  }

  const handleOnMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!clickedPiece) return;

    const { square: to } = getClick(event.pageX, event.pageY);

    onPieceDrop(from, to);

    clickedPiece.style.transform = '';
    setClickedPiece(null);
  }

  return (
    <div
      id='board'
      ref={boardRef}
      className="relative aspect-square w-auto h-full bg-gray-100"
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onMouseMove={handleOnMouseMove}
    >
      <div className="absolute w-full h-full">
        {board.map((row) => {
          return row.map((piece) => {
            if (!piece) return null;

            const [file, rank] = piece!.square.split('');
            const col = isFlipped 
              ? 'h'.charCodeAt(0) - file.charCodeAt(0) 
              : file.charCodeAt(0) - 'a'.charCodeAt(0);
            const row = isFlipped 
              ? Number(rank) - 1 
              : 8 - Number(rank);

            return (
              <div
                key={piece.square}
                className={`piece square-${col}${row} ${piece!.color}${piece!.type} hover:cursor-grab`}
              />
            )
          });
        })}
      </div>
    </div>
  );
};

export default Board;

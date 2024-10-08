import React from "react";
import { DEFAULT_POSITION } from "chess.js";
import { fenToBoard } from "../utils/helpers";

import '../styles/board.css';


type BoardOffsets = {
  x: number,
  y: number,
}

const Board = ({ fen = DEFAULT_POSITION }: { fen?: string }) => {
  const board = React.useMemo(() => fenToBoard(fen), [fen]);
  const boardOffsets = React.useRef<BoardOffsets>({ x: 0, y: 0 })
  const [clickedPiece, setClickedPiece] = React.useState<HTMLDivElement | null>(null);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const handleOnMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!clickedPiece) return;

    const x = event.pageX - boardOffsets.current.x - clickedPiece!.offsetWidth/2;
    const y = event.pageY - boardOffsets.current.y - clickedPiece!.offsetWidth/2;
    clickedPiece!.style.transform = `translate(${x}px, ${y}px)`;
  }

  const handleOnMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLDivElement)) return;
    if (!(event.target.classList.contains('piece'))) return;

    const x = event.pageX - boardOffsets.current.x - event.target.offsetWidth/2;
    const y = event.pageY - boardOffsets.current.y - event.target.offsetWidth/2;
    event.target.style.transform = `translate(${x}px, ${y}px)`;
    setClickedPiece(event.target);
  }

  const handleOnMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!clickedPiece) return;

    clickedPiece.style.transform = '';
    setClickedPiece(null);
  }

  React.useEffect(() => {
    const board = document.getElementById('board');
    boardOffsets.current = {
      x: board!.offsetLeft,
      y: board!.offsetTop,
    }
  }, [])

  return (
    <div
      id='board'
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

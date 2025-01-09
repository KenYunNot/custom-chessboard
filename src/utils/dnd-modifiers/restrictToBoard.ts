import type { Modifier } from "@dnd-kit/core"
import type { ClientRect } from "@dnd-kit/core";
import { restrictToBoundingRect } from "./utilities/restrictToBoundingRect";


export const restrictToBoard: Modifier = ({
  transform,
  draggingNodeRect,
}) => {
  const board = document.getElementById('board');
  if (!board || !draggingNodeRect) {
    return transform;
  }

  const halfSquareWidth = board.offsetHeight / 16;

  const boardRect: ClientRect = {
    width: board.offsetWidth + (halfSquareWidth * 2),
    height: board.offsetHeight + (halfSquareWidth * 2),
    top: board.offsetTop - halfSquareWidth,
    left: board.offsetLeft - halfSquareWidth,
    bottom: board.offsetTop + board.offsetHeight + halfSquareWidth,
    right: board.offsetLeft + board.offsetWidth + halfSquareWidth,
  }

  return restrictToBoundingRect(
    transform,
    draggingNodeRect,
    boardRect,
  )
}
import { Board } from "../../models/Board";

export function manhattanDistanceHeuristic(board: Board): number {
  if (!board.primaryPiece || !board.exitPosition || !board.exitTag) {
    return Infinity;
  }

  const primary = board.primaryPiece;

  if (primary.orientation === "horizontal") {
    if (board.exitTag === "right") {
      const rightmost = primary.getTail();
      return Math.abs(rightmost.col - board.exitPosition.col);
    } else if (board.exitTag === "left") {
      const leftmost = primary.getHead();
      return Math.abs(leftmost.col - board.exitPosition.col);
    }
  } else if (primary.orientation === "vertical") {
    if (board.exitTag === "bottom") {
      const bottommost = primary.getTail();
      return Math.abs(bottommost.row - board.exitPosition.row);
    } else if (board.exitTag === "top") {
      const topmost = primary.getHead();
      return Math.abs(topmost.row - board.exitPosition.row);
    }
  }

  return Infinity;
}

import { Board } from "../../models/Board";

export function manhattanDistanceHeuristic(board: Board): number {
  if (!board.primaryPiece || !board.exitPosition) {
    return Infinity;
  }

  const primary = board.primaryPiece;

  if (primary.orientation === "horizontal") {
    const rightmost = primary.getTail();
    return Math.abs(rightmost.col - board.exitPosition.col);
  } else {
    const bottommost = primary.getTail();
    return Math.abs(bottommost.row - board.exitPosition.row);
  }
}

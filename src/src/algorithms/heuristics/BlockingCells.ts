import { Board } from '../../models/Board';

export function blockingCellsHeuristic(board: Board): number {
  if (!board.primaryPiece || !board.exitPosition) {
    return Infinity;
  }

  const primary = board.primaryPiece;
  let blockingCells = 0;
  
  if (primary.orientation === 'horizontal') {
    const row = primary.positions[0].row;
    
    const rightmostCol = Math.max(...primary.positions.map(pos => pos.col));
    
    for (let col = rightmostCol + 1; col < board.exitPosition.col; col++) {
      if (board.isOccupied(row, col)) {
        blockingCells++;
      }
    }
  } else {
    const col = primary.positions[0].col;
    const bottomRow = Math.max(...primary.positions.map(pos => pos.row));
    
    for (let row = bottomRow + 1; row < board.exitPosition.row; row++) {
      if (board.isOccupied(row, col)) {
        blockingCells++;
      }
    }
  }
  
  return blockingCells;
}
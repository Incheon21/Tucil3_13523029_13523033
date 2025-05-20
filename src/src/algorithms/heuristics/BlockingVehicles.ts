import { Board } from '../../models/Board';

export function blockingVehiclesHeuristic(board: Board): number {
  if (!board.primaryPiece || !board.exitPosition) {
    return Infinity;
  }

  const primary = board.primaryPiece;
  let blockingVehicles = 0;
  
  if (primary.orientation === 'horizontal') {
    const row = primary.positions[0].row;
    
    const rightmostCol = Math.max(...primary.positions.map(pos => pos.col));
    
    for (let col = rightmostCol + 1; col < board.exitPosition.col; col++) {
      const pieceAtPosition = board.getPieceAt(row, col);
      if (pieceAtPosition && !pieceAtPosition.isPrimary) {
        blockingVehicles++;
        col += pieceAtPosition.size - 1;
      }
    }
  } else {
    const col = primary.positions[0].col;
    const bottomRow = Math.max(...primary.positions.map(pos => pos.row));
    
    for (let row = bottomRow + 1; row < board.exitPosition.row; row++) {
      const pieceAtPosition = board.getPieceAt(row, col);
      if (pieceAtPosition && !pieceAtPosition.isPrimary) {
        blockingVehicles++;
        row += pieceAtPosition.size - 1;
      }
    }
  }
  
  return blockingVehicles;
}
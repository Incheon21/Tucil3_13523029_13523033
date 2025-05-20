import { Board } from '../../models/Board';

export function blockingVehiclesHeuristic(board: Board): number {
  if (!board.primaryPiece || !board.exitPosition || !board.exitTag) {
    return Infinity;
  }

  const primary = board.primaryPiece;
  let blockingVehicles = 0;
  
  if (primary.orientation === 'horizontal') {
    const row = primary.positions[0].row;
    
    if (board.exitTag === 'right') {
      const rightmostCol = Math.max(...primary.positions.map(pos => pos.col));
      
      for (let col = rightmostCol + 1; col < board.exitPosition.col; col++) {
        const pieceAtPosition = board.getPieceAt(row, col);
        if (pieceAtPosition && !pieceAtPosition.isPrimary) {
          blockingVehicles++;
          col += pieceAtPosition.size - 1;
        }
      }
    } else if (board.exitTag === 'left') {
      const leftmostCol = Math.min(...primary.positions.map(pos => pos.col));
      
      for (let col = leftmostCol - 1; col > board.exitPosition.col; col--) {
        const pieceAtPosition = board.getPieceAt(row, col);
        if (pieceAtPosition && !pieceAtPosition.isPrimary) {
          blockingVehicles++;
          col -= pieceAtPosition.size - 1;
        }
      }
    }
  } else if (primary.orientation === 'vertical') {
    const col = primary.positions[0].col;
    
    if (board.exitTag === 'bottom') {
      const bottomRow = Math.max(...primary.positions.map(pos => pos.row));
      
      for (let row = bottomRow + 1; row < board.exitPosition.row; row++) {
        const pieceAtPosition = board.getPieceAt(row, col);
        if (pieceAtPosition && !pieceAtPosition.isPrimary) {
          blockingVehicles++;
          row += pieceAtPosition.size - 1;
        }
      }
    } else if (board.exitTag === 'top') {
      const topRow = Math.min(...primary.positions.map(pos => pos.row));
      
      for (let row = topRow - 1; row > board.exitPosition.row; row--) {
        const pieceAtPosition = board.getPieceAt(row, col);
        if (pieceAtPosition && !pieceAtPosition.isPrimary) {
          blockingVehicles++;
          row -= pieceAtPosition.size - 1;
        }
      }
    }
  }
  
  return blockingVehicles;
}
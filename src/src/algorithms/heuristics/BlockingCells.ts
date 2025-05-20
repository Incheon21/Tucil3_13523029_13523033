import { Board } from '../../models/Board';

export function blockingCellsHeuristic(board: Board): number {
  if (!board.primaryPiece || !board.exitPosition || !board.exitTag) {
    return Infinity;
  }

  const primary = board.primaryPiece;
  let blockingCells = 0;
  
  if (primary.orientation === 'horizontal') {
    const row = primary.positions[0].row;
    
    if (board.exitTag === 'right') {
      const rightmostCol = Math.max(...primary.positions.map(pos => pos.col));
      
      for (let col = rightmostCol + 1; col < board.exitPosition.col; col++) {
        if (board.isOccupied(row, col)) {
          blockingCells++;
        }
      }
    } else if (board.exitTag === 'left') {
      const leftmostCol = Math.min(...primary.positions.map(pos => pos.col));
      
      for (let col = leftmostCol - 1; col > board.exitPosition.col; col--) {
        if (board.isOccupied(row, col)) {
          blockingCells++;
        }
      }
    }
  } else if (primary.orientation === 'vertical') {
    const col = primary.positions[0].col;
    
    if (board.exitTag === 'bottom') {
      const bottomRow = Math.max(...primary.positions.map(pos => pos.row));
      
      for (let row = bottomRow + 1; row < board.exitPosition.row; row++) {
        if (board.isOccupied(row, col)) {
          blockingCells++;
        }
      }
    } else if (board.exitTag === 'top') {
      const topRow = Math.min(...primary.positions.map(pos => pos.row));
      
      for (let row = topRow - 1; row > board.exitPosition.row; row--) {
        if (board.isOccupied(row, col)) {
          blockingCells++;
        }
      }
    }
  }
  
  return blockingCells;
}
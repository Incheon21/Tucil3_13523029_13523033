import React from 'react';
import { Board as BoardModel } from '../models/Board';
import Cell from './Cell';

interface BoardProps {
  board: BoardModel;
  movedPieceId?: string;
}

const Board: React.FC<BoardProps> = ({ board, movedPieceId }) => {
  let effectiveRows = board.rows;
  let effectiveColumns = board.cols;

  if (board.exitPosition) {
    if (board.exitPosition.row === 0) {
      effectiveRows++;
    } else if (board.exitPosition.row >= board.rows) {
      effectiveRows++;
    }

    if (board.exitPosition.col === 0) {
      effectiveColumns++;
    } else if (board.exitPosition.col >= board.cols) {
      effectiveColumns++;
    }
  }

  const grid = Array(effectiveRows).fill(null).map(() => 
    Array(effectiveColumns).fill(null)
  );
  
  let exitRow = -1;
  let exitCol = -1;
  
  if (board.exitPosition) {
    exitRow = board.exitPosition.row;
    exitCol = board.exitPosition.col;

    if (
      exitRow >= 0 && 
      exitRow < effectiveRows && 
      exitCol >= 0 && 
      exitCol < effectiveColumns
    ) {
      grid[exitRow][exitCol] = {
        id: 'K',
        isExit: true,
        isPrimary: false,
        isMoved: false
      };
    }
  }
  
  board.pieces.forEach(piece => {
    piece.positions.forEach(pos => {
      const row = pos.row;
      const col = pos.col;
      
      if (
        row >= 0 &&
        row < effectiveRows &&
        col >= 0 &&
        col < effectiveColumns
      ) {
        grid[row][col] = {
          id: piece.id,
          isPrimary: piece.isPrimary,
          isMoved: piece.id === movedPieceId,
          isExit: false
        };
      }
    });
  });
  
  return (
    <div className="inline-block border-2 border-gray-700 bg-gray-100 my-5 p-4 rounded">
      {grid.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={`flex ${
            (board.exitTag === 'top' || board.exitTag === 'bottom') && 
            rowIndex === exitRow ? 'bg-neutral-600' : ''
          }`}
        >
          {row.map((cell, colIndex) => (
            <Cell 
              key={`${rowIndex}-${colIndex}`} 
              content={cell ? cell.id : ''}
              isPrimary={cell?.isPrimary || false}
              isExit={cell?.isExit || false}
              isMoved={cell?.isMoved || false}
              isExitPath={
                (board.exitTag === 'left' || board.exitTag === 'right') && 
                colIndex === exitCol
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
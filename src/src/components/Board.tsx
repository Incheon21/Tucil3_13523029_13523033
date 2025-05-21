import React from "react";
import { Board as BoardModel } from "../models/Board";
import Cell from "./Cell";

interface BoardProps {
  board: BoardModel;
  movedPieceId?: string;
}

const Board: React.FC<BoardProps> = ({ board, movedPieceId }) => {
  let effectiveRows = board.rows;
  let effectiveColumns = board.cols;

  if (board.exitPosition) {
    if (board.exitTag === "top" || board.exitTag === "bottom") {
      effectiveRows++;
    } else if (board.exitTag === "left" || board.exitTag === "right") {
      effectiveColumns++;
    }
  }

  const grid = Array(effectiveRows)
    .fill(null)
    .map(() => Array(effectiveColumns).fill(null));

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
        id: "K",
        isExit: true,
        isPrimary: false,
        isMoved: false,
      };
    }
  }

  board.pieces.forEach((piece) => {
    piece.positions.forEach((pos) => {
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
          isExit: false,
        };
      }
    });
  });

  const isExitRow = (rowIndex: number): boolean => 
    (board.exitTag === "top" && rowIndex === 0) || 
    (board.exitTag === "bottom" && rowIndex === effectiveRows - 1);

  const isExitCol = (colIndex: number): boolean => 
    (board.exitTag === "left" && colIndex === 0) || 
    (board.exitTag === "right" && colIndex === effectiveColumns - 1);

  const isExitPathCell = (rowIndex: number, colIndex: number): boolean => {
    if (!board.exitPosition) return false;
    
    if (board.exitTag === "top" && colIndex === exitCol && rowIndex === 0) return true;
    if (board.exitTag === "bottom" && colIndex === exitCol && rowIndex === effectiveRows - 1) return true;
    if (board.exitTag === "left" && rowIndex === exitRow && colIndex === 0) return true;
    if (board.exitTag === "right" && rowIndex === exitRow && colIndex === effectiveColumns - 1) return true;
    
    return false;
  };

  return (
    <div className="inline-block border-2 border-gray-700 bg-gray-100 my-5 p-4 rounded">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              content={cell ? cell.id : ""}
              isPrimary={cell?.isPrimary || false}
              isExit={cell?.isExit || false}
              isMoved={cell?.isMoved || false}
              isExitPath={isExitPathCell(rowIndex, colIndex)}
              isExitRow={isExitRow(rowIndex) && !isExitPathCell(rowIndex, colIndex)}
              isExitColumn={isExitCol(colIndex) && !isExitPathCell(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
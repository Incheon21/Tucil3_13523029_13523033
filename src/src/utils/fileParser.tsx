import { Board } from "../models/Board";
import { Piece } from "../models/Piece";
import type { Position, Orientation } from "../models/Piece";

export function parseInputFile(fileContent: string): Board {
  const lines = fileContent.trim().split("\n");

  const [rows, cols] = lines[0].split(" ").map(Number);
  const nonPrimaryPieces = parseInt(lines[1].trim());
  
  const potentialBoardLines = lines.slice(2, 2 + rows + 1);
  
  const hasBottomExitIndicator = potentialBoardLines.length > rows && potentialBoardLines[potentialBoardLines.length - 1].trim() === "K";
  const hasTopExitIndicator = potentialBoardLines[0].trim() === "K";
  
  let boardConfig: string[];
  if (hasTopExitIndicator) {
    boardConfig = potentialBoardLines.slice(1, rows + 1);
  } else if (hasBottomExitIndicator) {
    boardConfig = potentialBoardLines.slice(0, rows);
  } else {
    boardConfig = potentialBoardLines.slice(0, rows);
  }

  const pieces: Piece[] = [];
  let exitPosition: Position | null = null;
  let exitTag: "left" | "right" | "top" | "bottom" | null = null;

  const piecePositions: Map<string, Position[]> = new Map();

  const gameArea: Set<string> = new Set();
  for (let row = 0; row < boardConfig.length; row++) {
    for (let col = 0; col < boardConfig[row].length; col++) {
      const cell = boardConfig[row][col];

      if (cell === "." || (cell !== " " && cell !== "K")) {
        gameArea.add(`${row},${col}`);
      }

      if (cell === "K") {
        console.log("Found exit indicator at: ", row, col);
        exitPosition = { row, col };
      }

      if (cell !== "." && cell !== " " && cell !== "K") {
        console.log("Found piece: ", cell, " at: ", row, col);
        if (!piecePositions.has(cell)) {
          piecePositions.set(cell, []);
        }
        piecePositions.get(cell)!.push({ row, col });
      }
    }
  }

  if (!exitPosition) {
    if (hasTopExitIndicator) {
      for (let col = 0; col < cols; col++) {
        if (gameArea.has(`0,${col}`)) {
          exitPosition = { row: 0, col: col };
          exitTag = "top";
          break;
        }
      }
    } else if (hasBottomExitIndicator) {
      for (let col = 0; col < cols; col++) {
        if (gameArea.has(`${rows-1},${col}`)) {
          exitPosition = { row: rows, col: col };
          exitTag = "bottom";
          break;
        }
      }
    }
  }

  if (exitPosition && !exitTag) {
    const { row, col } = exitPosition;

    const hasGameCellAbove = gameArea.has(`${row - 1},${col}`);
    const hasGameCellBelow = gameArea.has(`${row + 1},${col}`);
    const hasGameCellLeft = gameArea.has(`${row},${col - 1}`);
    const hasGameCellRight = gameArea.has(`${row},${col + 1}`);

    if (!hasGameCellAbove && hasGameCellBelow) {
      exitTag = "top";
    } else if (hasGameCellAbove && !hasGameCellBelow) {
      exitTag = "bottom";
    } else if (!hasGameCellLeft && hasGameCellRight) {
      exitTag = "left";
    } else if (hasGameCellLeft && !hasGameCellRight) {
      exitTag = "right";
    } else if (row === 0) {
      exitTag = "top";
    } else if (row === boardConfig.length - 1) {
      exitTag = "bottom";
    } else if (col === 0) {
      exitTag = "left";
    } else if (col === boardConfig[row].length - 1) {
      exitTag = "right";
    }
  }

  for (const [id, positions] of piecePositions) {
    const orientation: Orientation = positions.every(
      (pos) => pos.row === positions[0].row
    )
      ? "horizontal"
      : "vertical";

    const isPrimary = id === "P";

    pieces.push(new Piece(id, positions, orientation, isPrimary));
  }

  console.log("rows: ", rows);
  console.log("cols: ", cols);
  console.log("exit position: ", exitPosition);
  console.log("exit tag: ", exitTag);

  return new Board(rows, cols, pieces, exitPosition, exitTag, nonPrimaryPieces);
}

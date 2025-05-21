import { Board } from "../models/Board";
import { Piece } from "../models/Piece";
import type { Position, Orientation } from "../models/Piece";


export function parseInputFile(fileContent: string): Board {
  const normalizedContent = fileContent
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "");
  const lines = normalizedContent.trim().split("\n");

  if (lines.length < 3) {
    throw new Error("Invalid file format: Missing required configuration data");
  }

  const dimensionsParts = lines[0].split(" ");
  if (dimensionsParts.length !== 2) {
    throw new Error(
      "Invalid file format: Row and column count must be provided as 'rows cols'"
    );
  }

  const [rows, cols] = dimensionsParts.map(Number);
  if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
    throw new Error(
      "Invalid file format: Row and column dimensions must be positive numbers"
    );
  }

  if (lines[1].trim() === "") {
    throw new Error(
      "Invalid file format: Missing number of non-primary pieces"
    );
  }

  const nonPrimaryPieces = parseInt(lines[1].trim());
  if (isNaN(nonPrimaryPieces) || nonPrimaryPieces < 0) {
    throw new Error(
      "Invalid file format: Number of non-primary pieces must be a non-negative number"
    );
  }

  if (lines.length < 2 + rows) {
    throw new Error(
      `Invalid file format: Expected at least ${rows} rows for the board configuration`
    );
  }

  const potentialBoardLines = lines.slice(2, 2 + rows + 1);

  let kLineCount = 0;
  let hasLeftK = false;
  let hasRightK = false;

  for (const line of potentialBoardLines) {
    const trimmedLine = line.trim();

    if (line.includes("K")) {
      kLineCount++;

      if (trimmedLine.startsWith("K") && trimmedLine.length > 1) {
        hasLeftK = true;
      }

      if (trimmedLine.endsWith("K") && trimmedLine.length > 1) {
        hasRightK = true;
      }
    }
  }

  if (kLineCount > 1) {
    throw new Error("Invalid file format: Multiple exit indicators (K) found");
  }

  for (const line of potentialBoardLines) {
    const trimmedLine = line.trim();

    if (trimmedLine === "K") {
      continue; 
    }

    if (line.includes("K")) {
      const expectedLength = hasLeftK ? cols + 1 : cols;

      const maxAllowedLength = line.endsWith("K")
        ? expectedLength + 1
        : expectedLength;

      if (line.length > maxAllowedLength) {
        throw new Error(
          `Invalid file format: Row with K '${trimmedLine}' exceeds the specified column count`
        );
      } else if (line.length < expectedLength) {
        throw new Error(
          `Invalid file format: Row with K '${trimmedLine}' is shorter than the specified column count`
        );
      }
    } else {
      const expectedColCount = hasLeftK ? cols + 1 : cols;

      if (line.length > expectedColCount) {
        throw new Error(
          `Invalid file format: Row '${trimmedLine}' exceeds the specified column count (${expectedColCount})`
        );
      } else if (line.length < expectedColCount) {
        throw new Error(
          `Invalid file format: Row '${trimmedLine}' is shorter than the specified column count (${expectedColCount})`
        );
      }
    }
  }

  if (hasLeftK) {
    console.log("Board has left-aligned exit (K)");
  } else if (hasRightK) {
    console.log("Board has right-aligned exit (K)");
  }

  if (kLineCount > 1) {
    throw new Error("Invalid file format: Multiple exit indicators (K) found");
  }

  const hasBottomExitIndicator =
    potentialBoardLines.length > rows &&
    potentialBoardLines[potentialBoardLines.length - 1].trim() === "K";
  const hasTopExitIndicator = potentialBoardLines[0].trim() === "K";

  let boardConfig: string[];
  if (hasTopExitIndicator) {
    boardConfig = potentialBoardLines.slice(1, rows + 1);
  } else if (hasBottomExitIndicator) {
    boardConfig = potentialBoardLines.slice(0, rows);
  } else {
    boardConfig = potentialBoardLines.slice(0, rows);
  }

  const expectedLength = cols;
  let isConsistent = true;
  let firstLength = -1;

  for (let i = 0; i < boardConfig.length; i++) {
    const row = boardConfig[i];

    if (row.length < expectedLength) {
      throw new Error(
        `Invalid file format: Row '${row}' is shorter than the specified column count (${cols})`
      );
    }

    if (firstLength === -1) {
      firstLength = row.length;
    } else if (row.length !== firstLength) {
      const hasExitAtEnd = row.endsWith("K");
      const wouldMatchWithoutK = hasExitAtEnd && row.length - 1 === firstLength;

      if (!wouldMatchWithoutK) {
        isConsistent = false;
      }
    }
  }

  if (!isConsistent) {
    console.warn("Warning: Board rows have inconsistent lengths");
  }

  const pieces: Piece[] = [];
  let exitPosition: Position | null = null;
  let exitTag: "left" | "right" | "top" | "bottom" | null = null;

  const piecePositions: Map<string, Position[]> = new Map();
  const pieceIds = new Set<string>();

  const gameArea: Set<string> = new Set();
  let exitCount = 0;
  let primaryCount = 0;

  const validBoardRegex = /^[A-Z.K\s]*$/;
  const validPieceRegex = /^[A-Z]$/;

  for (let row = 0; row < boardConfig.length; row++) {
    const rowContent = boardConfig[row];

    if (!validBoardRegex.test(rowContent)) {
      throw new Error(
        `Invalid file format: Row ${row} contains invalid characters. Only dots (.), uppercase letters (A-Z), K, and spaces are allowed.`
      );
    }

    for (let col = 0; col < rowContent.length; col++) {
      const cell = rowContent[col];

      if (cell === "." || (cell !== " " && cell !== "K")) {
        gameArea.add(`${row},${col}`);
      }

      if (cell === "K") {
        console.log("Found exit indicator at: ", row, col);
        exitPosition = { row, col };
        exitCount++;
      }

      if (cell !== "." && cell !== " " && cell !== "K") {
        if (!validPieceRegex.test(cell)) {
          throw new Error(
            `Invalid file format: Piece identifier '${cell}' at (${row},${col}) is not a valid uppercase letter (A-Z)`
          );
        }

        console.log("Found piece: ", cell, " at: ", row, col);
        if (cell === "P") {
          primaryCount++;
        }

        if (!piecePositions.has(cell)) {
          piecePositions.set(cell, []);
          pieceIds.add(cell);
        }

        if (hasTopExitIndicator) {
          piecePositions.get(cell)!.push({ row: row + 1, col: col });
        } else {
          piecePositions.get(cell)!.push({ row, col });
        }
      }
    }
  }

  if (primaryCount === 0) {
    throw new Error(
      "Invalid file format: No primary piece (P) found on the board"
    );
  }

  for (const [id, positions] of piecePositions) {
    if (!arePositionsConnected(positions) && !(id === " ") && !(id === "\r")) {
      throw new Error(
        `Invalid file format: Multiple disconnected pieces with the same ID '${id}' found`
      );
    }
  }

  if (!exitPosition && !hasTopExitIndicator && !hasBottomExitIndicator) {
    throw new Error("Invalid file format: No exit (K) found on the board");
  }

  if (exitCount > 1) {
    throw new Error(
      "Invalid file format: Multiple exits (K) found on the board"
    );
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
        if (gameArea.has(`${rows - 1},${col}`)) {
          exitPosition = { row: rows, col: col };
          exitTag = "bottom";
          break;
        }
      }
    }
  }

  if (!exitPosition) {
    throw new Error("Invalid file format: Could not determine exit position");
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


  if (exitPosition && exitTag) {
    const { row, col } = exitPosition;
    let isExitValid = false;
    let isExitRowOrColValid = true;

    if (exitTag === "top" || exitTag === "bottom") {
      const columnHasGameCells = Array.from(gameArea).some((pos) => {
        const [posRow, posCol] = pos.split(",").map(Number);
        return posCol === col;
      });
      isExitValid = columnHasGameCells;

      if (!hasTopExitIndicator && !hasBottomExitIndicator) {
        const exitRow = exitTag === "top" ? 0 : rows - 1;
        for (let c = 0; c < boardConfig[exitRow].length; c++) {
          if (c !== col && boardConfig[exitRow][c] !== " ") {
            isExitRowOrColValid = false;
            break;
          }
        }
      }
    } else if (exitTag === "left" || exitTag === "right") {
      const rowHasGameCells = Array.from(gameArea).some((pos) => {
        const [posRow, posCol] = pos.split(",").map(Number);
        return posRow === row;
      });
      isExitValid = rowHasGameCells;

      if (hasLeftK || hasRightK) {
        const exitCol = exitTag === "left" ? 0 : boardConfig[row].length - 1;
        for (let r = 0; r < boardConfig.length; r++) {
          if (boardConfig[r].length <= exitCol) continue;
          if (r !== row && boardConfig[r][exitCol] !== " ") {
            isExitRowOrColValid = false;
            break;
          }
        }
      }
    }

    if (!isExitValid) {
      throw new Error(
        `Invalid file format: Exit (K) at position (${row},${col}) is not properly connected to the game board.`
      );
    }

    if (!isExitRowOrColValid) {
      throw new Error(
        `Invalid file format: Exit (K) at position (${row},${col}) must be in a row/column that only contains K and spaces.`
      );
    }
  }


  console.log("Exit sinini tag: ", exitTag);

  if (!exitTag) {
    throw new Error(
      "Invalid file format: Could not determine exit tag direction"
    );
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

function arePositionsConnected(positions: Position[]): boolean {
  if (positions.length <= 1) return true;

  const graph = new Map<string, Set<string>>();

  for (const pos of positions) {
    const key = `${pos.row},${pos.col}`;
    if (!graph.has(key)) {
      graph.set(key, new Set());
    }
  }

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];

      if (
        (Math.abs(pos1.row - pos2.row) === 1 && pos1.col === pos2.col) ||
        (Math.abs(pos1.col - pos2.col) === 1 && pos1.row === pos2.row)
      ) {
        const key1 = `${pos1.row},${pos1.col}`;
        const key2 = `${pos2.row},${pos2.col}`;
        graph.get(key1)!.add(key2);
        graph.get(key2)!.add(key1);
      }
    }
  }

  const start = `${positions[0].row},${positions[0].col}`;
  const visited = new Set<string>([start]);
  const queue = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const neighbor of graph.get(current)!) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return visited.size === positions.length;
}

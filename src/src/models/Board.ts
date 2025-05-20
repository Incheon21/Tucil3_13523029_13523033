import { Piece } from "./Piece";
import type { Position, Direction } from "./Piece";
import { Move } from "./Move";

export class Board {
  rows: number;
  cols: number;
  pieces: Piece[];
  primaryPiece: Piece | null = null;
  exitPosition: Position | null = null;
  exitTag: "left" | "right" | "top" | "bottom" | null = null;

  constructor(
    rows: number,
    cols: number,
    pieces: Piece[] = [],
    exitPosition: Position | null = null,
    exitTag: "left" | "right" | "top" | "bottom" | null = null
  ) {
    this.rows = rows;
    this.cols = cols;
    this.pieces = pieces;
    this.exitPosition = exitPosition;
    this.exitTag = exitTag;

    // Find the primary piece
    this.primaryPiece = pieces.find((p) => p.isPrimary) || null;
  }

  getPieceAt(row: number, col: number): Piece | null {
    return (
      this.pieces.find((piece) => piece.occupiesPosition(row, col)) || null
    );
  }

  isOccupied(row: number, col: number): boolean {
    return this.getPieceAt(row, col) !== null;
  }

  isWithinBounds(row: number, col: number): boolean {
    if (this.exitTag === "top") {
      return row >= 0 && row <= this.rows && col >= 0 && col < this.cols;
    } else if (this.exitTag === "left") {
      return row >= 0 && row < this.rows && col >= 0 && col <= this.cols;
    } else {
      return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
  }

  canMovePiece(piece: Piece, direction: Direction): boolean {
    if (
      piece.orientation === "horizontal" &&
      (direction === "up" || direction === "down")
    ) {
      return false;
    }
    if (
      piece.orientation === "vertical" &&
      (direction === "left" || direction === "right")
    ) {
      return false;
    }

    // Check if movement is valid
    if (direction === "up") {
      const head = piece.getHead();
      const newRow = head.row - 1;

      // Special case for primary piece at exit
      if (
        piece.isPrimary &&
        this.exitPosition &&
        head.col === this.exitPosition.col &&
        newRow === this.exitPosition.row
      ) {
        return true;
      }

      if (
        !this.isWithinBounds(newRow, head.col) ||
        this.isOccupied(newRow, head.col)
      ) {
        return false;
      }
    } else if (direction === "down") {
      const tail = piece.getTail();
      const newRow = tail.row + 1;

      // Special case for primary piece at exit
      if (
        piece.isPrimary &&
        this.exitPosition &&
        tail.col === this.exitPosition.col &&
        newRow === this.exitPosition.row
      ) {
        return true;
      }

      if (
        !this.isWithinBounds(newRow, tail.col) ||
        this.isOccupied(newRow, tail.col)
      ) {
        return false;
      }
    } else if (direction === "left") {
      const head = piece.getHead();
      const newCol = head.col - 1;

      // Special case for primary piece at exit
      if (
        piece.isPrimary &&
        this.exitPosition &&
        head.row === this.exitPosition.row &&
        newCol === this.exitPosition.col
      ) {
        return true;
      }

      if (
        !this.isWithinBounds(head.row, newCol) ||
        this.isOccupied(head.row, newCol)
      ) {
        return false;
      }
    } else if (direction === "right") {
      console.log("Piece id: ", piece.id);
      const tail = piece.getTail();
      console.log("tail: ", tail);
      const newCol = tail.col + 1;
      console.log("newCol: ", newCol);

      // Special case for primary piece at exit
      if (
        piece.isPrimary &&
        this.exitPosition &&
        tail.row === this.exitPosition.row &&
        newCol === this.exitPosition.col
      ) {
        return true;
      }
      console.log("isOccupied: ", this.isOccupied(tail.row, newCol));
      console.log("isWithinBounds: ", this.isWithinBounds(tail.row, newCol));
      if (
        !this.isWithinBounds(tail.row, newCol) ||
        this.isOccupied(tail.row, newCol)
      ) {
        return false;
      }
    }

    return true;
  }
  movePiece(piece: Piece, direction: Direction): Piece {
    if (!this.canMovePiece(piece, direction)) {
      throw new Error(`Cannot move piece ${piece.id} ${direction}`);
    }

    const newPiece = piece.clone();

    if (direction === "up") {
      newPiece.positions = newPiece.positions.map((pos) => ({
        row: pos.row - 1,
        col: pos.col,
      }));
    } else if (direction === "down") {
      newPiece.positions = newPiece.positions.map((pos) => ({
        row: pos.row + 1,
        col: pos.col,
      }));
    } else if (direction === "left") {
      newPiece.positions = newPiece.positions.map((pos) => ({
        row: pos.row,
        col: pos.col - 1,
      }));
    } else if (direction === "right") {
      newPiece.positions = newPiece.positions.map((pos) => ({
        row: pos.row,
        col: pos.col + 1,
      }));
    }

    return newPiece;
  }

  applyMove(move: Move): Board {
    const newBoard = this.clone();
    const pieceIndex = newBoard.pieces.findIndex((p) => p.id === move.piece.id);

    if (pieceIndex === -1) {
      throw new Error(`Piece ${move.piece.id} not found on board`);
    }

    let newPiece = newBoard.pieces[pieceIndex];

    for (let i = 0; i < move.steps; i++) {
      newPiece = newBoard.movePiece(newPiece, move.direction);
    }

    newBoard.pieces[pieceIndex] = newPiece;

    if (newPiece.isPrimary) {
      newBoard.primaryPiece = newPiece;
    }

    return newBoard;
  }

  getAvailableMoves(): Move[] {
    const moves: Move[] = [];

    for (const piece of this.pieces) {
      const directions: Direction[] =
        piece.orientation === "horizontal" ? ["left", "right"] : ["up", "down"];

      for (const direction of directions) {
        if (this.canMovePiece(piece, direction)) {
          moves.push(new Move(piece, direction));
        }
      }
    }

    return moves;
  }

  canBeSolved(): boolean {
  if (!this.primaryPiece || !this.exitPosition) {
    return false;
  }
  
  // Check if orientation aligns with exit tag
  if (
    (this.exitTag === "left" || this.exitTag === "right") &&
    this.primaryPiece.orientation !== "horizontal"
  ) {
    return false;
  }
  
  if (
    (this.exitTag === "top" || this.exitTag === "bottom") &&
    this.primaryPiece.orientation !== "vertical"
  ) {
    return false;
  }
  
  // Check if row/col aligns with exit position
  if (this.exitTag === "left" || this.exitTag === "right") {
    // For horizontal exits, check if any position in the primary piece is on the same row as exit
    return this.primaryPiece.positions.some(pos => pos.row === this.exitPosition!.row);
  } else {
    // For vertical exits, check if any position in the primary piece is on the same column as exit
    return this.primaryPiece.positions.some(pos => pos.col === this.exitPosition!.col);
  }
}

  isPuzzleSolved(): boolean {
    if (!this.primaryPiece || !this.exitPosition) {
      return false;
    }

    const primaryHead = this.primaryPiece.getHead();
    const primaryTail = this.primaryPiece.getTail();

    if (
      this.exitTag === "right" &&
      this.primaryPiece.orientation === "horizontal"
    ) {
      return (
        primaryTail.col === this.exitPosition.col - 1 &&
        primaryTail.row === this.exitPosition.row
      );
    } else if (
      this.exitTag === "left" &&
      this.primaryPiece.orientation === "horizontal"
    ) {
      return (
        primaryHead.col === this.exitPosition.col + 1 &&
        primaryHead.row === this.exitPosition.row
      );
    } else if (
      this.exitTag === "bottom" &&
      this.primaryPiece.orientation === "vertical"
    ) {
      return (
        primaryTail.row === this.exitPosition.row - 1 &&
        primaryTail.col === this.exitPosition.col
      );
    } else if (
      this.exitTag === "top" &&
      this.primaryPiece.orientation === "vertical"
    ) {
      return (
        primaryHead.row === this.exitPosition.row + 1 &&
        primaryHead.col === this.exitPosition.col
      );
    }
    return false;
  }

  toString(): string {
    // Determine if we need to extend the grid for exit position
    let effectiveRows = this.rows;
    let effectiveColumns = this.cols;

    // Check if exit is outside the normal grid boundaries
    if (this.exitPosition) {
      if (this.exitPosition.row == 0) {
        effectiveRows++;
      } else if (this.exitPosition.row >= this.rows) {
        effectiveRows++;
      }

      if (this.exitPosition.col == 0) {
        effectiveColumns++;
      } else if (this.exitPosition.col >= this.cols) {
        effectiveColumns++;
      }
    }

    // Create grid with proper dimensions
    const grid: string[][] = Array(effectiveRows)
      .fill(null)
      .map(() => Array(effectiveColumns).fill("."));

    // Place exit marker first
    if (this.exitPosition) {
      const exitRow = this.exitPosition.row;
      const exitCol = this.exitPosition.col;

      // Make sure exit position is within our adjusted grid
      if (
        exitRow >= 0 &&
        exitRow < effectiveRows &&
        exitCol >= 0 &&
        exitCol < effectiveColumns
      ) {
        grid[exitRow][exitCol] = "K";
      }
    }

    // Place pieces with appropriate offsets
    for (const piece of this.pieces) {
      for (const pos of piece.positions) {
        const adjustedRow = pos.row;
        const adjustedCol = pos.col;
        if (
          adjustedRow >= 0 &&
          adjustedRow < effectiveRows &&
          adjustedCol >= 0 &&
          adjustedCol < effectiveColumns
        ) {
          grid[adjustedRow][adjustedCol] = piece.id;
        }
      }
    }

    console.log("grid: ", grid);
    // Format grid without missing columns
    const formattedGrid = grid.map((row) => row.join(""));
    return formattedGrid.join("\n");
  }

  clone(): Board {
    return new Board(
      this.rows,
      this.cols,
      this.pieces.map((p) => p.clone()),
      this.exitPosition ? { ...this.exitPosition } : null,
      this.exitTag
    );
  }

  // Method to generate a hash for the current board state (useful for visited states)
  hash(): string {
    return this.toString();
  }
}

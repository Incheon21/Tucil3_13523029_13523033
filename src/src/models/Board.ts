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
  numberOfPieces: number = 0;

  constructor(
    rows: number,
    cols: number,
    pieces: Piece[] = [],
    exitPosition: Position | null = null,
    exitTag: "left" | "right" | "top" | "bottom" | null = null,
    numberOfPieces: number = 0
  ) {
    this.rows = rows;
    this.cols = cols;
    this.pieces = pieces;
    this.exitPosition = exitPosition;
    this.exitTag = exitTag;
    this.primaryPiece = pieces.find((p) => p.isPrimary) || null;
    this.numberOfPieces = numberOfPieces;
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
      return row > 0 && row <= this.rows && col >= 0 && col < this.cols;
    } else if (this.exitTag === "left") {
      return row >= 0 && row < this.rows && col > 0 && col <= this.cols;
    } else {
      return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
  }


  canMovePiece(piece: Piece, direction: Direction, steps: number = 1): boolean {
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

    for (let i = 1; i <= steps; i++) {
      if (direction === "up") {
        const head = piece.getHead();
        const newRow = head.row - i;

        if (
          !this.isWithinBounds(newRow, head.col) ||
          this.isOccupied(newRow, head.col)
        ) {
          return false;
        }
      } else if (direction === "down") {
        const tail = piece.getTail();
        const newRow = tail.row + i;

        if (
          !this.isWithinBounds(newRow, tail.col) ||
          this.isOccupied(newRow, tail.col)
        ) {
          return false;
        }
      } else if (direction === "left") {
        const head = piece.getHead();
        const newCol = head.col - i;

        if (
          !this.isWithinBounds(head.row, newCol) ||
          this.isOccupied(head.row, newCol)
        ) {
          return false;
        }
      } else if (direction === "right") {
        const tail = piece.getTail();
        const newCol = tail.col + i;

        if (
          !this.isWithinBounds(tail.row, newCol) ||
          this.isOccupied(tail.row, newCol)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  movePiece(piece: Piece, direction: Direction, steps: number = 1): Piece {
    if (!this.canMovePiece(piece, direction, steps)) {
      throw new Error(
        `Cannot move piece ${piece.id} ${direction} by ${steps} steps`
      );
    }

    const newPiece = piece.clone();

    if (direction === "up") {
      newPiece.positions = newPiece.positions.map((pos) => ({
        row: pos.row - steps,
        col: pos.col,
      }));
    } else if (direction === "down") {
      newPiece.positions = newPiece.positions.map((pos) => ({
        row: pos.row + steps,
        col: pos.col,
      }));
    } else if (direction === "left") {
      newPiece.positions = newPiece.positions.map((pos) => ({
        row: pos.row,
        col: pos.col - steps,
      }));
    } else if (direction === "right") {
      newPiece.positions = newPiece.positions.map((pos) => ({
        row: pos.row,
        col: pos.col + steps,
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

    const newPiece = newBoard.movePiece(
      newBoard.pieces[pieceIndex],
      move.direction,
      move.steps
    );

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
        let maxSteps = 0;
        let canMove = true;

        while (canMove) {
          maxSteps++;
          canMove = this.canMovePiece(piece, direction, maxSteps);
        }

        maxSteps--;
        for (let steps = 1; steps <= maxSteps; steps++) {
          moves.push(new Move(piece, direction, steps));
        }
      }
    }

    return moves;
  }

  canBeSolved(): boolean {
    if (!this.primaryPiece || !this.exitPosition) {
      return false;
    }
    if (this.numberOfPieces !== this.pieces.length-1) {
      return false;
    }
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

    if (this.exitTag === "left" || this.exitTag === "right") {
      return this.primaryPiece.positions.some(
        (pos) => pos.row === this.exitPosition!.row
      );
    } else {
      return this.primaryPiece.positions.some(
        (pos) => pos.col === this.exitPosition!.col
      );
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
    let effectiveRows = this.rows;
    let effectiveColumns = this.cols;

    if (this.exitPosition) {
      if (this.exitTag === "top" || this.exitTag === "bottom") {
        effectiveRows++;
      } else if (this.exitTag === "left" || this.exitTag === "right") {
        effectiveColumns++;
      }
    }

    const grid: string[][] = Array(effectiveRows)
      .fill(null)
      .map(() => Array(effectiveColumns).fill("."));

    if (this.exitPosition) {
      const exitRow = this.exitPosition.row;
      const exitCol = this.exitPosition.col;

      if (
        exitRow >= 0 &&
        exitRow < effectiveRows &&
        exitCol >= 0 &&
        exitCol < effectiveColumns
      ) {
        grid[exitRow][exitCol] = "K";
      }
    }

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

  hash(): string {
    return this.toString();
  }
}

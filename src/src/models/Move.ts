import { Piece } from './Piece';
import type { Direction } from './Piece';

export class Move {
  piece: Piece;
  direction: Direction;
  steps: number;

  constructor(piece: Piece, direction: Direction, steps: number = 1) {
    this.piece = piece;
    this.direction = direction;
    this.steps = steps;
  }

  toString(): string {
    return `${this.piece.id}-${this.direction}`;
  }
}
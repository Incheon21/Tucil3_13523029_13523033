export interface Position {
  row: number;
  col: number;
}

export type Orientation = 'horizontal' | 'vertical';
export type Direction = 'up' | 'down' | 'left' | 'right';

export class Piece {
  id: string;
  positions: Position[];
  orientation: Orientation;
  isPrimary: boolean;
  size: number;

  constructor(
    id: string, 
    positions: Position[], 
    orientation: Orientation, 
    isPrimary: boolean = false
  ) {
    this.id = id;
    this.positions = positions;
    this.orientation = orientation;
    this.isPrimary = isPrimary;
    this.size = positions.length;
  }

  occupiesPosition(row: number, col: number): boolean {
    return this.positions.some(pos => pos.row === row && pos.col === col);
  }

  getHead(): Position {
    if (this.orientation === 'horizontal') {
      return this.positions.reduce((min, pos) => (pos.col < min.col ? pos : min), this.positions[0]);
    } else {
      return this.positions.reduce((min, pos) => (pos.row < min.row ? pos : min), this.positions[0]);
    }
  }

  getTail(): Position {
    if (this.orientation === 'horizontal') {
      return this.positions.reduce((max, pos) => (pos.col > max.col ? pos : max), this.positions[0]);
    } else {
      return this.positions.reduce((max, pos) => (pos.row > max.row ? pos : max), this.positions[0]);
    }
  }

  clone(): Piece {
    return new Piece(
      this.id,
      this.positions.map(pos => ({ row: pos.row, col: pos.col })),
      this.orientation,
      this.isPrimary
    );
  }
}
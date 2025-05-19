import { Board } from './Board';
import { Move } from './Move';

export class State {
  board: Board;
  moves: Move[] = [];
  parent: State | null = null;
  cost: number = 0;
  heuristicValue: number = 0;
  
  constructor(board: Board, parent: State | null = null, lastMove: Move | null = null) {
    this.board = board;
    this.parent = parent;
    
    if (parent && lastMove) {
      this.moves = [...parent.moves, lastMove];
      this.cost = parent.cost + 1;
    }
  }
  
  get f(): number {
    return this.cost + this.heuristicValue;
  }
  
  getPath(): Move[] {
    return this.moves;
  }
  
  hash(): string {
    return this.board.hash();
  }
}
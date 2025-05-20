import { Board } from '../models/Board';
import { Move } from '../models/Move';
import { State } from '../models/State';
import PriorityQueue from 'ts-priority-queue';

// Uniform Cost Search (UCS) algorithm
export function UCS(initialBoard: Board): { 
  solution: Move[], 
  nodesVisited: number, 
  executionTime: number 
} {
  const startTime = performance.now();
  let nodesVisited = 0;

  const openSet = new PriorityQueue<State>({
    comparator: (a, b) => a.cost - b.cost
  });
  
  const initialState = new State(initialBoard);
  openSet.queue(initialState);
  
  const visitedStates = new Set<string>();
  visitedStates.add(initialState.hash());
  
  while (openSet.length > 0) {
    const current = openSet.dequeue();
    nodesVisited++;
    
    if (current.board.isPuzzleSolved()) {
      const endTime = performance.now();
      return {
        solution: current.getPath(),
        nodesVisited,
        executionTime: endTime - startTime
      };
    }
    
    const availableMoves = current.board.getAvailableMoves();
    console.log("Available moves: ", availableMoves);
    
    for (const move of availableMoves) {
      const newBoard = current.board.applyMove(move);
      const newState = new State(newBoard, current, move);
      
      const hash = newState.hash();
      if (!visitedStates.has(hash)) {
        visitedStates.add(hash);
        openSet.queue(newState);
      }
    }
  }
  
  const endTime = performance.now();
  return {
    solution: [],
    nodesVisited,
    executionTime: endTime - startTime
  };
}
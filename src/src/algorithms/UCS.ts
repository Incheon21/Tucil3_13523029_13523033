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

  // Create priority queue based on cost (g)
  const openSet = new PriorityQueue<State>({
    comparator: (a, b) => a.cost - b.cost
  });
  
  // Initial state
  const initialState = new State(initialBoard);
  openSet.queue(initialState);
  
  // Keep track of visited states
  const visitedStates = new Set<string>();
  visitedStates.add(initialState.hash());
  
  while (openSet.length > 0) {
    const current = openSet.dequeue();
    nodesVisited++;
    
    // Check if puzzle is solved
    if (current.board.isPuzzleSolved()) {
      const endTime = performance.now();
      return {
        solution: current.getPath(),
        nodesVisited,
        executionTime: endTime - startTime
      };
    }
    
    // Get available moves
    const availableMoves = current.board.getAvailableMoves();
    console.log("Available moves: ", availableMoves);
    
    for (const move of availableMoves) {
      // Apply move to get new board state
      const newBoard = current.board.applyMove(move);
      const newState = new State(newBoard, current, move);
      
      // Check if already visited
      const hash = newState.hash();
      if (!visitedStates.has(hash)) {
        visitedStates.add(hash);
        openSet.queue(newState);
      }
    }
  }
  
  // No solution found
  const endTime = performance.now();
  return {
    solution: [],
    nodesVisited,
    executionTime: endTime - startTime
  };
}
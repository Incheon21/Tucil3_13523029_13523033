import { Board } from '../models/Board';
import { Move } from '../models/Move';
import { State } from '../models/State';
import PriorityQueue from 'ts-priority-queue';
import type { HeuristicFunction } from './heuristics/index';

// Greedy Best First Search algorithm
export function GBFS(
  initialBoard: Board, 
  heuristic: HeuristicFunction
): { 
  solution: Move[], 
  nodesVisited: number, 
  executionTime: number 
} {
  const startTime = performance.now();
  let nodesVisited = 0;

  const openSet = new PriorityQueue<State>({
    comparator: (a, b) => a.heuristicValue - b.heuristicValue
  });
  
  const initialState = new State(initialBoard);
  initialState.heuristicValue = heuristic(initialState.board);
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
    
    for (const move of availableMoves) {
      const newBoard = current.board.applyMove(move);
      const newState = new State(newBoard, current, move);
      
      newState.heuristicValue = heuristic(newBoard);
      
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
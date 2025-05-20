import { Board } from '../models/Board';
import { Move } from '../models/Move';
import { State } from '../models/State';
import PriorityQueue from 'ts-priority-queue';
import type { HeuristicFunction } from '../algorithms/heuristics';

// A* Search algorithm
export function AStar(
  initialBoard: Board, 
  heuristic: HeuristicFunction
): { 
  solution: Move[], 
  nodesVisited: number, 
  executionTime: number 
} {
  const startTime = performance.now();
  let nodesVisited = 0;

  if (!initialBoard.canBeSolved()) {
    console.log("This puzzle cannot be solved because the primary piece orientation doesn't align with the exit");
    const endTime = performance.now();
    return {
      solution: [],
      nodesVisited: 0,
      executionTime: endTime - startTime
    };
  }

  const openSet = new PriorityQueue<State>({
    comparator: (a, b) => a.f - b.f
  });
  
  const initialState = new State(initialBoard);
  initialState.heuristicValue = heuristic(initialState.board);
  openSet.queue(initialState);
  
  const visitedStates = new Map<string, number>();
  visitedStates.set(initialState.hash(), initialState.cost);
  
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
      const existingCost = visitedStates.get(hash);
      
      if (existingCost === undefined || newState.cost < existingCost) {
        visitedStates.set(hash, newState.cost);
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
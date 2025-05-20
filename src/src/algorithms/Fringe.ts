import { Board } from '../models/Board';
import { Move } from '../models/Move';
import { State } from '../models/State';
import type { HeuristicFunction } from './heuristics';

export function FringeSearch(
  initialBoard: Board,
  heuristic: HeuristicFunction
): {
  solution: Move[],
  nodesVisited: number,
  executionTime: number
} {
  const startTime = performance.now();
  let nodesVisited = 0;

  const initialState = new State(initialBoard);
  initialState.heuristicValue = heuristic(initialState.board);
  
  let fringe: State[] = [initialState];
  
  const cache = new Map<string, number>();
  cache.set(initialState.hash(), initialState.cost);
  
  let threshold = initialState.f;
  
  let nextThreshold = Infinity;
  
  while (fringe.length > 0) {
    nextThreshold = Infinity;
    
    let i = 0;
    
    while (i < fringe.length) {
      const current = fringe[i];
      nodesVisited++;
      
      if (current.board.isPuzzleSolved()) {
        const endTime = performance.now();
        return {
          solution: current.getPath(),
          nodesVisited,
          executionTime: endTime - startTime
        };
      }
      
      if (current.f > threshold) {
        nextThreshold = Math.min(nextThreshold, current.f);
        i++;
        continue;
      }
      
      fringe.splice(i, 1);
      
      const availableMoves = current.board.getAvailableMoves();
      const successors: State[] = [];
      
      for (const move of availableMoves) {
        const newBoard = current.board.applyMove(move);
        const newState = new State(newBoard, current, move);
        newState.heuristicValue = heuristic(newBoard);
        
        const hash = newState.hash();
        const cachedCost = cache.get(hash);
        
        if (cachedCost === undefined || newState.cost < cachedCost) {
          cache.set(hash, newState.cost);
          successors.push(newState);
        }
      }
      
      successors.sort((a, b) => a.f - b.f);
      
      fringe.splice(i, 0, ...successors);
    }
    
    if (nextThreshold === Infinity) {
      break; 
    }
    
    threshold = nextThreshold;
  }
  
  const endTime = performance.now();
  return {
    solution: [],
    nodesVisited,
    executionTime: endTime - startTime
  };
}
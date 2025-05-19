import { UCS } from './UCS';
import { GBFS } from './GBFS';
import { Board } from '../models/Board';
import { Move } from '../models/Move';
import type { HeuristicFunction } from './heuristics';

export type AlgorithmType = 'UCS' | 'GBFS';

export interface SolverResult {
  solution: Move[];
  nodesVisited: number;
  executionTime: number;
}

export function solveRushHour(
  board: Board,
  algorithm: AlgorithmType,
  heuristic: HeuristicFunction
): SolverResult {
  switch (algorithm) {
    case 'UCS':
      return UCS(board);
    case 'GBFS':
      return GBFS(board, heuristic);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}
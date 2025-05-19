import { Board } from '../../models/Board';
import { blockingCellsHeuristic } from './BlockingCells';

export type HeuristicFunction = (board: Board) => number;
export type HeuristicType = 'BlockingCells';

export const heuristics: Record<HeuristicType, HeuristicFunction> = {
  BlockingCells: blockingCellsHeuristic
};

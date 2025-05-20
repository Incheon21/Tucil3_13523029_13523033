import { Board } from '../../models/Board';
import { blockingCellsHeuristic } from './BlockingCells';
import { blockingVehiclesHeuristic } from './BlockingVehicles';
import { manhattanDistanceHeuristic } from './ManhattanDistance';

export type HeuristicFunction = (board: Board) => number;
export type HeuristicType = 'BlockingCells' | 'BlockingVehicles' | 'ManhattanDistance';

export const heuristics: Record<HeuristicType, HeuristicFunction> = {
  BlockingCells: blockingCellsHeuristic,
  BlockingVehicles: blockingVehiclesHeuristic,
  ManhattanDistance: manhattanDistanceHeuristic,
};

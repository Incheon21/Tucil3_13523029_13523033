import React, { useState } from 'react';
import type { AlgorithmType } from '../algorithms';
import type { HeuristicType } from '../algorithms/heuristics';

interface ControlPanelProps {
  onSolve: (algorithm: AlgorithmType, heuristic: HeuristicType) => void;
  isLoading: boolean;
  hasBoard: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onSolve, isLoading, hasBoard }) => {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('UCS');
  const [heuristic, setHeuristic] = useState<HeuristicType>('BlockingVehicles');
  
  const handleSolve = () => {
    onSolve(algorithm, heuristic);
  };
  
  return (
    <div className="my-5 p-4 bg-gray-100 rounded-md border border-gray-300">
      <div className="mb-3">
        <label htmlFor="algorithm" className="block mb-1 font-bold text-gray-700">
          Algorithm:
        </label>
        <select 
          id="algorithm" 
          value={algorithm} 
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
          disabled={isLoading}
          className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          <option value="UCS">Uniform Cost Search (UCS)</option>
          <option value="GBFS">Greedy Best First Search (GBFS)</option>
          <option value="AStar">A* Search</option>
          <option value="Fringe">Fringe Search</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label htmlFor="heuristic" className="block mb-1 font-bold text-gray-700">
          Heuristic:
        </label>
        <select 
          id="heuristic" 
          value={heuristic} 
          onChange={(e) => setHeuristic(e.target.value as HeuristicType)}
          disabled={isLoading || algorithm === 'UCS'}
          className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          <option value="BlockingVehicles">Blocking Vehicles</option>
          <option value="ManhattanDistance">Manhattan Distance</option>
          <option value="BlockingCells">Blocking Cells</option>
        </select>
      </div>
      
      <button 
        onClick={handleSolve} 
        disabled={isLoading || !hasBoard}
        className="px-4 py-2 text-white font-bold rounded-md bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Solving...' : 'Solve Puzzle'}
      </button>
    </div>
  );
};

export default ControlPanel;
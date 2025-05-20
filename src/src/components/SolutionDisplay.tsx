import React, { useState } from 'react';
import { Board as BoardModel } from '../models/Board';
import { Move } from '../models/Move';
import Board from './Board';

interface SolutionDisplayProps {
  initialBoard: BoardModel;
  solution: Move[];
  nodesVisited: number;
  executionTime: number;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ 
  initialBoard, 
  solution, 
  nodesVisited, 
  executionTime 
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [boardStates] = useState<BoardModel[]>(() => {
    // Generate all board states from the solution
    const states: BoardModel[] = [initialBoard];
    let currentBoard = initialBoard.clone();
    
    solution.forEach(move => {
      currentBoard = currentBoard.applyMove(move);
      states.push(currentBoard.clone());
    });
    
    return states;
  });
  
  const totalSteps = boardStates.length;
  const currentBoard = boardStates[currentStep];
  const currentMove = currentStep > 0 ? solution[currentStep - 1] : null;
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleAutoPlay = () => {
    let step = currentStep;
    const interval = setInterval(() => {
      if (step < totalSteps - 1) {
        step++;
        setCurrentStep(step);
      } else {
        clearInterval(interval);
      }
    }, 500);
  };
  
  return (
    <div className="my-5 p-4 bg-gray-50 rounded-md border border-gray-300">
      <div className="flex justify-between mb-4">
        <div className="px-3 py-2 bg-gray-200 rounded-md">
          <span className="font-bold mr-1">Solution Length:</span>
          <span>{solution.length} moves</span>
        </div>
        <div className="px-3 py-2 bg-gray-200 rounded-md">
          <span className="font-bold mr-1">Nodes Visited:</span>
          <span>{nodesVisited}</span>
        </div>
        <div className="px-3 py-2 bg-gray-200 rounded-md">
          <span className="font-bold mr-1">Execution Time:</span>
          <span>{executionTime.toFixed(2)} ms</span>
        </div>
      </div>
      
      <div className="flex justify-center my-5">
        <Board 
          board={currentBoard} 
          movedPieceId={currentMove?.piece.id}
        />
      </div>
      
      <div className="text-center my-3 font-bold">
        {currentStep > 0 ? (
          <div>
            Move {currentStep}: {currentMove?.piece.id}-{currentMove?.direction}
          </div>
        ) : (
          <div>Initial Board</div>
        )}
      </div>
      
      <div className="flex justify-center items-center gap-3">
        <button 
          onClick={handlePrevStep} 
          disabled={currentStep === 0}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <div className="font-bold">
          {currentStep} / {totalSteps - 1}
        </div>
        <button 
          onClick={handleNextStep} 
          disabled={currentStep === totalSteps - 1}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
        <button 
          onClick={handleAutoPlay} 
          disabled={currentStep === totalSteps - 1}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Auto Play
        </button>
      </div>
    </div>
  );
};

export default SolutionDisplay;
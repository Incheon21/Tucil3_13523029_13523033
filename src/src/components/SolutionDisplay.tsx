import React, { useState } from "react";
import { Board as BoardModel } from "../models/Board";
import { Move } from "../models/Move";
import Board from "./Board";
import { generateSolutionText, downloadSolution } from "../utils/saveSolution";

interface SolutionDisplayProps {
  initialBoard: BoardModel;
  solution: Move[];
  nodesVisited: number;
  executionTime: number;
  originalFilename?: string;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
  initialBoard,
  solution,
  nodesVisited,
  executionTime,
  originalFilename = "",
}) => {
  if (!initialBoard.canBeSolved()) {
    console.log(
      "This puzzle cannot be solved because the primary piece orientation doesn't align with the exit"
    );
    return (
      <div className="my-5 p-4 bg-red-900 rounded-md border border-red-700 text-pink-200">
        <strong>
          This puzzle cannot be solved because the primary piece orientation
          doesn't align with the exit.
        </strong>
      </div>
    );
  }

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [boardStates] = useState<BoardModel[]>(() => {
    const states: BoardModel[] = [initialBoard];
    let currentBoard = initialBoard.clone();

    solution.forEach((move) => {
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

  const handleSaveSolution = () => {
    const solutionText = generateSolutionText(boardStates, solution);
    downloadSolution(solutionText, originalFilename);
  };

  return (
    <div className="my-5 p-4 rounded-md border  text-white">
      <div className="flex justify-between mb-4">
        <div className="px-3 py-2 bg-gray-900 rounded-md border border-pink-700">
          <span className="font-bold mr-1 text-pink-400">Solution Length:</span>
          <span>{solution.length} moves</span>
        </div>
        <div className="px-3 py-2 bg-gray-900 rounded-md border border-pink-700">
          <span className="font-bold mr-1 text-pink-400">Nodes Visited:</span>
          <span>{nodesVisited}</span>
        </div>
        <div className="px-3 py-2 bg-gray-900 rounded-md border border-pink-700">
          <span className="font-bold mr-1 text-pink-400">Execution Time:</span>
          <span>{executionTime.toFixed(2)} ms</span>
        </div>
      </div>

      <div className="flex justify-center my-5">
        <Board board={currentBoard} movedPieceId={currentMove?.piece.id} />
      </div>

      <div className="text-center my-3 font-bold text-pink-400">
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
          className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <div className="font-bold text-pink-300">
          {currentStep} / {totalSteps - 1}
        </div>
        <button
          onClick={handleNextStep}
          disabled={currentStep === totalSteps - 1}
          className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
        <button
          onClick={handleAutoPlay}
          disabled={currentStep === totalSteps - 1}
          className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Auto Play
        </button>
      </div>

      {solution.length > 0 && (
        <div className="flex justify-center mt-5">
          <button
            onClick={handleSaveSolution}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-save"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Solution to File
          </button>
        </div>
      )}
    </div>
  );
};

export default SolutionDisplay;
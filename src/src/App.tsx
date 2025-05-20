import React, { useState } from "react";
import FileInput from "./components/FileInput";
import Board from "./components/Board";
import ControlPanel from "./components/ControlPanel";
import SolutionDisplay from "./components/SolutionDisplay";
import { Board as BoardModel } from "./models/Board";
import { parseInputFile } from "./utils/fileParser";
import { solveRushHour } from "./algorithms";
import type { AlgorithmType, SolverResult } from "./algorithms";
import { heuristics } from "./algorithms/heuristics";
import type { HeuristicType } from "./algorithms/heuristics";

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SolverResult | null>(null);

  const handleFileLoad = (content: string) => {
    try {
      const parsedBoard = parseInputFile(content);
      setBoard(parsedBoard);
      console.log("Parsed board:", parsedBoard);
      console.log("parse strign:");
      console.log(parsedBoard.toString());
      console.log("exit tag: ", parsedBoard.exitTag);
      setError(null);
    } catch (err) {
      setError(
        `Failed to parse file: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  const handleSolve = async (
    algorithm: AlgorithmType,
    heuristic: HeuristicType
  ) => {
    if (!board) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use setTimeout to allow UI to update before starting the calculation
      setTimeout(() => {
        try {
          const heuristicFn = heuristics[heuristic];
          const solverResult = solveRushHour(board, algorithm, heuristicFn);

          if (solverResult.solution.length === 0) {
            setError("No solution found!");
          } else {
            setResult(solverResult);
          }
        } catch (err) {
          setError(
            `Error solving puzzle: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        } finally {
          setIsLoading(false);
        }
      }, 50);
    } catch (err) {
      setError(
        `Error setting up solver: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-5 font-sans flex flex-grow flex-col">
      <div className="text-center mb-8 font-bold text-3xl">
        <h1 className="text-gray-800">Rush Hour Puzzle Solver</h1>
      </div>

      <FileInput onFileLoad={handleFileLoad} />

      {error && (
        <div className="text-red-600 p-2.5 my-2.5 bg-red-100 rounded border border-red-200">
          {error}
        </div>
      )}

      {board && (
        <>
          <div className="flex flex-row justify-between gap-6">
            <div className="flex flex-col w-full items-center">
              <h2 className="flex w-full border-b-2 border-gray-200 mb-6 font-semibold pb-1">Puzzle Configuration</h2>
              <Board board={board} />
            </div>
            <div className="flex flex-col w-full">
              <h2 className="flex w-full border-b-2 border-gray-200 mb-6 font-semibold pb-1">Solver Configuration</h2>
              <ControlPanel
                onSolve={handleSolve}
                isLoading={isLoading}
                hasBoard={!!board}
              />
            </div>
          </div>
        </>
      )}

      {isLoading && (
        <div className="loading">Solving puzzle, please wait...</div>
      )}

      {result && board && (
        <>
          <h2 className="section-title font-semibold">Solution</h2>
          <SolutionDisplay
            initialBoard={board}
            solution={result.solution}
            nodesVisited={result.nodesVisited}
            executionTime={result.executionTime}
          />
        </>
      )}
    </div>
  );
};

export default App;
import React, { useState } from "react";
import FileInput from "./components/FileInput";
import Board from "./components/Board";
import { Board as BoardModel } from "./models/Board";
import { parseInputFile } from "./utils/fileParser";

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardModel | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          </div>
        </>
      )}
    </div>
  );
};

export default App;
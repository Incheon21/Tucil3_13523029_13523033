import React from "react";

interface CellProps {
  content: string;
  isPrimary: boolean;
  isExit: boolean;
  isMoved: boolean;
  isExitPath?: boolean;
  isExitRow?: boolean;
  isExitColumn?: boolean;
}

const Cell: React.FC<CellProps> = ({
  content,
  isPrimary,
  isExit,
  isMoved,
  isExitPath,
  isExitRow,
  isExitColumn,
}) => {
  let cellClasses =
    "w-10 h-10 flex items-center justify-center font-bold text-lg border border-gray-300 box-border";

  if (isExit) {
    cellClasses += " bg-emerald-600 text-white";
  } else if (isPrimary) {
    cellClasses += " bg-red-600 text-white";
  } else if (content !== "" && content !== ".") {
    const pieceColorMap: Record<string, string> = {
      A: "bg-blue-500",
      B: "bg-purple-500",
      C: "bg-orange-500",
      D: "bg-teal-500",
      E: "bg-pink-500",
      F: "bg-indigo-500",
      G: "bg-amber-500",
      H: "bg-cyan-500",
      I: "bg-rose-500",
      J: "bg-lime-500",
      K: "bg-emerald-500",
      L: "bg-sky-500",
      M: "bg-fuchsia-500",
      N: "bg-violet-500",
      O: "bg-yellow-500",
      P: "bg-blue-600",
      Q: "bg-purple-600",
      R: "bg-orange-600",
      S: "bg-teal-600",
      T: "bg-pink-600",
      U: "bg-indigo-600",
      V: "bg-amber-600",
      W: "bg-cyan-600",
      X: "bg-rose-600",
      Y: "bg-lime-600",
      Z: "bg-emerald-600",
    };

    cellClasses += ` ${pieceColorMap[content] || "bg-gray-400"} text-white`;
  }

  if (isMoved) {
    cellClasses += " ring-4 ring-yellow-300 ring-inset";
  }

  if (isExitPath || isExitRow || isExitColumn) {
    if (content !== "" && content !== ".") {
      cellClasses += " ring-2 ring-black ring-inset brightness-100";
    } else {
      cellClasses += " bg-gray-600 text-white";
    }
  }

  return <div className={cellClasses}>{content}</div>;
};

export default Cell;

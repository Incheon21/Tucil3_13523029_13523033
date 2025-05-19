import React from 'react';

interface CellProps {
  content: string;
  isPrimary: boolean;
  isExit: boolean;
  isMoved: boolean;
  isExitPath?: boolean;
}

const Cell: React.FC<CellProps> = ({ content, isPrimary, isExit, isMoved, isExitPath }) => {
  let cellClasses = 'w-10 h-10 flex items-center justify-center font-bold text-lg border border-gray-300 box-border';
  
  if (isExit) {
    cellClasses += ' bg-orange-400 text-black';
  } else if (isPrimary) {
    cellClasses += ' bg-red-400 text-white'; 
  } else if (content !== '.') {
    cellClasses += ' bg-white'; 
  }
  
  if (isMoved) {
    cellClasses += ' bg-yellow-300 text-black'; 
  }
  
  if (isExitPath) {
    cellClasses += ' bg-neutral-600'; 
  }

  return (
    <div className={cellClasses}>
      {content}
    </div>
  );
};

export default Cell;
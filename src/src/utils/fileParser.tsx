import { Board } from '../models/Board';
import { Piece } from '../models/Piece';
import type { Position, Orientation } from '../models/Piece';

export function parseInputFile(fileContent: string): Board {
  const lines = fileContent.trim().split('\n');
  
  const [rows, cols] = lines[0].split(' ').map(Number);
  
  const nonPrimaryPieceCount = parseInt(lines[1], 10);
  
  const boardConfig = lines.slice(2, 2 + rows);
  
  const pieces: Piece[] = [];
  let exitPosition: Position | null = null;
  let exitTag: 'left' | 'right' | 'top' | 'bottom' | null = null;
  
  const piecePositions: Map<string, Position[]> = new Map();
  
  for (let row = 0; row < boardConfig.length; row++) {
    for (let col = 0; col < boardConfig[row].length; col++) {
      const cell = boardConfig[row][col];
      
      if (cell === '.') continue;
      
      if (cell === 'K') {
        exitPosition = { row, col };
        if (row === 0) {
          exitTag = 'top';
        } else if (row == rows) {
          exitTag = 'bottom';
        } else if (col === 0) {
          exitTag = 'left';
        } else if (col == cols) {
          exitTag = 'right';
        }
        continue;
      }
      
      if (!piecePositions.has(cell)) {
        piecePositions.set(cell, []);
      }
      piecePositions.get(cell)!.push({ row, col });
    }
  }
  
  for (const [id, positions] of piecePositions) {
    const orientation: Orientation = 
      positions.every(pos => pos.row === positions[0].row) ? 'horizontal' : 'vertical';
    
    const isPrimary = id === 'P';
    
    pieces.push(new Piece(id, positions, orientation, isPrimary));
  }
  
  console.log("rows: ", rows);
  console.log("cols: ", cols);
  console.log("exit position: ", exitPosition);
  console.log("exit tag: ", exitTag);
  
  return new Board(rows, cols, pieces, exitPosition, exitTag);
}
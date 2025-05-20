import { Board } from '../models/Board';
import { Move } from '../models/Move';

export function generateSolutionText(boardStates: Board[], solution: Move[]): string {
  let output = 'Papan Awal\n';
  output += boardStates[0].toString();
  output += '\n\n';

  for (let i = 1; i < boardStates.length; i++) {
    const board = boardStates[i];
    const move = solution[i - 1];
    
    let direction;
    switch (move.direction) {
      case 'up': direction = 'atas'; break;
      case 'down': direction = 'bawah'; break;
      case 'left': direction = 'kiri'; break;
      case 'right': direction = 'kanan'; break;
      default: direction = move.direction;
    }
    
    output += `Gerakan ${i}: ${move.piece.id}-${direction}\n`;
    output += board.toString();
    output += '\n\n';
  }
  
  return output;
}

export function downloadSolution(text: string, originalFilename: string = ''): void {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  let filename;
  if (originalFilename) {
    const baseFilename = originalFilename.split('/').pop()?.split('\\').pop()?.split('.')[0] || 'puzzle';
    filename = `${baseFilename}_solution.txt`;
  } else {
    filename = `rush-hour-solution-${Date.now()}.txt`;
  }
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
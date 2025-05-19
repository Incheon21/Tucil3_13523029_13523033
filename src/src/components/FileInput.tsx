import React, { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';

interface FileInputProps {
  onFileLoad: (content: string) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileLoad }) => {
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoad(content);
    };
    reader.readAsText(file);
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex flex-col space-y-3 my-6">
      <input 
        type="file" 
        id="puzzle-file" 
        accept=".txt"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      <button 
        onClick={handleButtonClick}
        className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span>Upload Puzzle File</span>
      </button>
      
      {fileName && (
        <div className="text-sm text-gray-600 flex items-center">
          <span>Selected: </span>
          <span className="ml-1 text-blue-800 font-medium">{fileName}</span>
        </div>
      )}
    </div>
  );
};

export default FileInput;
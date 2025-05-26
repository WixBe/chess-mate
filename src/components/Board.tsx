// components/Board.tsx
'use client';

import { useChessGame } from '../hooks/useChessGame';
import { Position } from '../types/chess';
import { Square } from './Square';

export const Board = () => {
  const { gameState, selectedSquare, setSelectedSquare, makeMove } = useChessGame();

  const handleSquareClick = (position: Position) => {
    if (!selectedSquare) {
      setSelectedSquare(position);
    } else {
      makeMove({ from: selectedSquare, to: position });
      setSelectedSquare(null);
    }
  };

  return (
    <div className="grid grid-cols-8 gap-0 w-96 h-96 border-2 border-gray-800">
      {gameState.board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            position={{ row: rowIndex, col: colIndex }}
            piece={piece}
            isSelected={
              selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
            }
            onClick={handleSquareClick}
          />
        ))
      )}
    </div>
  );
};
// src/components/Board.tsx
'use client';

import { useChessGame } from '@/hooks/useChessGame';
import { Square } from './Square';

export const Board = () => {
  const {
    gameState,
    selectedSquare,
    validMoves,
    handleSquareSelect,
    handleMove,
    setSelectedSquare
  } = useChessGame();

  const handleSquareClick = (position: { row: number; col: number }) => {
    if (selectedSquare) {
      handleMove(position);
      setSelectedSquare(null);
    } else {
      handleSquareSelect(position);
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
            isValidMove={validMoves.some(move => 
              move.row === rowIndex && move.col === colIndex
            )}
            onClick={handleSquareClick}
          />
        ))
      )}
    </div>
  );
};
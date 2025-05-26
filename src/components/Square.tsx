// components/Square.tsx
'use client';

import { PieceColor, PieceType } from '@/types/chess';
import { Piece, Position } from '../types/chess';

interface SquareProps {
  position: Position;
  piece: Piece | null;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: (position: Position) => void;
}

export const Square = ({ position, piece, isSelected, isValidMove, onClick }: SquareProps) => {
  const getPieceSymbol = () => {
    if (!piece) return '';
    const symbols = {
      [PieceType.KING]: '♔',
      [PieceType.QUEEN]: '♕',
      [PieceType.ROOK]: '♖',
      [PieceType.BISHOP]: '♗',
      [PieceType.KNIGHT]: '♘',
      [PieceType.PAWN]: '♙',
    };
    return symbols[piece.type];
  };

  const squareColor = (position.row + position.col) % 2 === 0 
    ? 'bg-amber-100' 
    : 'bg-amber-800';

  const highlightColor = isValidMove 
    ? 'bg-green-200/70' 
    : isSelected 
    ? 'bg-blue-200/70' 
    : '';

  // Assign a class based on the piece color
  const colorClass = piece?.color === PieceColor.White ? 'text-gray-900' : 'text-gray-100';

  return (
    <div
      className={`aspect-square flex items-center justify-center text-4xl relative
        ${squareColor} ${highlightColor} transition-colors duration-200`}
      onClick={() => onClick(position)}
    >
      {piece && <span className={colorClass}>{getPieceSymbol()}</span>}
      {isValidMove && (
        <div className="absolute w-1/3 h-1/3 bg-green-500 rounded-full opacity-70" />
      )}
    </div>
  );
};
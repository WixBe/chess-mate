// components/Square.tsx
'use client';

import { PieceColor, PieceType } from '@/types/chess';
import { Piece, Position } from '../types/chess';

interface SquareProps {
  position: Position;
  piece: Piece | null;
  isSelected: boolean;
  onClick: (position: Position) => void;
}

export const Square = ({ position, piece, isSelected, onClick }: SquareProps) => {
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

  const colorClass = piece?.color === PieceColor.White ? 'text-white' : 'text-black';
  const squareColor = (position.row + position.col) % 2 === 0 
    ? 'bg-amber-100' 
    : 'bg-amber-800';

  return (
    <div
      className={`aspect-square flex items-center justify-center text-4xl
        ${squareColor} ${isSelected ? 'ring-4 ring-blue-400' : ''}`}
      onClick={() => onClick(position)}
    >
      {piece && <span className={colorClass}>{getPieceSymbol()}</span>}
    </div>
  );
};
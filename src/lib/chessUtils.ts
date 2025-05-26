// In src/lib/chessUtils.ts
import { Chess } from 'chess.js';
import { PieceColor, type Piece, type PieceType } from '../types/chess';

export function mapChessBoard(chess: Chess): (Piece | null)[][] {
  return chess.board().map(row =>
    row.map(square => {
      if (!square) return null;
      return {
        type: square.type as PieceType,  // Explicit type assertion
        color: square.color === 'w' ? PieceColor.White : PieceColor.Black,
        hasMoved: chess.history().some(move => {
          const fromSquare = move.slice(0, 2);
          return fromSquare === square.square;
        })
      };
    })
  );
}
// app/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
// import { Board } from '@/components/Board';
import { useChessGame } from '@/hooks/useChessGame';
import { PieceColor } from '@/types/chess';

const Board = dynamic(
  () => import('@/components/Board').then(mod => mod.Board),
  { ssr: false }
);

export default function Home() {
  const [gameMode, setGameMode] = useState<'pvp' | 'pvai'>('pvp');
  const {
    gameState,
    selectedSquare,
    validMoves,
    isAIThinking,
    handleSquareSelect,
    handleMove,
    resetGame
  } = useChessGame(gameMode);

  const handleSquareClick = (position: { row: number; col: number }) => {
    if (selectedSquare) {
      handleMove(position);
    } else {
      handleSquareSelect(position);
    }
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center bg-gray-100">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl mb-8 font-bold text-gray-800 text-center">
          Chess Mate
        </h1>
        
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-700">
                Current Turn: {gameState.turn === PieceColor.White ? 'White' : 'Black'}
              </span>
              {isAIThinking && (
                <div className="flex items-center text-gray-500">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  AI Thinking...
                </div>
              )}
            </div>
            
            <div className="space-x-4">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                New Game
              </button>
              <button
                onClick={() => setGameMode(m => m === 'pvp' ? 'pvai' : 'pvp')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                {gameMode === 'pvp' ? 'vs AI' : 'vs Human'}
              </button>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <Board />
          </div>

          {gameState.gameResult !== 'ongoing' && (
            <div className="text-center p-4 bg-gray-800 text-white rounded-lg">
              Game Over: {gameState.gameResult.replace('-', ' ').toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
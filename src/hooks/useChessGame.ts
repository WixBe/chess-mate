// src/hooks/useChessGame.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Chess, Square as ChessJSSquare } from 'chess.js';
import { GameState, PieceColor, Position } from '@/types/chess';
import { GeminiHandler } from '@/lib/gemini';
import { mapChessBoard } from '@/lib/chessUtils';

const chess = new Chess();

export const useChessGame = (gameMode: 'pvp' | 'pvai' = 'pvp') => {
  // State declarations
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Update game state from chess.js
  const updateGameState = useCallback(() => {

    const fen = chess.fen();
    const fenParts = fen.split(' ');
    const epTarget = fenParts[3] !== '-' ? fenParts[3] : null;

    const newState: GameState = {
      board: mapChessBoard(chess),
      turn: chess.turn() === 'w' ? PieceColor.White : PieceColor.Black,
      castlingRights: {
        [PieceColor.White]: {
          kingSide: chess.getCastlingRights(PieceColor.White).k,
          queenSide: chess.getCastlingRights(PieceColor.White).q
        },
        [PieceColor.Black]: {
          kingSide: chess.getCastlingRights(PieceColor.Black).k,
          queenSide: chess.getCastlingRights(PieceColor.Black).q
        }
      },
      enPassantTarget: epTarget
        ? {
          row: 8 - Number(epTarget[1]),
          col: epTarget.charCodeAt(0) - 97
        }
        : null,
      moveHistory: chess.history({ verbose: true }).map(move => move.san),
      gameResult: getGameStatus(chess)
    };

    setGameState(newState);  // Fixed state update
    return newState;
  }, []);

  // Handle AI move
  const handleAIMove = useCallback(async (currentState: GameState) => {
    if (currentState.gameResult !== 'ongoing' || isAIThinking) return;

    setIsAIThinking(true);
    try {
      if (gameMode === 'pvai') {
        const aiMove = await GeminiHandler.getAIMove(chess.fen());
        if (aiMove) {
          chess.move(aiMove);
          updateGameState();
        }
      }
    } catch (error) {
      console.error('AI move error:', error);
    } finally {
      setIsAIThinking(false);
    }
  }, [gameMode, updateGameState]);

  // Handle square selection
  const handleSquareSelect = useCallback((position: Position) => {
    if (gameState.gameResult !== 'ongoing' ||
      (gameMode === 'pvai' && gameState.turn === PieceColor.White)) return;

    const chessSquare = positionToChessSquare(position);
    const moves = chess.moves({ square: chessSquare, verbose: true });

    if (moves.length > 0) {
      setSelectedSquare(position);
      setValidMoves(moves.map(m => ({
        row: 8 - parseInt(m.to[1]),
        col: m.to.charCodeAt(0) - 97
      })));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [gameState, gameMode]);

  // Handle piece move
  const handleMove = useCallback(async (toPosition: Position) => {
    if (!selectedSquare || gameState.gameResult !== 'ongoing') return;

    const fromSquare = positionToChessSquare(selectedSquare);
    const toSquare = positionToChessSquare(toPosition);
    const move = chess.move({ from: fromSquare, to: toSquare, promotion: 'q' });

    if (move) {
      const newState = updateGameState();
      setSelectedSquare(null);
      setValidMoves([]);

      // Trigger AI move if applicable
      if (gameMode === 'pvai' && newState.turn === PieceColor.Black) {
        await handleAIMove(newState);
      }
    }
  }, [selectedSquare, gameState, updateGameState, gameMode, handleAIMove]);

  // Initialize game
  useEffect(() => {
    updateGameState();
  }, [updateGameState]);

  // Game status helpers
  const getGameStatus = (chess: Chess): GameState['gameResult'] => {
    if (chess.isCheckmate()) return chess.turn() === 'w' ? 'black-wins' : 'white-wins';
    if (chess.isDraw()) return 'draw';
    if (chess.isStalemate()) return 'draw';
    if (chess.isThreefoldRepetition()) return 'draw';
    if (chess.isInsufficientMaterial()) return 'draw';
    return 'ongoing';
  };

  // Reset game
  const resetGame = useCallback(() => {
    chess.reset();
    updateGameState();
    setSelectedSquare(null);
    setValidMoves([]);
  }, [updateGameState]);

  // Convert position to chess.js notation
  const positionToChessSquare = (pos: Position): ChessJSSquare => {
    const file = String.fromCharCode(97 + pos.col);
    const rank = 8 - pos.row;
    return `${file}${rank}` as ChessJSSquare;
  };

  return {
    gameState,
    selectedSquare,
    validMoves,
    isAIThinking,
    handleSquareSelect,
    handleMove,
    resetGame
  };
};

// Initial game state
const initialGameState: GameState = {
  board: [],
  turn: PieceColor.White,
  castlingRights: {
    [PieceColor.White]: { kingSide: true, queenSide: true },
    [PieceColor.Black]: { kingSide: true, queenSide: true }
  },
  enPassantTarget: null,
  moveHistory: [],
  gameResult: 'ongoing'
};
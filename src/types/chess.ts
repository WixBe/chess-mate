export enum PieceType {
    PAWN = "p",
    KNIGHT = "n",
    BISHOP = "b",
    ROOK = "r",
    QUEEN = "q",
    KING = "k",
}

export enum PieceColor {
    White = "w",
    Black = "b",
}

export interface Piece {
    type: PieceType;
    color: PieceColor;
    hasMoved: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface GameState {
    board: Board;
    turn: PieceColor;
    castlingRights: {
        [PieceColor.White]: {
            kingSide: boolean;
            queenSide: boolean;
        };
        [PieceColor.Black]: {
            kingSide: boolean;
            queenSide: boolean;
        };
    };
    enPassantTarget: { row: number; col: number } | null;
    moveHistory: string[];
    gameResult: "ongoing" | "white-wins" | "black-wins" | "draw";
} 

// Utility types for board coordinates
export type Position = {
    row: number;
    col: number;
};
export type Move = {
    from: Position;
    to: Position;
};
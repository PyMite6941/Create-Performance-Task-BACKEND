// Programmed by Pymite6941
import { Move, Chess } from 'chess.js';

// Create the chess game instance and return it
export function createGame(): Chess {
    return new Chess();
}

// Checks to make sure move is valid
export function validateMove(move: Move | null, fen: string): boolean {
    if (!move) return false;
    const chess = new Chess(fen);
    return chess.move(move) !== null;
}

// Stores all FEN states in an array
export function getAllStates(fenHistory:string,newState:string) {
    return fenHistory.push(newState);
}

// Gets current position from the FEN array to set up the baord
export function getCurrentState(fenHistory:string) {
    return fenHistory[:-1];
}

// 
export function lobbyGameLogic(Fen:string,new_move:Move) {
    if (!validateMove(new_move,Fen)) {
        return null;
    }
    const NewFen = Fen.push(new_move);

}
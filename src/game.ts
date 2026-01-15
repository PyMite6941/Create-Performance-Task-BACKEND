import { Move, Chess } from 'chess.js';

export function createGame(): Chess {
    return new Chess();
}

export function validateMove(move: Move | null, fen: string): boolean {
    if (!move) return false;
    const chess = new Chess(fen);
    return chess.move(move) !== null;
}

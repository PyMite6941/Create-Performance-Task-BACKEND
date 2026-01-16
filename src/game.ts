import { Move, Chess } from 'chess.js';

export function createGame(): Chess {
    return new Chess();
}

export function saveFen(Fen:string[],new_move:string) {
    return Fen.push(new_move);
}

export function validateMove(move: Move | null, fen: string): boolean {
    if (!move) return false;
    const chess = new Chess(fen);
    return chess.move(move) !== null;
}

import { Move,Chess } from 'chess.js';

function createGame() {
    const chess = new Chess();
    return chess;
}

function validateMove(move:Move|null,fen:string): boolean {
    if (!move) return false;
    const chess = new Chess(fen);
    return Chess.move(move) !== null;
}
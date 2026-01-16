"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = createGame;
exports.validateMove = validateMove;
const chess_js_1 = require("chess.js");
function createGame() {
    return new chess_js_1.Chess();
}
function validateMove(move, fen) {
    if (!move)
        return false;
    const chess = new chess_js_1.Chess(fen);
    return chess.move(move) !== null;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLobbyId = generateLobbyId;
exports.createLobby = createLobby;
exports.getLobby = getLobby;
exports.deleteLobby = deleteLobby;
exports.addPlayerToLobby = addPlayerToLobby;
exports.removePlayerFromLobby = removePlayerFromLobby;
exports.getPlayerInLobby = getPlayerInLobby;
exports.getPlayerByColor = getPlayerByColor;
exports.findLobbyBySocketId = findLobbyBySocketId;
exports.getAllLobbies = getAllLobbies;
const chess_js_1 = require("chess.js");
const lobbies = new Map();
function generateLobbyId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}
function createLobby(socketId, playerName) {
    const lobbyId = generateLobbyId();
    const player = {
        socketId,
        name: playerName,
        color: 'white'
    };
    const lobby = {
        id: lobbyId,
        players: [player],
        game: new chess_js_1.Chess(),
        status: 'waiting'
    };
    lobbies.set(lobbyId, lobby);
    return lobby;
}
function getLobby(lobbyId) {
    return lobbies.get(lobbyId);
}
function deleteLobby(lobbyId) {
    lobbies.delete(lobbyId);
}
function addPlayerToLobby(lobby, socketId, playerName) {
    const player = {
        socketId,
        name: playerName,
        color: 'black'
    };
    lobby.players.push(player);
    lobby.status = 'playing';
    return player;
}
function removePlayerFromLobby(lobby, socketId) {
    lobby.players = lobby.players.filter(p => p.socketId !== socketId);
}
function getPlayerInLobby(lobby, socketId) {
    return lobby.players.find(p => p.socketId === socketId);
}
function getPlayerByColor(lobby, color) {
    return lobby.players.find(p => p.color === color);
}
function findLobbyBySocketId(socketId) {
    for (const [lobbyId, lobby] of lobbies.entries()) {
        if (lobby.players.some(p => p.socketId === socketId)) {
            return { lobbyId, lobby };
        }
    }
    return undefined;
}
function getAllLobbies() {
    return lobbies;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketHandlers = registerSocketHandlers;
const lobbyManager_1 = require("../lobby/lobbyManager");
function registerSocketHandlers(io, socket) {
    console.log(`Client connected: ${socket.id}`);
    socket.on('createLobby', (playerName) => handleCreateLobby(socket, playerName));
    socket.on('joinLobby', (lobbyId, playerName) => handleJoinLobby(io, socket, lobbyId, playerName));
    socket.on('makeMove', (data) => handleMakeMove(io, socket, data));
    socket.on('leaveLobby', (lobbyId) => handleLeaveLobby(io, socket, lobbyId));
    socket.on('disconnect', () => handleDisconnect(io, socket));
}
function handleCreateLobby(socket, playerName) {
    const lobby = (0, lobbyManager_1.createLobby)(socket.id, playerName);
    socket.join(lobby.id);
    socket.emit('lobbyCreated', lobby.id);
    socket.emit('joinedLobby', {
        lobbyId: lobby.id,
        color: 'white',
        fen: lobby.game.fen()
    });
    console.log(`Lobby created: ${lobby.id} by ${playerName}`);
}
function handleJoinLobby(io, socket, lobbyId, playerName) {
    const lobby = (0, lobbyManager_1.getLobby)(lobbyId);
    if (!lobby) {
        socket.emit('error', 'Lobby not found');
        return;
    }
    if (lobby.players.length >= 2) {
        socket.emit('error', 'Lobby is full');
        return;
    }
    (0, lobbyManager_1.addPlayerToLobby)(lobby, socket.id, playerName);
    socket.join(lobbyId);
    socket.emit('joinedLobby', {
        lobbyId,
        color: 'black',
        fen: lobby.game.fen()
    });
    const whitePlayer = (0, lobbyManager_1.getPlayerByColor)(lobby, 'white');
    if (whitePlayer) {
        io.to(whitePlayer.socketId).emit('playerJoined', { color: 'black' });
    }
    io.to(lobbyId).emit('gameStart', {
        fen: lobby.game.fen(),
        yourTurn: false
    });
    io.to(whitePlayer.socketId).emit('gameStart', {
        fen: lobby.game.fen(),
        yourTurn: true
    });
    console.log(`Player ${playerName} joined lobby ${lobbyId}`);
}
function handleMakeMove(io, socket, { lobbyId, from, to, promotion }) {
    const lobby = (0, lobbyManager_1.getLobby)(lobbyId);
    if (!lobby) {
        socket.emit('error', 'Lobby not found');
        return;
    }
    if (lobby.status !== 'playing') {
        socket.emit('error', 'Game not in progress');
        return;
    }
    const player = (0, lobbyManager_1.getPlayerInLobby)(lobby, socket.id);
    if (!player) {
        socket.emit('error', 'You are not in this lobby');
        return;
    }
    const currentTurn = lobby.game.turn() === 'w' ? 'white' : 'black';
    if (player.color !== currentTurn) {
        socket.emit('error', 'Not your turn');
        return;
    }
    try {
        const move = lobby.game.move({ from, to, promotion });
        if (!move) {
            socket.emit('error', 'Invalid move');
            return;
        }
        io.to(lobbyId).emit('moveMade', {
            from,
            to,
            fen: lobby.game.fen(),
            turn: lobby.game.turn()
        });
        if (lobby.game.isGameOver()) {
            lobby.status = 'finished';
            let winner = 'draw';
            let reason = 'draw';
            if (lobby.game.isCheckmate()) {
                winner = currentTurn;
                reason = 'checkmate';
            }
            else if (lobby.game.isStalemate()) {
                reason = 'stalemate';
            }
            else if (lobby.game.isThreefoldRepetition()) {
                reason = 'threefold repetition';
            }
            else if (lobby.game.isInsufficientMaterial()) {
                reason = 'insufficient material';
            }
            io.to(lobbyId).emit('gameOver', { winner, reason });
        }
    }
    catch {
        socket.emit('error', 'Invalid move');
    }
}
function handleLeaveLobby(io, socket, lobbyId) {
    const lobby = (0, lobbyManager_1.getLobby)(lobbyId);
    if (!lobby)
        return;
    (0, lobbyManager_1.removePlayerFromLobby)(lobby, socket.id);
    socket.leave(lobbyId);
    if (lobby.players.length === 0) {
        (0, lobbyManager_1.deleteLobby)(lobbyId);
        console.log(`Lobby ${lobbyId} deleted (empty)`);
    }
    else {
        io.to(lobbyId).emit('playerLeft');
    }
}
function handleDisconnect(io, socket) {
    console.log(`Client disconnected: ${socket.id}`);
    const found = (0, lobbyManager_1.findLobbyBySocketId)(socket.id);
    if (!found)
        return;
    const { lobbyId, lobby } = found;
    (0, lobbyManager_1.removePlayerFromLobby)(lobby, socket.id);
    if (lobby.players.length === 0) {
        (0, lobbyManager_1.deleteLobby)(lobbyId);
        console.log(`Lobby ${lobbyId} deleted (empty)`);
    }
    else {
        io.to(lobbyId).emit('playerLeft');
    }
}

import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../types/lobbyTypes';
import {
    createLobby,
    getLobby,
    deleteLobby,
    addPlayerToLobby,
    removePlayerFromLobby,
    getPlayerInLobby,
    getPlayerByColor,
    findLobbyBySocketId
} from '../lobby/lobbyManager';

type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type GameServer = Server<ClientToServerEvents, ServerToClientEvents>;

export function registerSocketHandlers(io: GameServer, socket: GameSocket): void {
    console.log(`Client connected: ${socket.id}`);

    socket.on('createLobby', () => handleCreateLobby(socket));
    socket.on('joinLobby', (lobbyId) => handleJoinLobby(io, socket, lobbyId));
    socket.on('makeMove', (data) => handleMakeMove(io, socket, data));
    socket.on('leaveLobby', (lobbyId) => handleLeaveLobby(io, socket, lobbyId));
    socket.on('disconnect', () => handleDisconnect(io, socket));
}

function handleCreateLobby(socket: GameSocket): void {
    const lobby = createLobby(socket.id);
    socket.join(lobby.id);

    socket.emit('lobbyCreated', lobby.id);
    socket.emit('joinedLobby', {
        lobbyId: lobby.id,
        color: 'white',
        fen: lobby.game.fen()
    });

    console.log(`Lobby created: ${lobby.id} by ${socket.id}`);
}

function handleJoinLobby(io: GameServer, socket: GameSocket, lobbyId: string): void {
    const lobby = getLobby(lobbyId);

    if (!lobby) {
        socket.emit('error', 'Lobby not found');
        return;
    }

    if (lobby.players.length >= 2) {
        socket.emit('error', 'Lobby is full');
        return;
    }

    addPlayerToLobby(lobby, socket.id);
    socket.join(lobbyId);

    socket.emit('joinedLobby', {
        lobbyId,
        color: 'black',
        fen: lobby.game.fen()
    });

    const whitePlayer = getPlayerByColor(lobby, 'white');
    if (whitePlayer) {
        io.to(whitePlayer.socketId).emit('playerJoined', { color: 'black' });
    }

    io.to(lobbyId).emit('gameStart', {
        fen: lobby.game.fen(),
        yourTurn: false
    });
    io.to(whitePlayer!.socketId).emit('gameStart', {
        fen: lobby.game.fen(),
        yourTurn: true
    });

    console.log(`Player ${socket.id} joined lobby ${lobbyId}`);
}

function handleMakeMove(
    io: GameServer,
    socket: GameSocket,
    { lobbyId, from, to, promotion }: { lobbyId: string; from: string; to: string; promotion?: string }
): void {
    const lobby = getLobby(lobbyId);

    if (!lobby) {
        socket.emit('error', 'Lobby not found');
        return;
    }

    if (lobby.status !== 'playing') {
        socket.emit('error', 'Game not in progress');
        return;
    }

    const player = getPlayerInLobby(lobby, socket.id);
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
            let winner: 'white' | 'black' | 'draw' = 'draw';
            let reason = 'draw';

            if (lobby.game.isCheckmate()) {
                winner = currentTurn;
                reason = 'checkmate';
            } else if (lobby.game.isStalemate()) {
                reason = 'stalemate';
            } else if (lobby.game.isThreefoldRepetition()) {
                reason = 'threefold repetition';
            } else if (lobby.game.isInsufficientMaterial()) {
                reason = 'insufficient material';
            }

            io.to(lobbyId).emit('gameOver', { winner, reason });
        }
    } catch {
        socket.emit('error', 'Invalid move');
    }
}

function handleLeaveLobby(io: GameServer, socket: GameSocket, lobbyId: string): void {
    const lobby = getLobby(lobbyId);
    if (!lobby) return;

    removePlayerFromLobby(lobby, socket.id);
    socket.leave(lobbyId);

    if (lobby.players.length === 0) {
        deleteLobby(lobbyId);
        console.log(`Lobby ${lobbyId} deleted (empty)`);
    } else {
        io.to(lobbyId).emit('playerLeft');
    }
}

function handleDisconnect(io: GameServer, socket: GameSocket): void {
    console.log(`Client disconnected: ${socket.id}`);

    const found = findLobbyBySocketId(socket.id);
    if (!found) return;

    const { lobbyId, lobby } = found;
    removePlayerFromLobby(lobby, socket.id);

    if (lobby.players.length === 0) {
        deleteLobby(lobbyId);
        console.log(`Lobby ${lobbyId} deleted (empty)`);
    } else {
        io.to(lobbyId).emit('playerLeft');
    }
}

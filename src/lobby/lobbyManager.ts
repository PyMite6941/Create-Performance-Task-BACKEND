import { Chess } from 'chess.js';
import { Lobby,Player } from '../types/lobbyTypes';
import { createGame,saveFen,validateMove} from '../game';

const lobbies = new Map<string, Lobby>();

export function generateLobbyId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createLobby(socketId: string): Lobby {
    const lobbyId = generateLobbyId();
    const player: Player = {
        socketId,
        color: 'white'
    };

    const lobby: Lobby = {
        id: lobbyId,
        players: [player],
        game: new Chess(),
        status: 'waiting'
    };

    lobbies.set(lobbyId, lobby);
    return lobby;
}

export function getLobby(lobbyId: string): Lobby | undefined {
    return lobbies.get(lobbyId);
}

export function deleteLobby(lobbyId: string): void {
    lobbies.delete(lobbyId);
}

export function addPlayerToLobby(lobby: Lobby, socketId: string): Player {
    const player: Player = {
        socketId,
        color: 'black'
    };
    lobby.players.push(player);
    lobby.status = 'playing';
    return player;
}

export function removePlayerFromLobby(lobby: Lobby, socketId: string): void {
    lobby.players = lobby.players.filter(p => p.socketId !== socketId);
}

export function getPlayerInLobby(lobby: Lobby, socketId: string): Player | undefined {
    return lobby.players.find(p => p.socketId === socketId);
}

export function getPlayerByColor(lobby: Lobby, color: 'white' | 'black'): Player | undefined {
    return lobby.players.find(p => p.color === color);
}

export function findLobbyBySocketId(socketId: string): { lobbyId: string; lobby: Lobby } | undefined {
    for (const [lobbyId, lobby] of lobbies.entries()) {
        if (lobby.players.some(p => p.socketId === socketId)) {
            return { lobbyId, lobby };
        }
    }
    return undefined;
}

export function getAllLobbies(): Map<string, Lobby> {
    return lobbies;
}

export function lobbyGameLogic(Fen:string[],new_move:string) {
    const NewFen = Fen.push(new_move);

}
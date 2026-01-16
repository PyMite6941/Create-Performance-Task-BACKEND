import { Chess } from 'chess.js';

export interface Player {
    socketId: string;
    name: string;
    color: 'white' | 'black';
}

export interface Lobby {
    id: string;
    players: Player[];
    game: Chess;
    status: 'waiting' | 'playing' | 'finished';
}

export interface ClientToServerEvents {
    createLobby: (playerName: string) => void;
    joinLobby: (lobbyId: string, playerName: string) => void;
    makeMove: (data: { lobbyId: string; from: string; to: string; promotion?: string }) => void;
    leaveLobby: (lobbyId: string) => void;
}

export interface ServerToClientEvents {
    lobbyCreated: (lobbyId: string) => void;
    joinedLobby: (data: { lobbyId: string; color: 'white' | 'black'; fen: string }) => void;
    playerJoined: (data: { color: 'white' | 'black' }) => void;
    gameStart: (data: { fen: string; yourTurn: boolean }) => void;
    moveMade: (data: { from: string; to: string; fen: string; turn: 'w' | 'b' }) => void;
    gameOver: (data: { winner: 'white' | 'black' | 'draw'; reason: string }) => void;
    error: (message: string) => void;
    playerLeft: () => void;
}

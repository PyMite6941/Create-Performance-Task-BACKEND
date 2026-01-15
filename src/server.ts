import cors from 'cors';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './types/lobbyTypes';
import { registerSocketHandlers } from './socket/socketHandlers';
import { getLobby } from './lobby/lobbyManager';

type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket: GameSocket) => {
    registerSocketHandlers(io, socket);
});

app.get('/lobbies/:id', (req: Request<{ id: string }>, res: Response) => {
    const lobby = getLobby(req.params.id);
    if (!lobby) {
        res.status(404).json({ error: 'Lobby not found' });
        return;
    }
    res.json({
        id: lobby.id,
        playerCount: lobby.players.length,
        status: lobby.status,
        fen: lobby.game.fen()
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

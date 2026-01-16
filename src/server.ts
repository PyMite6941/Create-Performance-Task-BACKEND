import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './types/lobbyTypes';
import lobbyRoutes from './routes/lobbyRoutes';
import { registerSocketHandlers } from './socket/socketHandlers';

type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', lobbyRoutes);

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

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

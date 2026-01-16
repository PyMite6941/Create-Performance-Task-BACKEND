import { Router, Request, Response } from 'express';
import { createLobby, getAllLobbies, getLobby } from '../lobby/lobbyManager';

const router = Router();

router.post('/lobbies', (req: Request, res: Response) => {
    const { socketId, playerName } = req.body;
    if (!socketId || !playerName) {
        return res.status(400).json({ error: 'Socket ID and player name are required' });
    }
    const lobby = createLobby(socketId, playerName);
    res.status(201).json(lobby);
});

router.get('/lobbies', (req: Request, res: Response) => {
    res.json(getAllLobbies());
});

router.get('/lobbies/:id', (req: Request<{ id: string }>, res: Response) => {
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

export default router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lobbyManager_1 = require("../lobby/lobbyManager");
const router = (0, express_1.Router)();
router.post('/lobbies', (req, res) => {
    const { socketId, playerName } = req.body;
    if (!socketId || !playerName) {
        return res.status(400).json({ error: 'Socket ID and player name are required' });
    }
    const lobby = (0, lobbyManager_1.createLobby)(socketId, playerName);
    res.status(201).json(lobby);
});
router.get('/lobbies', (req, res) => {
    res.json((0, lobbyManager_1.getAllLobbies)());
});
router.get('/lobbies/:id', (req, res) => {
    const lobby = (0, lobbyManager_1.getLobby)(req.params.id);
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
exports.default = router;

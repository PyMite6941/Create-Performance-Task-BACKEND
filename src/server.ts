import { Chess } from 'chess.js';
import cors from 'cors';
import express, { Request,Response } from 'express';

// initialize the app
const app = express()
app.use(cors());
app.use(express.json());

const games = {}
import { Chess } from 'chess.js';
import express from 'express';

//require the packages to be installed regardless of environment
const express = require("express");
const cors = require("cors");
const { Chess } = require("chess.js");

// initialize the app
const app = express()
app.use(cors());
app.use(express.json());

const games = {}
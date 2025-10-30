// server.js
// Express server for Tic Tac Toe project

const express = require("express");
const path = require("path");
const Game = require("./models/gameModel");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Create a single game instance (for now)
const game = new Game(1);

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API to get game state
app.get("/api/game", (req, res) => {
  res.json(game);
});

// API to make a move
app.post("/api/move", (req, res) => {
  const { index } = req.body;
  game.makeMove(index);
  res.json(game);
});

// API to reset game
app.post("/api/reset", (req, res) => {
  game.reset();
  res.json(game);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

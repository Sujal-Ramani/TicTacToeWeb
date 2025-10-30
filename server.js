// server.js
// Express server for Tic Tac Toe project

const express = require("express");
const path = require("path");
const Game = require("./models/gameModel"); // Make sure this path is correct

const app = express();
const PORT = 8080;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Create a single game instance
const game = new Game(1);

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API: Get current game state
app.get("/api/game", (req, res) => {
  res.json(game);
});

// API: Make a move
app.post("/api/move", (req, res) => {
  const { index } = req.body;
  game.makeMove(index);
  res.json(game);
});

// API: Reset game
app.post("/api/reset", (req, res) => {
  game.reset();
  res.json(game);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

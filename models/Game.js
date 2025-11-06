const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  playerX: { type: String, required: true },
  playerO: { type: String, required: true },
  board: { type: [String], required: true, default: Array(9).fill("") }, // 9 cells
  currentTurn: { type: String, enum: ["X", "O"], default: "X" },
  status: { type: String, enum: ["in_progress", "X_won", "O_won", "draw"], default: "in_progress" },
  winner: { type: String, default: null } // "X" or "O"
}, { timestamps: true });

module.exports = mongoose.model("Game", GameSchema);

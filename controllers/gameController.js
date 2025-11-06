const Game = require("../models/Game");

// Helper: checks board for winner
function checkWinner(board) {
  // Define winning combinations
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6]          // diagonals
  ];
  
  // Check if any line has same symbol
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null; // no winner
}

// Create a new game
exports.createGame = async (req, res, next) => {
  try {
    const { playerO } = req.body;
    const playerX = req.user.username;

    // Validate input: playerO must exist and be different from playerX
    if (!playerO) return res.status(400).json({ message: "playerO is required" });
    if (playerO === playerX) return res.status(400).json({ message: "playerO must be different" });

    // Initialize new game object
    const newGame = await Game.create({
      playerX,
      playerO,
      board: Array(9).fill(""), // empty board
      currentTurn: "X",
      status: "in_progress"
    });

    res.status(201).json(newGame);
  } catch (err) {
    next(err);
  }
};

// Get a single game by ID
exports.getGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id).lean();
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (err) {
    next(err);
  }
};

// List recent games
exports.listGames = async (req, res, next) => {
  try {
    const games = await Game.find().limit(50).lean();
    res.json(games);
  } catch (err) {
    next(err);
  }
};

// Make a move in a game
exports.makeMove = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    if (game.status !== "in_progress") return res.status(400).json({ message: "Game already finished" });

    const { position } = req.body;

    // Validate move position
    if (typeof position !== "number" || position < 0 || position > 8) {
      return res.status(400).json({ message: "position must be integer 0..8" });
    }
    if (game.board[position]) return res.status(400).json({ message: "Cell already occupied" });

    // Determine player symbol
    const username = req.user.username;
    let playerSymbol = null;
    if (username === game.playerX) playerSymbol = "X";
    else if (username === game.playerO) playerSymbol = "O";
    else return res.status(403).json({ message: "You are not a player in this game" });

    // Check turn
    if (game.currentTurn !== playerSymbol) return res.status(400).json({ message: "Not your turn" });

    // Apply move
    game.board[position] = playerSymbol;

    // Check for winner or draw
    const winner = checkWinner(game.board);
    if (winner) {
      game.status = winner === "X" ? "X_won" : "O_won";
      game.winner = winner;
      game.currentTurn = null;
    } else if (game.board.every(cell => cell)) {
      game.status = "draw";
      game.winner = null;
      game.currentTurn = null;
    } else {
      // Switch turn
      game.currentTurn = game.currentTurn === "X" ? "O" : "X";
    }

    await game.save();
    res.json(game);
  } catch (err) {
    next(err);
  }
};

// Delete a game
exports.deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    // Only players can delete
    if (![game.playerX, game.playerO].includes(req.user.username)) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await game.deleteOne();
    res.json({ message: "Game deleted" });
  } catch (err) {
    next(err);
  }
};

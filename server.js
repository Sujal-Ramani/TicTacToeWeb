// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Game schema
const gameSchema = new mongoose.Schema({
    player1: { type: String, required: true },
    player2: { type: String, required: true },
    board: { type: [[String]], default: [["","",""],["","",""],["","",""]] },
    status: { type: String, default: "ongoing" }
});

const Game = mongoose.model('Game', gameSchema);

// Test route
app.get('/', (req, res) => {
    res.json({ message: "API is working" });
});

// GET all games
app.get('/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.json({ games });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch games" });
    }
});

// GET single game by ID
app.get('/games/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ error: "Game not found" });
        res.json(game);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch game" });
    }
});

// POST create a new game
app.post('/games', async (req, res) => {
    const { player1, player2 } = req.body;
    if (!player1 || !player2) return res.status(400).json({ error: "Players are required" });

    try {
        const newGame = new Game({ player1, player2 });
        await newGame.save();
        res.status(201).json({ message: "Game created", game: newGame });
    } catch (err) {
        res.status(500).json({ error: "Failed to create game" });
    }
});

// PUT update a game (e.g., board or status)
app.put('/games/:id', async (req, res) => {
    try {
        const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGame) return res.status(404).json({ error: "Game not found" });
        res.json({ message: "Game updated", game: updatedGame });
    } catch (err) {
        res.status(500).json({ error: "Failed to update game" });
    }
});

// DELETE a game
app.delete('/games/:id', async (req, res) => {
    try {
        const deletedGame = await Game.findByIdAndDelete(req.params.id);
        if (!deletedGame) return res.status(404).json({ error: "Game not found" });
        res.json({ message: "Game deleted", game: deletedGame });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete game" });
    }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

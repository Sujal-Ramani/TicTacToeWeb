// models/gameModel.js

class Game {
  constructor(id) {
    this.id = id;                       // Game ID
    this.board = Array(9).fill("");     // 3x3 board represented as 1D array
    this.currentPlayer = "X";           // X starts first
    this.winner = null;                 // Winner: "X", "O", "Draw" or null
  }

  // Make a move at a specific cell index (0-8)
  makeMove(index) {
    if (!this.board[index] && !this.winner) {  // Only if cell empty and game not over
      this.board[index] = this.currentPlayer;
      
      if (this.checkWinner()) {
        this.winner = this.currentPlayer;      // Current player wins
      } else if (this.board.every(cell => cell)) {
        this.winner = "Draw";                  // Board full → Draw
      } else {
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X"; // Switch turn
      }
    }
  }

  // Check all winning combinations
  checkWinner() {
    const combos = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // columns
      [0,4,8],[2,4,6]          // diagonals
    ];

    return combos.some(([a,b,c]) =>
      this.board[a] &&
      this.board[a] === this.board[b] &&
      this.board[a] === this.board[c]
    );
  }

  // Reset the game to initial state
  reset() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.winner = null;
  }
}

module.exports = Game;

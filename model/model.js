class Game {
  constructor(id) {
    this.id = id;
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.winner = null;
  }

  makeMove(index) {
    if (!this.board[index] && !this.winner) {
      this.board[index] = this.currentPlayer;
      if (this.checkWinner()) {
        this.winner = this.currentPlayer;
      } else if (this.board.every(cell => cell)) {
        this.winner = "Draw";
      } else {
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
      }
    }
  }

  checkWinner() {
    const combos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return combos.some(([a,b,c]) =>
      this.board[a] &&
      this.board[a] === this.board[b] &&
      this.board[a] === this.board[c]
    );
  }

  reset() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.winner = null;
  }
}

module.exports = Game;

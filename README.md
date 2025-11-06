# Tic-Tac-Toe API (Node + Express + MongoDB)

Quick start:
1. Copy `.env.example` to `.env` and set values.
2. npm install
3. npm start
4. Run tests: npm test

This API supports:
- Register / Login (JWT)
- Create Game / Get Game / Make Move / Delete Game
- Unit tests run against an in-memory MongoDB for CI-friendly testing

🚀 Quick Start
1️⃣ Clone the project and install dependencies
npm install

2️⃣ Create .env file

Copy .env.example → .env
Then set your MongoDB URI and PORT (example):

PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/tictactoe
JWT_SECRET=mysecretkey

3️⃣ Start the Server
npm start


Console should show:

Server running on port 8080
Connected to MongoDB

4️⃣ Run Unit Tests
npm test

🌐 API Endpoints
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login user & return JWT
POST	/games	Create a new game
GET	/games	Get list of all games
GET	/games/:id	Get single game
PUT	/games/:id	Update game board or status
DELETE	/games/:id	Remove game

📌 All /games routes require Authorization:

Bearer <your_jwt_token>

🖥️ HTML Client Usage Guide

You can use the included index.html to interact with the API easily.

✅ Check API Status

Click Check API

✅ Create Game

Enter two players → Click Create Game
Response shows game data including a unique _id
→ Copy this Game ID for updates & delete actions

✅ Update Game (Make Move)

You must fill:

Field	Example
Game ID	609a90addc332551ddbF105b
Field	board or status bord/status
completed
JSON Value	Valid 3×3 board array 

Example: Player “a” moves center:

Field: board
Value:
[["","",""],["","a",""],["","",""]]


Update status:

Field: status
Value:"completed"


📌 Make sure JSON uses double quotes ✅

✅ Get All Games

Returns an array of all stored games

✅ Delete Game

Enter Game ID → Delete Game

Response: { "message": "Game deleted" }

solve ruuning Error
- Get-Process node | Stop-Process -Force
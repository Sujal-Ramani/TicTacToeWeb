const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let app;

describe("Game API", () => {
  let mongod;
  let tokenX;
  let tokenO;
  let gameId;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGODB_URI = uri;
    app = require("../app");
    await mongoose.connect(uri);

    // create two users and log them in
    await request(app).post("/api/auth/register").send({ username: "alice", password: "pw1234" });
    await request(app).post("/api/auth/register").send({ username: "bob", password: "pw5678" });

    const resX = await request(app).post("/api/auth/login").send({ username: "alice", password: "pw1234" });
    tokenX = resX.body.token;

    const resO = await request(app).post("/api/auth/login").send({ username: "bob", password: "pw5678" });
    tokenO = resO.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  test("create game, play moves, X wins", async () => {
    // alice creates a game with bob
    const resCreate = await request(app)
      .post("/api/games")
      .set("Authorization", `Bearer ${tokenX}`)
      .send({ playerO: "bob" });

    expect(resCreate.statusCode).toBe(201);
    gameId = resCreate.body._id;

    // sequence of valid moves: X(0), O(3), X(1), O(4), X(2) -> X wins
    const moves = [
      { token: tokenX, pos: 0 },
      { token: tokenO, pos: 3 },
      { token: tokenX, pos: 1 },
      { token: tokenO, pos: 4 },
      { token: tokenX, pos: 2 },
    ];

    for (const m of moves) {
      const res = await request(app)
        .put(`/api/games/${gameId}/move`)
        .set("Authorization", `Bearer ${m.token}`)
        .send({ position: m.pos });
      expect(res.statusCode).toBe(200);
    }

    // final state: X_won
    const final = await request(app)
      .get(`/api/games/${gameId}`)
      .set("Authorization", `Bearer ${tokenX}`);
    expect(final.body.status).toBe("X_won");
    expect(final.body.winner).toBe("X");
  });

  test("invalid moves rejected", async () => {
    // create new game
    const resCreate = await request(app)
      .post("/api/games")
      .set("Authorization", `Bearer ${tokenX}`)
      .send({ playerO: "bob" });
    expect(resCreate.statusCode).toBe(201);
    const id = resCreate.body._id;

    // alice (X) moves at 0
    const r1 = await request(app).put(`/api/games/${id}/move`).set("Authorization", `Bearer ${tokenX}`).send({ position: 0 });
    expect(r1.statusCode).toBe(200);

    // bob tries to move at same cell
    const r2 = await request(app).put(`/api/games/${id}/move`).set("Authorization", `Bearer ${tokenO}`).send({ position: 0 });
    expect(r2.statusCode).toBe(400);
  });
});

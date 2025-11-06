const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let app;

describe("Auth API", () => {
  let mongod;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGODB_URI = uri;
    // require app after setting env
    app = require("../app");
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  test("register -> login flow", async () => {
    const username = "tester";
    const password = "pass1234";

    // register
    const resReg = await request(app)
      .post("/api/auth/register")
      .send({ username, password });

    expect(resReg.statusCode).toBe(201);
    expect(resReg.body.username).toBe(username);

    // login
    const resLogin = await request(app)
      .post("/api/auth/login")
      .send({ username, password });

    expect(resLogin.statusCode).toBe(200);
    expect(resLogin.body.token).toBeDefined();
  });

  test("duplicate username blocked", async () => {
    const username = "dupuser";
    const password = "abcd1234";
    await request(app).post("/api/auth/register").send({ username, password });
    const res = await request(app).post("/api/auth/register").send({ username, password });
    expect(res.statusCode).toBe(409);
  });
});

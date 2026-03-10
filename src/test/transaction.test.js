const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { username: "testuser", email: "testuser@gmail.com" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

describe("Transaction API Tests", () => {

  let transactionId;

  test("POST /api/transactions - Create Transaction", async () => {

    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "expense",
        category: "food",
        amount: 200,
        date: "2026-03-08"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");

    transactionId = res.body.id;

  });

  test("GET /api/transactions - Get All Transactions", async () => {

    const res = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

  });

  test("GET /api/transactions/:id - Get Single Transaction", async () => {

    const res = await request(app)
      .get(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

  test("PATCH /api/transactions/:id - Update Transaction", async () => {

    const res = await request(app)
      .patch(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 300 });

    expect(res.statusCode).toBe(200);

  });

  test("DELETE /api/transactions/:id - Delete Transaction", async () => {

    const res = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

});
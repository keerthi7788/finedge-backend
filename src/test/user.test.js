const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { username: "testuser", email: "testuser@gmail.com" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

describe("User API Tests", () => {

  let userId;

  test("POST /api/users - Create User", async () => {

    const res = await request(app)
      .post("/api/users")
      .send({
        name: "Test User",
        email: "testuser@gmail.com"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");

    userId = res.body.id;

  });

  test("GET /api/users - Fetch Users", async () => {

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

  });

  test("GET /api/users/:id - Fetch Single User", async () => {

    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");

  });

});
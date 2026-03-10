# FinEdge Backend

A RESTful API backend for a personal finance tracking application. It allows users to manage financial transactions, view spending analytics, and authenticate securely using JWT tokens.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Testing](#testing)
- [Architecture Notes](#architecture-notes)

---

## Features

- Create, read, update, and delete financial transactions
- User management (create, list, fetch by ID)
- JWT-based authentication on protected routes
- Transaction summary/analytics (total income, expenses, balance)
- In-memory TTL cache for summary results
- Request rate limiting (100 requests per 15 minutes)
- Request logging middleware
- Centralized error handling

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v22 |
| Framework | Express 5 |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password hashing | `bcrypt` |
| Data storage | JSON flat files (`data/`) |
| Database (auth) | MongoDB via Mongoose (for login/register) |
| Unique IDs | `uuid` v4 |
| Testing | Jest + Supertest |
| Dev server | Nodemon |

---

## Project Structure

```
finedge-backend/
├── src/
│   ├── app.js                  # Express app entry point
│   ├── config/
│   │   └── db.js               # MongoDB connection (used for auth)
│   ├── controllers/
│   │   ├── transactionController.js   # HTTP handlers for transactions
│   │   └── userController.js          # HTTP handlers for users + auth
│   ├── data/
│   │   ├── transactions.json   # JSON flat-file store for transactions
│   │   └── users.json          # JSON flat-file store for users
│   ├── middleware/
│   │   ├── errorHandler.js     # Global error handler
│   │   ├── logger.js           # Request logger (method + URL)
│   │   ├── rateLimiter.js      # IP-based rate limiter
│   │   ├── validateJWT.js      # JWT verification middleware
│   │   └── validator.js        # Request body validators
│   ├── models/
│   │   ├── transactionModel.js # JSON file helpers + Mongoose schema
│   │   └── userModel.js        # Mongoose user schema
│   ├── repositories/
│   │   ├── transactionRepository.js  # Mongoose CRUD for transactions
│   │   └── userRepository.js         # Mongoose CRUD for users
│   ├── routes/
│   │   ├── transactionRoutes.js  # /api/transactions route definitions
│   │   └── userRoutes.js         # /api/users route definitions
│   ├── services/
│   │   ├── cacheService.js       # In-memory TTL cache
│   │   ├── transactionService.js # Transaction business logic
│   │   └── userService.js        # User business logic
│   ├── test/
│   │   ├── health.test.js
│   │   ├── transaction.test.js
│   │   └── user.test.js
│   └── utils/
│       ├── aiHelper.js     # AI advice helper
│       └── analytics.js    # Transaction summary calculator
├── .env
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd finedge-backend

# Install dependencies
npm install
```

### Running the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000` by default.

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your_secret_key_here
MONGO_URI=mongodb://127.0.0.1:27017/finedge
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default: `3000`) |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |
| `MONGO_URI` | MongoDB connection string (used for login/register) |

---

## API Reference

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Returns server status |

**Response:**
```json
{ "status": "OK", "message": "Server running" }
```

---

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users` | None | Create a new user |
| POST | `/api/users/login` | None | Login and receive a JWT token |
| GET | `/api/users` | JWT | Get all users |
| GET | `/api/users/:id` | JWT | Get a single user by ID |
| DELETE | `/api/users/:id` | JWT | Delete a user by ID |

#### POST `/api/users` — Create User

**Request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response `201`:**
```json
{
  "id": "uuid-here",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### POST `/api/users/login` — Login

**Request body:**
```json
{
  "email": "jane@example.com",
  "password": "Password1"
}
```

**Response `200`:**
```json
{
  "message": "Login successful",
  "token": "<jwt-token>"
}
```

---

### Transactions

All transaction routes require a valid JWT token in the `Authorization` header.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/transactions` | JWT | Create a new transaction |
| GET | `/api/transactions` | JWT | Get all transactions |
| GET | `/api/transactions/summary` | JWT | Get income/expense summary |
| GET | `/api/transactions/:id` | JWT | Get a single transaction |
| PATCH | `/api/transactions/:id` | JWT | Update a transaction |
| DELETE | `/api/transactions/:id` | JWT | Delete a transaction |

#### POST `/api/transactions` — Create Transaction

**Request body:**
```json
{
  "type": "expense",
  "category": "food",
  "amount": 500,
  "date": "2026-03-09"
}
```

**Response `201`:**
```json
{
  "id": "uuid-here",
  "userId": null,
  "type": "expense",
  "category": "food",
  "amount": 500,
  "date": "2026-03-09"
}
```

#### GET `/api/transactions/summary`

Returns aggregate totals calculated from stored transactions.

**Response `200`:**
```json
{
  "totalIncome": 1000,
  "totalExpense": 500,
  "balance": 500
}
```

---

## Authentication

Protected routes require the `Authorization` header with a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

Obtain a token by calling `POST /api/users/login`. The token expires in **1 hour**.

If no token or an invalid token is provided, the server responds with:

```json
{ "message": "No token provided" }
// or
{ "message": "Invalid token" }
```

with HTTP status `401`.

---

## Testing

Tests use [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest). They run against the live Express app in-process — no external server needed.

```bash
npm test
```

### Test suites

| File | Coverage |
|---|---|
| `health.test.js` | `GET /health` |
| `user.test.js` | Create user, list users, get user by ID |
| `transaction.test.js` | Create, list, get by ID, update, delete |

### Expected output

```
PASS  src/test/transaction.test.js
  Transaction API Tests
    ✓ POST /api/transactions - Create Transaction
    ✓ GET /api/transactions - Get All Transactions
    ✓ GET /api/transactions/:id - Get Single Transaction
    ✓ PATCH /api/transactions/:id - Update Transaction
    ✓ DELETE /api/transactions/:id - Delete Transaction

PASS  src/test/user.test.js
  User API Tests
    ✓ POST /api/users - Create User
    ✓ GET /api/users - Fetch Users
    ✓ GET /api/users/:id - Fetch Single User

PASS  src/test/health.test.js
  Health API
    ✓ GET /health

Test Suites: 3 passed, 3 total
Tests:       9 passed, 9 total
```

---

## Architecture Notes

### Data storage

Transactions and users are stored in JSON flat files (`src/data/`). This means **no database setup is required** to run or test the core CRUD functionality. Changes persist between server restarts.

The Mongoose models (`transactionModel.js`, `userModel.js`) and repositories (`transactionRepository.js`, `userRepository.js`) exist for MongoDB-backed operations such as the user login/register flow and the transaction summary query. These require `MONGO_URI` to be set and a running MongoDB instance.

### Middleware pipeline

Every incoming request passes through this chain before reaching a route handler:

```
CORS → JSON body parser → Rate Limiter → Logger → [validateJWT?] → Route Handler → Error Handler
```

`validateJWT` is applied only to protected routes (all transaction routes, and GET/DELETE user routes).

### Caching

`GET /api/transactions/summary` results are cached in memory for **60 seconds** per user (keyed by email from the JWT payload). Subsequent requests within that window return the cached result without re-reading the file.

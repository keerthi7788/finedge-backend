require('dotenv').config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const rateLimiter = require('./middleware/rateLimiter');

const PORT = process.env.PORT || 3000;
const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cors());
app.use(express.json());
app.use(rateLimiter(100, 15*60*1000)); // Apply rate limiter to all routes
app.use(logger);
app.use(errorHandler);

app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server running"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

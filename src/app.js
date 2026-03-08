const express = require("express");
const cors = require("cors");

// Database connection
const connectDB = require("./config/db");
connectDB();

// Routes
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// Middleware
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

// Register routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);

// Health check
app.get("/health", (req, res) => {
  console.log("Health route hit");
  res.json({ status: "OK", message: "Server running" });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
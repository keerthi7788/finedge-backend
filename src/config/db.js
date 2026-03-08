// src/config/db.js
const mongoose = require("mongoose");

// Ensure dotenv is loaded
require("dotenv").config();

const uri = process.env.MONGO_URI;

// Safety check
if (!uri) {
  console.error("Error: MONGO_URI is missing in .env");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");

    const db = mongoose.connection.db;
    console.log("Database Name:", db.databaseName);

    const collections = await db.listCollections().toArray();
    console.log("Collections in DB:", collections.map(c => c.name));
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
const { v4: uuidv4 } = require("uuid");
const transactionModel = require("../models/transactionModel");
const cache = require("./cacheService");
const { getSummary } = require("../utils/analytics");
const transactionRepository = require("../repositories/transactionRepository");

// Create a new transaction
const createTransaction = async (data) => {
  const transactions = await transactionModel.getTransactions();

  const newTransaction = {
    id: uuidv4(),
    userId: data.userId,
    type: data.type,
    amount: data.amount,
    category: data.category,
    date: data.date
  };

  transactions.push(newTransaction);
  await transactionModel.saveTransactions(transactions);

  return newTransaction;
};

// Get all transactions
const getTransactions = async () => {
  return await transactionModel.getTransactions();
};

// Get transaction by ID
const getTransactionById = async (id) => {
  const transactions = await transactionModel.getTransactions();
  return transactions.find(t => t.id === id);
};

// Delete transaction by ID
const deleteTransaction = async (id) => {
  let transactions = await transactionModel.getTransactions();
  transactions = transactions.filter(t => t.id !== id);
  await transactionModel.saveTransactions(transactions);

  return { message: "Transaction deleted" };
};

// Get transaction summary for a user (with caching)
const getTransactionSummary = async (userId) => {
  const cacheKey = `summary:${userId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Fetch transactions for the user
  const transactions = await transactionRepository.getTransactionsByUserId(userId);

  // Calculate summary
  const summary = getSummary(transactions);

  cache.set(cacheKey, summary, 60 * 1000); // cache for 1 minute
  return summary;
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
  getTransactionSummary
};
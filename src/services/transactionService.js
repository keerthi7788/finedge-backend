const Transaction = require('../models/transactionModel');
const cache = require('./cacheService');
const { v4: uuidv4 } = require("uuid");
const transactionModel = require("../models/transactionModel");
const { getSummary } = require("../utils/analytics");

const createTransactionUtility = async (data) => {
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

const getTransactions = async () => {
  return await transactionModel.getTransactions();
};

const getTransactionById = async (id) => {
  const transactions = await transactionModel.getTransactions();
  return transactions.find(t => t.id === id);
};

const deleteTransaction = async (id) => {

  let transactions = await transactionModel.getTransactions();

  transactions = transactions.filter(t => t.id !== id);

  await transactionModel.saveTransactions(transactions);

  return { message: "Transaction deleted" };
};

const getTransactionSummary = async (userEmail) => {
    const cacheKey = `summary:${userEmail}`;

    const cached = cache.get(cacheKey);
    if (cached) return cached;           

    const transactions = await Transaction.find({ userEmail });

    const summary = {
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        byCategory: {}
    };

    for (const tx of transactions) {
        if (tx.type === 'income') {
            summary.totalIncome += tx.amount;
        } else {
            summary.totalExpense += tx.amount;
        } 
        summary.byCategory[tx.category] = (summary.byCategory[tx.category] || 0) + tx.amount;
    }
    summary.netBalance = summary.totalIncome - summary.totalExpense;

    cache.set(cacheKey, summary, 60 * 1000);
    return summary;
};

module.exports = { 
    getTransactionSummary,
    createTransactionUtility,
    getTransactions,
    getTransactionById,
    deleteTransaction
};

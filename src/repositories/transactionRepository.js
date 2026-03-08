const Transaction = require("../models/transactionModel");

const createTransaction = async (data) => {
  return await Transaction.create(data);
};

const getAllTransactions = async () => {
  return await Transaction.find();
};

const getTransactionById = async (id) => {
  return await Transaction.findById(id);
};

const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};

const getTransactionsByUserId = async (userId) => {
  return await Transaction.find({ userId });
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
  getTransactionsByUserId
};
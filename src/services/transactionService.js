const transactionRepository = require("../repositories/transactionRepository");
const { getSummary } = require("../utils/analytics");

exports.createTransaction = async (data) => {
  return await transactionRepository.createTransaction(data);
};

exports.getTransactions = async () => {
  return await transactionRepository.getAllTransactions();
};

exports.getTransactionById = async (id) => {
  return await transactionRepository.getTransactionById(id);
};

exports.deleteTransaction = async (id) => {
  await transactionRepository.deleteTransaction(id);
  return { message: "Transaction deleted" };
};

exports.getSummary = async (userId) => {

  const transactions = await transactionRepository.getTransactionsByUserId(userId);

  return getSummary(transactions);
};
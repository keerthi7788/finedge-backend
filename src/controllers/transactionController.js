const {
  getTransactionSummary,
  createTransaction: createTransactionService,
  getTransactions: getTransactionsService,
  getTransactionById: getTransactionByIdService,
  updateTransaction: updateTransactionService,
  deleteTransaction: deleteTransactionService,
} = require('../services/transactionService');

const createTransaction = async (req, res) => {
  const transaction = await createTransactionService(req.body);
  res.status(201).json(transaction);
};

const getTransactions = async (req, res) => {
  const transactions = await getTransactionsService();
  res.json(transactions);
};

const getTransactionById = async (req, res) => {
  const transaction = await getTransactionByIdService(req.params.id);
  if (!transaction) return res.status(404).json({ message: "Transaction not found" });
  res.json(transaction);
};

const updateTransaction = async (req, res) => {
  const updated = await updateTransactionService(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Transaction not found" });
  res.json(updated);
};

const deleteTransaction = async (req, res) => {
  const result = await deleteTransactionService(req.params.id);
  res.json(result);
};

const getSummary = async (req, res) => {
  try {
    const summary = await getTransactionSummary(req.user.email);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
const { getTransactionSummary } = require('../services/transactionService');
const {
createTransactionUtility,
} = require("../services/transactionService");

const createTransaction = async (req, res) => {
  const transaction = await createTransactionUtility(req.body);
  res.json(transaction);
};

const getTransactions = async (req, res) => {
  const transactions = await getTransactions();
  res.json(transactions);
};

const getTransactionById = async (req, res) => {
  const transaction = await getTransactionById(req.params.id);
  res.json(transaction);
};

const deleteTransaction = async (req, res) => {
  const result = await deleteTransaction(req.params.id);
  res.json(result);
};

const getSummary = async (req, res) => {
    try {
        const summary = await getTransactionSummary(req.user.email); // req.user set by validateJWT
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
    deleteTransaction
};

// exports.getSummary = async (req, res) => {
//   const summary = await getSummary(req.params.userId);
//   res.json(summary);
// };
const express = require('express');
const router = express.Router();
const { validateJWT } = require('../middleware/validateJWT');
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getSummary
} = require('../controllers/transactionController');

router.use(validateJWT);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get('/summary', getSummary);
router.get("/:id", getTransactionById);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
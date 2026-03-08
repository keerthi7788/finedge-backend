const express = require('express');
const router = express.Router();
const { validateJWT } = require('../middleware/validateJWT');
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    deleteTransaction,
    getSummary
} = require('../controllers/transactionController');

router.use(validateJWT);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.delete("/:id", deleteTransaction);
router.get('/summary', getSummary);

module.exports = router;
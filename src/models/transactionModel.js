const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be a positive number']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Type is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);

/**
 * const fs = require("fs").promises;
const path = require("path");

const file = path.join(__dirname, "../data/transactions.json");

exports.getTransactions = async () => {
  const data = await fs.readFile(file);
  return JSON.parse(data);
};

exports.saveTransactions = async (transactions) => {
  await fs.writeFile(file, JSON.stringify(transactions, null, 2));
};
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create schema
const TransactionSchema = new Schema({
  stock: { type: Schema.Types.ObjectId, ref: 'Stock' },
  price: Number,
  date: String,
  type: String,
  amount: Number
})

// Create model
const Transaction = mongoose.model('Transaction', TransactionSchema)
 
// Export to use in other files
module.exports = Transaction

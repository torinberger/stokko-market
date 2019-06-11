const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create schema
const StockSchema = new Schema({
  name: String,
  symbol: String,
  description: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
})

// Create model
const Stock = mongoose.model('Stock', StockSchema)

// Export to use in other files
module.exports = Stock

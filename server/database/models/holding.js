const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create schema
const HoldingSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  stock: { type: Schema.Types.ObjectId, ref: 'Stock' },
  amount: Number
})

// Create model
const Holding = mongoose.model('Holding', HoldingSchema)

// Export to use in other files
module.exports = Holding

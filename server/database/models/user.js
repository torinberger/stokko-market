const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create schema
const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 100 }
})

// Create model
const User = mongoose.model('User', UserSchema)

// Export to use in other files
module.exports = User

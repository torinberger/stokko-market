const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create schema
const UserSchema = new Schema({
  username: String,
  password: String,
  balance: Number
})

// Create model
const User = mongoose.model('User', UserSchema)

// Export to use in other files
module.exports = User

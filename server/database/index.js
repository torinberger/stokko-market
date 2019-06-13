
const mongoose = require('mongoose')
const privateUser = require('../private').database

mongoose.Promise = global.Promise

// MLAB Database
mongoose.connect(`mongodb://${privateUser.user}:${privateUser.password}@ds155626.mlab.com:55626/stokko-market`, {
  useNewUrlParser: true
})

// Connect to the Database
mongoose.connection.once('open', function () {
  console.log('Connected to MongoDB')
}).on('error', function (error) {
  console.log('Connection error', error)
})

module.exports = function () {
  return {
    user: require('./controllers/user.js'),
    stock: require('./controllers/stock.js'),
    holding: require('./controllers/holding.js'),
    transaction: require('./controllers/transaction.js')
  }
}

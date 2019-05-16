const Stock = require('../models/stock')

module.exports = function () {
  return {
    async getStocks (callback) {
      Stock.find({}, function (err, data) {
        if (err) {
          callback(err)
          throw err
        } else {
          callback(data)
        }
      })
    },
    async getStock (id, callback) {
      Stock.findById(id, function (err, data) {
        if (err) {
          callback(err)
          throw err
        } else {
          callback(data)
        }
      })
    },
    async addStock (body, callback) {
      new Stock(body).save(function (err, stock) {
        if (err) {
          callback(err)
          throw err
        } else {
          console.log('Added new stock to DB')
          callback(stock)
        }
      })
    },
    async updateStock (id, changes, callback) {
      Stock.updateOne({ _id: id }, changes, function (err) {
        if (err) {
          callback(err)
          throw err
        } else {
          callback()
        }
      })
    }
  }
}

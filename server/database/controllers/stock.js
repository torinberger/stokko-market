const Stock = require('../models/stock')

// Structure
//  class
//    .function(params)
//    .then(callback)
//    .err(callback)

// Methods
//  GET -> getStocks ()
//  GET -> getStockByID (id)
//  GET -> getStock (target)
//  ADD -> addStock (target)
//  PUT -> updateHolding (id, changes)

module.exports = function () {
  return {
    async getStocks () {
      return Stock.find({}).exec()
    },
    async getStockByID (id) {
      return Stock.findByID(id).exec()
    },
    async getStock (target) {
      return Stock.find(target).exec()
    },
    async addStock (target) {
      return new Stock(target).save()
    },
    async updateStock (id, changes) {
      return Stock.updateOne({ _id: id }, changes)
    }
  }
}

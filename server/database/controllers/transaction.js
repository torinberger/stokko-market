const Transaction = require('../models/transaction')

// # Structure
//  class
//    .function(params)
//    .then(callback)
//    .err(callback)

// # Methods
//  GET -> getTransactions ()
//  GET -> getTransactionByID (id)
//  GET -> getTransaction (target)
//  ADD -> addTransaction (target)
//  PUT -> updateTransaction (id, changes)

module.exports = function () {
  return {
    async getTransactions () {
      return Transaction.find({}).exec()
    },
    async getTransactionByID (id) {
      return Transaction.findByID(id).exec()
    },
    async getTransaction (target) {
      return Transaction.find(target).exec()
    },
    async addTransaction (target) {
      return new Transaction(target).save()
    },
    async updateTransaction (id, changes) {
      return Transaction.updateOne({ _id: id }, changes)
    }
  }
}

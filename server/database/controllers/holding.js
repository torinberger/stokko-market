const Holding = require('../models/holding')

// Structure
//  class
//    .function(params)
//    .then(callback)
//    .err(callback)

// Methods
//  GET -> getHoldings ()
//  GET -> getHoldingByID (id)
//  GET -> getHolding (target)
//  ADD -> addHolding (target)
//  PUT -> updateHolding (id, changeCallback)
//    CALLBACK -> changeCallback (holding, save) // within callback, holding is changed in whatever way, then returned with save (holding)

module.exports = function () {
  return {
    async getHoldings () {
      return Holding.find({}).exec()
    },
    async getHoldingByID (id) {
      return Holding.findByID(id).exec()
    },
    async getHolding (target) {
      return Holding.find(target).exec()
    },
    async addHolding (target) {
      return new Holding(target).save()
    },
    async updateHolding (id, changes) {
      return Holding.findByIDAndUpdate(id, changes)
    }
  }
}

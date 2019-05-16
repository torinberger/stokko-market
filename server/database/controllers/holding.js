const Holding = require('../models/holding')

module.exports = function () {
  return {
    async getHoldings (callback) {
      Holding.find({}, function (err, data) {
        if (err) {
          callback(err)
          throw err
        } else {
          callback(data)
        }
      })
    },
    async getHolding (id, callback) {
      Holding.findById(id, function (err, data) {
        if (err) {
          callback(err)
          throw err
        } else {
          callback(data)
        }
      })
    },
    async addHolding (body, callback) {
      new Holding(body).save(function (err, holding) {
        if (err) {
          callback(err)
          throw err
        } else {
          console.log('Added new holding to DB')
          callback(holding)
        }
      })
    },
    async updateHolding (id, changes, callback) {
      Holding.updateOne({ _id: id }, changes, function (err) {
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

const User = require('../models/user')

// # Structure
//  class
//    .function(params)
//    .then(callback)
//    .err(callback)

// # Methods
//  GET -> getUsers ()
//  GET -> getUserByID (id)
//  GET -> getUser (target)
//  ADD -> addUser (target)
//  PUT -> updateHolding (id, changes)

module.exports = function () {
  return {
    async getUsers () {
      return User.find({}).exec()
    },
    async getUserByID (id) {
      return User.findByID(id).exec()
    },
    async getUser (target) {
      return User.find(target).exec()
    },
    async addUser (target) {
      return new User(target).save()
    },
    async updateUser (id, changes) {
      return User.updateOne({ _id: id }, changes)
    }
  }
}

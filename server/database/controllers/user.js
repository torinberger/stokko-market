const User = require('../models/user')

module.exports = function () {
  return {
    async getUsers (callback) {
      User.find({}, function (err, data) {
        if (err) {
          callback(err)
          throw err
        } else {
          callback(data)
        }
      })
    },
    async getUser (id, callback) {
      User.findById(id, function (err, data) {
        if (err) {
          callback(err)
          throw err
        } else {
          callback(data)
        }
      })
    },
    async addUser (body, callback) {
      new User(body).save(function (err, user) {
        if (err) {
          callback(err)
          throw err
        } else {
          console.log('Added new user to DB')
          callback(user)
        }
      })
    },
    async updateUser (id, changes, callback) {
      User.updateOne({ _id: id }, changes, function (err) {
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

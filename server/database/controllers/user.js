const User = require('../models/user')

// Structure
//  class
//    .function(params)
//    .then(callback)
//    .err(callback)

// Methods
//  GET -> getUsers ()
//  GET -> getUserByID (id)
//  GET -> getUser (target)
//  ADD -> addUser (target)
//  PUT -> updateUser (id, changeCallback)
//    CALLBACK -> changeCallback (user, save) // within callback, user is changed in whatever way, then returned with save (user)

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
    async updateUser (id, changeCallback) {
      return new Promise(function (resolve, reject) {
        User.findById(id, function (err, data) {
          if (err) {
            reject(err)
          } else {
            if (data) {
              changeCallback(data, function (newUser) {
                new User(newUser).save(function (err, updatedUser) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(updatedUser)
                  }
                })
              })
            } else {
              reject(new Error('User Not Found'))
            }
          }
        })
      })
    }
  }
}

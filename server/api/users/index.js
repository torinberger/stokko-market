
const Router = require('koa-router')

module.exports = (database) => {
  const users = new Router()

  users.get('/get/user/:id', async (ctx) => { // get user by ID
    let userID = ctx.params.id // get user ID param

    await database
      .user()
      .getUser({ _id: userID }) // get user by ID from db
      .then((user) => {
        ctx.status = 200
        ctx.body = user // return user
      })
      .catch((err) => {
        ctx.body = 500
        ctx.body = err // return error
      })
  })

  users.get('/get/users', async (ctx) => { // get all users
    await database
      .user()
      .getUsers()
      .then((users) => {
        ctx.body = 200
        ctx.body = users // return users
      })
      .catch((err) => {
        ctx.status = 500
        ctx.body = err // return error
      })
  })

  users.get('/get/user/transactions/:userID', async (ctx) => { // get user's transactions
    let userID = ctx.params.userID // get user id from param

    await require('../../database/models/transaction') // get transaction model from db
      .find({ user: userID }) // find all transactions attached to user
      .then((transaction) => {
        ctx.body = 200
        ctx.body = transaction // return transactions
      })
      .catch((err) => {
        ctx.status = 500
        ctx.body = err // return error
      })
  })

  return (users)
}

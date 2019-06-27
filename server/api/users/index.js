
const Router = require('koa-router')

module.exports = (database) => {
  const users = new Router()

  users.get('/get/user/:id', async (ctx) => {
    let userID = ctx.params.id

    await database
      .user()
      .getUser({ _id: userID })
      .then((user) => {
        ctx.status = 200
        ctx.body = user
      })
      .catch((err) => {
        ctx.body = 500
        ctx.body = err
      })
  })

  users.get('/get/users', async (ctx) => {
    await database
      .user()
      .getUsers()
      .then((users) => {
        ctx.body = 200
        ctx.body = users
      })
      .catch((err) => {
        ctx.status = 500
        ctx.body = err
      })
  })

  users.get('/get/user/transactions/:userID', async (ctx) => {
    let userID = ctx.params.userID

    await require('../../database/models/transaction')
      .find({ user: userID })
      .then((transaction) => {
        ctx.body = 200
        ctx.body = transaction
      })
      .catch((err) => {
        ctx.status = 500
        ctx.body = err
      })
  })

  return (users)
}


const Router = require('koa-router')

const Response = require('../../utils/responseStandard')

module.exports = (database) => {
  const users = new Router()

  users.get('/get/user/:id', async (ctx) => {
    let userID = ctx.params.id

    await database
      .user()
      .getUserByID(userID)
      .then((user) => {
        delete user.password
        ctx.body = new Response('success', user)
      })
      .catch((err) => {
        ctx.body = new Response('err', err)
      })

  })

  users.get('/get/users', async (ctx) => {
    await database
      .user()
      .getUsers()
      .then((users) => {
        ctx.body = new Response('success', users)
      })
      .catch((err) => {
        ctx.body = new Response('err', err)
      })
  })

  return (users)
}

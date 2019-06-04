
const Router = require('koa-router')

const database = require('../../database')()

module.exports = () => {
  const users = new Router()

  users.get('/get/user/:id', async (ctx) => {
    let userID = ctx.params.id

    ctx.body = await new Promise(function (resolve, reject) {
      database.user().getUser(userID, function (user) {
        if (user === null) {
          resolve({ type: 'err', msg: 'User not found' })
          return
        }
        console.log(user)
        delete user.password
        resolve(user)
      })
    })
  })

  users.get('/get/users', async (ctx) => {
    ctx.body = await new Promise(function (resolve, reject) {
      database.user().getUsers(function (user) {
        resolve(user)
      })
    })
  })

  return (users)
}


const user = require('../database/controllers/user')()
const Router = require('koa-router')

module.exports = (database) => {
  const auth = new Router()

  auth.post('/login', async (ctx) => {
    const userDetails = ctx.request.body

    ctx.body = await new Promise(function (resolve, reject) {
      user.validateUser(userDetails, (validated) => {
        console.log('Request to validate user:')
        console.log(validated)

        resolve(validated)
      })
    })
  })

  auth.post('/auth/create', async (ctx) => {
    const userDetails = ctx.request.body

    userDetails.balance = 100

    console.log('Request to create user:')
    console.log(userDetails)

    if (!userDetails.username || !userDetails.password) {
      ctx.body = 'Missing Register Details!'
      return
    }

    ctx.body = await new Promise(function (resolve, reject) {
      user.addUser(userDetails, (newUser) => {
        console.log('Added new user:')
        console.log(newUser)
        resolve(newUser)
      })
    })
  })

  return (auth)
}

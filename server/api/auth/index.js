
const user = require('../../database/controllers/user')()
const Router = require('koa-router')
const jwt = require('koa-jwt')

module.exports = (database) => {
  const auth = new Router()

  auth.post('/login', async (ctx) => {
    const userDetails = ctx.request.body

    ctx.body = await new Promise(function (resolve, reject) {
      user.validateUser(userDetails, (validated) => {
        console.log('Request to validate user:')
        console.log(validated)

        if (validated) {
          delete validated.password

          ctx.status = 200
          resolve({
            token: jwt.sign({ user: validated }, require('../private.json').jwt.token),
            message: 'Logged in!'
          })
        } else {
          ctx.status = ctx.status = 401
          resolve({
            message: 'Auth Err!'
          })
        }
      })
    })
  })

  auth.post('/create', async (ctx) => {
    const userDetails = ctx.request.body

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

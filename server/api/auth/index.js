
const user = require('../../database/controllers/user')()
const Router = require('koa-router')
const jwtUtil = require('jsonwebtoken')

module.exports = (database) => {
  const auth = new Router()

  auth.post('/login', async (ctx) => {
    const userDetails = ctx.request.body

    ctx.body = await new Promise(function (resolve, reject) {

      console.log('Request to login user:')
      console.log(userDetails)

      user.validateUser(userDetails, (validated) => {
        console.log('Request to validate user:')
        console.log(validated)

        if (validated) {

          let exportUser = validated
          delete exportUser.password

          console.log(exportUser)

          ctx.status = 200

          console.log(require('../../private.json').jwt.key)
          resolve({
            token: jwtUtil.sign({ username: validated.username, password: validated.password }, require('../../private.json').jwt.key),
            user: exportUser
          })
        } else {
          ctx.status = 401
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

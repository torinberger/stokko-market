
const Router = require('koa-router')
const jwtUtil = require('jsonwebtoken')

module.exports = (database) => {
  const auth = new Router()

  auth.post('/login', async (ctx) => {
    const userDetails = ctx.request.body

    await database
      .user()
      .getUser(userDetails)
      .then((user) => {
        if(user.length === 0) {
          ctx.status = 401
          ctx.body = 'Incorrect Username/Password'
        } else {
          user = user[0]

          ctx.status = 200
          ctx.body = {
            token: jwtUtil.sign({ username: user.username, password: user.password }, require('../../private.json').jwt.key),
            user
          }
        }
      })
      .catch((err) => {
        console.log(err)
        ctx.status = 500
        ctx.body = 'Server Error!'
      })
  })

  auth.get('/validate', async (ctx) => { // if this route can be reached, JWT would have to not have thrown an auth error
    ctx.status = 200
    ctx.body = 'Validated' // therefore this line will only execute if the caller is authenticated
  })

  auth.post('/create', async (ctx) => {
    const userDetails = ctx.request.body

    console.log('Request to create user:')
    console.log(userDetails)

    if (!userDetails.username || !userDetails.password) {
      ctx.body = new Response('err', 'Missing Register Details!')
    } else {
      await database
        .user()
        .addUser(userDetails)
        .then((newUser) => {
          let exportUser = newUser
          delete exportUser.password

          ctx.status = 200
          ctx.body = {
            token: jwtUtil.sign({ username: newUser.username, password: newUser.password }, require('../../private.json').jwt.key),
            user: exportUser
          }
        })
        .catch((err) => {
          console.log(err)
          ctx.status = 500
          ctx.body = 'Server Error!'
        })
    }
  })

  return (auth)
}

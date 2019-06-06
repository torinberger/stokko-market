
const Response = require('../../utils/responseStandard')

const Router = require('koa-router')
const jwtUtil = require('jsonwebtoken')

module.exports = (database) => {
  const auth = new Router()

  auth.post('/login', async (ctx) => {
    const userDetails = ctx.request.body

    console.log(database);

    await database
      .user()
      .getUser(userDetails)
      .then((user) => {
        if(user.length === 0) {
          ctx.body = new Response('err', 'Incorrect Username/Password')
        } else {
          user = user[0]
          
          let exportUser = user
          delete exportUser.password

          ctx.body = new Response('success', {
            token: jwtUtil.sign({ username: user.username, password: user.password }, require('../../private.json').jwt.key),
            user: exportUser
          })
        }
      })
      .catch((err) => {
        ctx.body = new Response('err', err)
      })
  })

  auth.get('/validate', async (ctx) => { // if this route can be reached, JWT would have to not have thrown an auth error
    ctx.body = new Response('success', 'Validated') // therefore this line will only execute if the caller is authenticated
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
          ctx.body = new Response('success', 'Successfully Registered')
        })
        .catch((err) => {
          ctx.body = new Response('err', err)
        })
    }
  })

  return (auth)
}


const Router = require('koa-router')
const jwtUtil = require('jsonwebtoken')

module.exports = (database) => {
  const auth = new Router()

  auth.post('/login', async (ctx) => { // if user tries to login
    const userDetails = ctx.request.body // get post data

    await database
      .user()
      .getUser(userDetails) // get the user from details provided
      .then((user) => {
        if(user.length === 0) { // if user not found
          ctx.status = 401
          ctx.body = 'Incorrect Username/Password'
        } else { // if user found
          user = user[0] // set user

          ctx.status = 200
          ctx.body = { // return user and auth key
            token: jwtUtil.sign({ username: user.username, password: user.password }, require('../../private.json').jwt.key),
            user
          }
        }
      })
      .catch((err) => { // if error finding user
        console.log('Error logging in', err)
        ctx.status = 500
        ctx.body = 'Server Error!'
      })
  })

  auth.get('/validate', async (ctx) => { // if this route can be reached, JWT would have to not have thrown an auth error
    ctx.status = 200
    ctx.body = 'Validated' // therefore this line will only execute if the caller is authenticated
  })

  auth.post('/create', async (ctx) => { // if user tries to register
    const userDetails = ctx.request.body // get user details

    console.log('Request to create user:', userDetails)

    if (!userDetails.username || !userDetails.password) { // if missing crucial register details
      ctx.body = 400
      ctx.body = 'Missing Register Details!' // return missing register details
    } else {
      await database
        .user()
        .addUser(userDetails) // add the user
        .then((newUser) => {
          let exportUser = newUser
          delete exportUser.password // to send user w/out password

          ctx.status = 200
          ctx.body = { // return user and auth token
            token: jwtUtil.sign({ username: newUser.username, password: newUser.password }, require('../../private.json').jwt.key),
            user: exportUser
          }
        })
        .catch((err) => {
          console.log('Error registering', err)
          ctx.status = 500
          ctx.body = 'Server Error!'
        })
    }
  })

  return (auth)
}

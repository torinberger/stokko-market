
const user = require('../database/controllers/user')()

module.exports = (api, database) => {
  api.route({
    method: 'post',
    path: '/auth/validate',
    validate: { type: 'json' },
    handler: async (ctx) => {
      const userDetails = ctx.request.body

      ctx.body = await new Promise(function (resolve, reject) {
        user.validateUser(userDetails, (validated) => {
          console.log(validated)

          if (validated !== null) {
            console.log('Validated!')
            ctx.user = String(validated._id)
          }

          resolve(validated)
        })
      })
    }
  })

  api.get('/auth/validated', async (ctx) => {
    if (ctx.user !== undefined) {
      console.log(ctx.user)
      ctx.body = ctx.user
    } else {
      ctx.body = 'Not Validated!'
    }
  })

  api.route({
    method: 'post',
    path: '/auth/create',
    validate: { type: 'json' },
    handler: async (ctx) => {
      const userDetails = ctx.request.body

      userDetails.balance = 100

      console.log(userDetails)

      if (!userDetails.username || !userDetails.password) {
        ctx.body = 'Missing Register Details!'
        return
      }

      ctx.body = await new Promise(function (resolve, reject) {
        user.addUser(userDetails, (newUser) => {
          console.log(newUser)
          resolve(newUser)
        })
      })
    }
  })
}


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
          resolve(validated)
        })
      })
    }
  })

  api.route({
    method: 'post',
    path: '/auth/create',
    validate: { type: 'json' },
    handler: async (ctx) => {
      const userDetails = ctx.request.body

      ctx.body = await new Promise(function (resolve, reject) {
        user.addUser(userDetails, (newUser) => {
          console.log(newUser)
          resolve(newUser)
        })
      })
    }
  })
}

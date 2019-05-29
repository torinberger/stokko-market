
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa-cors')
const jwt = require('koa-jwt')
const bodyParser = require('koa-bodyparser')

const marketAPI = require('./api/market')
const authAPI = require('./api/auth')
const database = require('./database')

const app = new Koa()
app
  .use(cors())
  .use(bodyParser())

app
  .use(jwt({
    secret: require('./private.json').jwt.key
  }).unless({
    path: [
      /^\/api\/auth\/*/
      // /^\/api\/market\/
    ]
  }))

const server = new Router()
const api = new Router({
  prefix: '/api'
})

// market routes
const market = marketAPI(database)
api.use('/market', market.routes())

// auth routes
const auth = authAPI(database)
api.use('/auth', auth.routes())

// link api routes
server.use(api.routes(), api.allowedMethods())

app.use(server.routes())
app.listen(3000)

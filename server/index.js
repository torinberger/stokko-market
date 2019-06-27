
// import all frameworks
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa-cors')
const jwt = require('koa-jwt')
const bodyParser = require('koa-bodyparser')

// import all local frameworks
const marketAPI = require('./api/market')
const authAPI = require('./api/auth')
const userAPI = require('./api/users')
const database = require('./database')()

// define koa app
const app = new Koa()
app
  .use(cors())
  .use(bodyParser())

app // init JWT auth token manager
  .use(jwt({
    secret: require('./private.json').jwt.key
  }).unless({
    path: [ // provide excluded paths
      /^\/api\/auth\/*/,
      /^\/api\/market\/get\/*/,
      /^\/api\/users\/get\/*/
    ]
  }))

const server = new Router() // set up router
const api = new Router({ // set up api router
  prefix: '/api'
})

// market routes
const market = marketAPI(database)
api.use('/market', market.routes())

// auth routes
const auth = authAPI(database)
api.use('/auth', auth.routes())

// user routes
const users = userAPI(database)
api.use('/users', users.routes())

// link api routes
server.use(api.routes(), api.allowedMethods())

// link server router to server
app.use(server.routes())
app.listen(3000) // start listening

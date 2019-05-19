
const Koa = require('koa')
const router = require('koa-joi-router')
const cors = require('koa-cors')

const marketAPI = require('./api/market')
const authAPI = require('./api/auth')
const database = require('./database')
const api = router()

api.prefix('/api')
marketAPI(api, database)
authAPI(api, database)

const app = new Koa()
app.use(cors())
app.use(api.middleware())
app.listen(3000)

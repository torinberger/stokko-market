
const Koa = require('koa')
const router = require('koa-joi-router')
const cors = require('koa-cors')

const marketAPI = require('./market')
const database = require('./database')
const api = router()

api.prefix('/api')
marketAPI(api, database)

const app = new Koa()
app.use(cors())
app.use(api.middleware())
app.listen(3000)

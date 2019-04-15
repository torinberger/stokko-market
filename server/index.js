
const Koa = require('koa')
const router = require('koa-joi-router')
const marketAPI = require('./market')
const api = router()

api.prefix('/api')
marketAPI(api)

const app = new Koa()
app.use(api.middleware())
app.listen(3000)

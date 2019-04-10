
const koa = require('koa');
const router = require('koa-joi-router');

const api = router();

api.prefix('/api')

const app = new koa();
app.use(api.middleware());
app.listen(3000);

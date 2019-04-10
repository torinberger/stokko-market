
const koa       = require('koa'),
      router    = require('koa-joi-router'),
      marketAPI = require('./market'),
      api       = router();

api.prefix('/api');
marketAPI(api);

const app = new koa();
app.use(api.middleware());
app.listen(3000);

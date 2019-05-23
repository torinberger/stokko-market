
const axios = require('axios')
const Router = require('koa-router')

const serverPrivate = require('../../private')
const stockList = require('./stockList').stocks

module.exports = (database) => {
  const market = new Router()

  market.get('/get/stock/:stock', async (ctx) => {
    let stock = ctx.params.stock

    if (stockList.includes(stock)) {
      ctx.body = await new Promise(function (resolve, reject) {
        axios
          .get(`https://www.quandl.com/api/v3/datasets/WIKI/${stock}/data.json?api_key=${serverPrivate.api.key}&collapse=quarterly&start_date=2000-01-01`)
          .then(function (response) {
            let data = response.data
            resolve(data)
          })
          .catch(function (e) {
            resolve({ type: 'err' })
            throw e
          })
      })
    } else {
      ctx.response.status = 404
      ctx.response.body = 'Stock Not Found'
      ctx.throw(ctx.response.status, ctx.response.body)
    }
  })

  market.get('/get/stocklist', async (ctx) => {
    ctx.body = stockList
  })

  return (market)
}

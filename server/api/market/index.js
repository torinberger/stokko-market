
const axios = require('axios')
const Router = require('koa-router')

const serverPrivate = require('../../private.json');
const Response = require('../../utils/responseStandard')

module.exports = (database) => {
  const market = new Router()

  market.get('/get/stock/:stock', async (ctx) => {
    let stockSymbol = ctx.params.stock

    await database
      .stock()
      .getStock({
        symbol: stockSymbol
      })
      .then(async (stock) => {
        if(stock.length === 0) {
          ctx.status = 404
          ctx.body = 'Stock Not Found!'
        } else {
          stock = stock[0]

          await axios
            .get(`https://www.quandl.com/api/v3/datasets/WIKI/${stock}/data.json?api_key=${serverPrivate.api.key}&collapse=quarterly&start_date=2000-01-01`)
            .then(function (response) {
              stock.history = response.data

              ctx.satus = 200
              ctx.body = stock
            })
            .catch(function (e) {
              ctx.status = 404
              ctx.body = 'Stock Not Found!'
            })
        }
      })
      .catch((err) => {
        ctx.status = 500
        ctx.body = err
      })
  })

  market.get('/get/stocks', async (ctx) => {
    await database
      .stock()
      .getStocks()
      .then((stocks) => {
        ctx.status = 200
        ctx.body = stocks
      })
      .catch((err) => {
        console.log(err)
        ctx.status = 500
        ctx.body = err
      })
  })

  return (market)
}

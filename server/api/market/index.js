
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
          let stockData = stock[0]
          ctx.status = 200
          ctx.body = stockData
        }
      })
      .catch((err) => {
        ctx.status = 500
        ctx.body = err
      })
  })

  market.get('/get/stockHistory/:stock', async (ctx) => {
    let stockSymbol = ctx.params.stock

    await axios
      .get(`https://www.quandl.com/api/v3/datasets/WIKI/${stockSymbol}/data.json?api_key=${serverPrivate.api.key}&collapse=quarterly&start_date=2000-01-01`)
      .then(function (response) {
        let history = response.data

        ctx.status = 200
        ctx.body = history
      })
      .catch(function (err) {
        console.log(err)
        ctx.status = 404
        ctx.body = 'Stock Not Found!'
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

  market.post('/buy/stock/:stock', async (ctx) => {
    let userDetails = ctx.request.body
    let stockSymbol = ctx.params.stock

    await axios
      .get(`https://www.quandl.com/api/v3/datasets/WIKI/${stockSymbol}/data.json?api_key=${serverPrivate.api.key}&collapse=quarterly&start_date=2000-01-01`)
      .then(async function (response) {
        let history = response.data

        await database
          .user()
          .getUser(userDetails)
          .then(function (user) {
            user = user[0]

            
          })
          .catch(function (err) {
            ctx.status = 500
            ctx.body = err
          })
      })
      .catch(function (err) {
        console.log(err)
        ctx.status = 404
        ctx.body = 'Stock Not Found!'
      })
  })

  return (market)
}

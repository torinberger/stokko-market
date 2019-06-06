
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

          await axios
            .get(`https://www.quandl.com/api/v3/datasets/WIKI/${stockData.symbol}/data.json?api_key=${serverPrivate.api.key}&collapse=quarterly&start_date=2000-01-01`)
            .then(function (response) {
              let history = response.data
              console.log('history:\n', history)
              
              stockData.history = JSON.stringify(response.data.dataset_data)
              console.log('stockdata:\n', stockData);

              console.log(stockData.history)

              ctx.status = 200
              ctx.body = stockData
            })
            .catch(function (err) {
              console.log(err)
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

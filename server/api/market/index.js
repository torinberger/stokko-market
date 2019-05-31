
const axios = require('axios')
const Router = require('koa-router')

const serverPrivate = require('../../private')
const database = require('../../database')()

module.exports = () => {
  const market = new Router()

  market.get('/get/stock/:stock', async (ctx) => {
    let stock = ctx.params.stock

    ctx.body = await new Promise(function (resolve, reject) {
      database.stock().getStocks(function (stocks) {
        let stockList = []

        for (let i = 0; i < stocks.length; i++) {
          stockList.push(stocks[i].symbol)
        }

        console.log(stockList)

        if (stockList.includes(stock)) {
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
        } else {
          ctx.response.status = 404
          resolve('Stock Not Found')
        }
      })
    })
  })

  market.get('/get/stocklist', async (ctx) => {
    ctx.body = await new Promise(function (resolve, reject) {
      database.stock().getStocks(function (stocks) {
        resolve(stocks)
      })
    })
  })

  return (market)
}

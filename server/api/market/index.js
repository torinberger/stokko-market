
const axios = require('axios')
const Router = require('koa-router')

const Response = require('../../utils/responseStandard')

module.exports = () => {
  const market = new Router()

  market.get('/get/stock/:stock', async (ctx) => {
    let stockID = ctx.params.stock

    await database
      .user()
      .getStockByID(stockID)
      .then((stock) => {
        ctx.body = new Response('success', stock)
      })
      .catch((err) => {
        ctx.body = new Response('err', err)
      })
  })

  market.get('/get/stocklist', async (ctx) => {
    await database
      .user()
      .getStocks()
      .then((stocks) => {
        ctx.body = new Response('success', users)
      })
      .catch((err) => {
        ctx.body = new Response('err', err)
      })
  })

  return (market)
}

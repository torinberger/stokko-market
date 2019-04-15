
const axios = require('axios')
const serverPrivate = require('../private')

module.exports = (api) => {
  api.get('/get/stock/:stock', async (ctx) => {
    let stock = ctx.request.params.stock

    ctx.body = await new Promise(function (resolve, reject) {
      axios
        .get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${serverPrivate.api.key}`)
        .then(function (response) {
          let data = response.data
          resolve(data)
        })
    })
  })
}

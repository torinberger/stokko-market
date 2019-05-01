
const axios = require('axios')
const serverPrivate = require('../private')

module.exports = (api) => {
  api.get('/get/stock/:stock', async (ctx) => {
    let stock = ctx.request.params.stock

    ctx.body = await new Promise(function (resolve, reject) {
      axios
        .get(`https://www.quandl.com/api/v3/datasets/EOD/${stock}/data.json?api_key=${serverPrivate.api.key}`)
        .then(function (response) {
          let data = response.data
          resolve(data)
        })
    })
  })
}


var db = require('./database')()
var stockList = require('./api/market/stockList').stocks
var axios = require('axios')
var serverPrivate = require('./private')

for (let i = 0; i < stockList.length; i++) {
  let STOCKSYMBOL = stockList[i]

  axios
    .get(`https://www.quandl.com/api/v3/datasets/WIKI/${STOCKSYMBOL}/data.json?api_key=${serverPrivate.api.key}&collapse=quarterly&start_date=2000-01-01`)
    .then(function (response) {
      let data = response.data

      db.stock().addStock({
        name: STOCKSYMBOL,
        symbol: STOCKSYMBOL,
        description: STOCKSYMBOL,
        owner: null,
        value: data.dataset_data.data[data.dataset_data.data.length - 1][4]
      }, function (stock) {
        console.log(stock)
      })
    })
    .catch(function (e) {
      throw e
    })
}

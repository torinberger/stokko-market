
const axios = require('axios')
const Router = require('koa-router')

const serverPrivate = require('../../private.json')

function obj2Arr (obj, addTitle) { // turn an object into an array, and if addTitle = true, add the title of each obj into the array
  let arr = []

  let i = 0
  for (let elem in obj) {
    arr.push(obj[elem])
    if (addTitle) { arr[i]['0. date'] = elem }

    i++
  }
  return arr
}

var inc = 0 // current key incrementer
function getKey() { // rotate through api keys for extra uses
  inc = inc+1 > require('../../private').api.keys.length ? 0 : inc+1 // increment key and loop
  return require('../../private').api.keys[inc] // return current key
}

module.exports = (database) => {
  const market = new Router()

  market.get('/get/stock/:stock', async (ctx) => { // get stock
    let stockSymbol = ctx.params.stock // get stock symbol

    await database
      .stock()
      .getStock({ // get stock from db
        symbol: stockSymbol
      })
      .then(async (stock) => {
        if (stock.length === 0) { // error if stock not found
          ctx.status = 404
          ctx.body = 'Stock Not Found!'
        } else { // send stock info
          let stockData = stock[0]
          ctx.status = 200
          ctx.body = stockData
        }
      })
      .catch((err) => { // error getting stock
        ctx.status = 500
        ctx.body = err
      })
  })

  market.get('/get/stockHistory/:stock/:time', async (ctx) => { // get stock history from alphavantage api
    let stockSymbol = ctx.params.stock // get stock symbol param
    let timeInterval = ctx.params.time // get time interval param

    await axios // get stock history from api
      .get(`https://www.alphavantage.co/query?function=TIME_SERIES_${timeInterval == 'INTRADAY' ? timeInterval : timeInterval + '_ADJUSTED'}&symbol=${stockSymbol}&apikey=${getKey()}&interval=60min`)
      .then(async (response) => {
        let history = response.data // get stock history
        console.log(response.data.note ? response.data.note : 'Requested Stock (stock history)!') // if stock user limit reached, log
        let data = obj2Arr(obj2Arr(history)[1], true).reverse() // convert array of objects into array of arrays for the chart to display

        ctx.status = 200
        ctx.body = data // send chart data/history
      })
      .catch(function (err) { // if could not find stock
        console.log('Error getting stock history', err)
        ctx.status = 404
        ctx.body = 'Stock Not Found!' // send error 404
      })
  })

  market.get('/get/stocks', async (ctx) => { // get all stocks
    await database
      .stock()
      .getStocks() // get all stocks
      .then((stocks) => {
        ctx.status = 200
        ctx.body = stocks // return stocks
      })
      .catch((err) => { // if could not get stock
        console.log('Error getting stocks from DB', err)
        ctx.status = 500 // return error
        ctx.body = err
      })
  })

  market.get('/get/holdings/:user', async (ctx) => { // get user's holdings
    let userID = ctx.params.user // get user param

    await database
      .holding() // get user's holdings
      .getHolding({ user: userID })
      .then((holdings) => {
        ctx.status = 200
        ctx.body = holdings // return holdings
      })
  })

  market.post('/buy/stock/:stock', async (ctx) => { // buy a stock
    let postData = ctx.request.body
    let { holding } = postData // { amount, stockID }
    let { user } = postData // user ID
    let stockSymbol = ctx.params.stock // get stock symbol as param

    await axios // query API for current price
      .get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&apikey=${getKey()}&interval=60min`)
      .then(async (response) => {
        let history = response.data // get stock history
        console.log(response.data.note ? response.data.note : 'Requested Stock (buy stock)!') // if api max calls exceeded
        let stockPrice = obj2Arr(obj2Arr(history)[1], true)[0]['4. close'] // get current stock price

        await database
          .user()
          .getUser({_id: user}) // get current user
          .then(async (targetUser) => {
            targetUser = targetUser[0] // set current user

            if(targetUser !== undefined) { // check they exist
              let price = stockPrice * holding.amount // get current transaction price

              if(targetUser.balance >= price) { // check user has enough money
                await database
                  .transaction()
                  .addTransaction({ // add transaction to db
                    user,
                    stock: holding.stockID,
                    price: stockPrice,
                    date: new Date().getTime(),
                    type: 'buy',
                    amount: holding.amount
                  })
                  .then(async (addedTransaction) => { // log new transaction
                    console.log('New transaction', addedTransaction)
                  })
                await database
                  .user()
                  .updateUser(user, { $inc: { 'balance': -price } }) // decrease user's balance
                  .then((updatedUser) => {
                    console.log('Decreased user\'s balance by ', price)
                  })
                await database
                  .holding()
                  .updateOrAddHolding(user, holding.stockID, { $inc: { 'amount': holding.amount } }) // increase user's holding amount of target stock
                  .then((updatedHolding) => {
                    ctx.body = 'bought stock'
                  })
              } else { // if user has not enough money
                ctx.status = 400
                ctx.body = 'Not Enough Money in Balance!'
              }
            } else { // if user could not be found
              ctx.status = 404
              ctx.body = 'User Not Found!'
            }
          })
      })
      .catch(function (err) { // if error getting stock data
        console.log('Error buying stock', err)
        ctx.status = 404
        ctx.body = 'Stock Not Found!'
      })
  })

  market.post('/sell/stock/:stock', async (ctx) => { // if user tries to sell a stock
    let postData = ctx.request.body
    let { holding } = postData // { amount, stockID }
    let { user } = postData // user ID
    let stockSymbol = ctx.params.stock // stock symbol from param

    await axios // get current stock price
      .get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&apikey=${getKey()}&interval=60min`)
      .then(async (response) => {
        let history = response.data // get stock history
        console.log(response.data.note ? response.data.note : 'Requested Stock (sell stock)!') // if max api calls exceeded
        let stockPrice = obj2Arr(obj2Arr(history)[1], true)[0]['4. close'] // get current stock price

        await database
          .user()
          .getUser({ _id: user }) // get current user
          .then(async (targetUser) => {
            targetUser = targetUser[0]

            if(targetUser !== undefined) { // if user not found

              await database
                .holding()
                .getHolding({ user: user }) // get holdings of user
                .then(async (holdings) => {

                  for (var i = 0; i < holdings.length; i++) { // go through each holding
                    if (holdings[i].user == user && holdings[i].amount > 0) { // check user has holding and more than 1

                      // determine transaction information
                      let amountToSell = (holding.amount <= holdings[i].amount ? holding.amount : holdings[i].amount) // gets lower value, owned amount, or requested sell amount
                      let price = stockPrice * amountToSell

                      await database
                        .transaction()
                        .addTransaction({ // make transaction db side
                          user,
                          stock: holding.stockID,
                          price: stockPrice,
                          date: new Date().getTime(),
                          type: 'sell',
                          amount: amountToSell
                        })
                        .then(async (addedTransaction) => {
                          console.log('New transaction', addedTransaction)
                        })
                      await database
                        .user()
                        .updateUser(user, { $inc: { 'balance': price } }) // increase user's balance
                        .then((updatedUser) => {
                          console.log('Increased user\'s balance by ', price)
                        })
                      await database
                        .holding()
                        .updateOrAddHolding(user, holding.stockID, { $inc: { 'amount': -amountToSell } }) // decrease amount of the stock owned
                        .then((updatedHolding) => {
                          ctx.body = 'stock sold!'
                        })
                      return
                    }
                  }

                  // if target holding with more than one share could not be found
                  ctx.status = 400
                  ctx.body = 'Not Enough Shares in Stock!'
                })

            } else { // if user not found
              ctx.status = 404
              ctx.body = 'User Not Found!'
            }
          })
      })
      .catch(function (err) { // if error getting stock history
        console.log('Error selling stock', err)
        ctx.status = 404
        ctx.body = 'Stock Not Found!'
      })
  })

  return (market)
}

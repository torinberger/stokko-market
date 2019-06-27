<template>
  <div class="stock-page">

    <q-select
      filled
      v-model="stockSearch"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="stockOptions"
      @filter="filterFn"
      @new-value="requestStock"
      @input="requestStock"
      placeholder="Search Stocks"
      style="width: 100%;"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <div id="stock-chart-list" v-bind:key="currentStock" v-for="currentStock in stocks" elevated>
      <q-select
        filled
        v-model="timeInterval"
        @input="changeInterval"
        :options="['Hourly', 'Daily', 'Weekly', 'Monthly']"
      >

      </q-select>
      <stock-chart :stock="currentStock" :timeInterval="timeInterval"></stock-chart>
    </div>

    <div id="stock-info" v-if="stockMetaData">
      <h4>{{ stockMetaData.name }}<span> [{{ stockMetaData.symbol }}]</span><span style="float: right;">${{ currentStockPrice }}</span></h4>
      <p>{{ stockMetaData.description }}</p>
      <div id="stock-interactions" v-if='authenticated'>
        <q-btn
          label="Buy"
          :disabled="disableInput || Math.floor(balance / currentStockPrice) <= 0"
          color="primary"
          @click="alertBuy = true"
        />
        <q-btn
          label="Sell"
          :disabled="disableInput"
          v-if="maxToSell >= 1"
          color="primary"
          @click="alertSell = true"
        />

        <p
          v-if="userHolding && maxToSell >= 1"
        >You own {{ userHolding.amount }} share{{ userHolding.amount > 1 ? 's' : '' }} of this stock.</p>

        <q-dialog v-model="alertBuy">
          <q-card>
            <q-card-section>
              <div class="text-h6">Buy Stock</div>
            </q-card-section>

            <q-card-section>
              <p>-${{ currentStockPrice * amountToBuy }} / Maximum purchasable: {{ Math.floor(balance / currentStockPrice) }}</p>
            </q-card-section>

            <q-card-actions align="right">
              <q-input
                type="number"
                @input="checkValidNumber(Math.floor(balance / currentStockPrice), 1)"
                filled :max="Math.floor(balance / currentStockPrice)"
                min="1"
                v-model="amountToBuy"
              ></q-input>
              <q-btn
                @click="buyStock"
                :disabled="disableInput || amountToBuy <= 0"
                name="buy"
              >Buy</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="alertSell">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sell Stock</div>
            </q-card-section>

            <q-card-section>
              <p>+${{ currentStockPrice * amountToBuy }} / Maximum sellable: {{ maxToSell }}</p>
            </q-card-section>

            <q-card-actions align="right">
              <q-input
                type="number"
                filled :max="maxToSell"
                @input="checkValidNumber(maxToSell, 1)" min="1"
                v-model="amountToBuy"
              ></q-input>
              <q-btn
                @click="sellStock"
                :disabled="disableInput || amountToBuy <= 0"
                name="buy"
              >Sell</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Stock',
  components: {
    StockChart: () => import('../components/StockChart.vue')
  },
  data () {
    return {
      stockSearch: null, // string holder for the stock search bar
      stocks: [], // list containing one stock symbol (current stock) (used to force refreshes)
      stockOptions: [], // used for stock search
      staticOptions: [], // used for stock search
      stocksMetaData: [], // meta data { symbol, description, etc } for all stocks
      currentStockPrice: 0,
      userHolding: null, // current holding of stock user is observing
      amountToBuy: 1, // amount the user is attemping to buy
      maxToSell: 0, // maximum amount of the current stock a user can sell
      alertBuy: false, // buy popup
      disableInput: false, // disable buttons if input is loading
      alertSell: false, // sell popup
      stockMetaData: null, // meta data for current stock { symbol, desc, etc }
      authenticated: false, // boolean for whether the user is logged in or not.
      timeInterval: 'Monthly' // time period to load stock history at
    }
  },
  computed: {
    balance () {
      return this.$store.state.balance // constantly keep user balance updated
    }
  },
  created () { // when module loaded
    this.stocks = [this.$route.params.stock] // get current stock based on param
    this.disableInput = true // disable all input to prevent bugs

    if (this.stocks[0] === undefined) { // redirect if stock is unkown
      this.stocks = []
      this.checkBalance()
    }

    let self = this

    axios // get all stocks meta data
      .get(`http://localhost:3000/api/market/get/stocks/`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + self.$store.state.JWTtoken
        }
      })
      .then((response) => {
        console.log('Found all stocks:', response.data)
        let stocks = []

        // get all meta data for all stocks
        for (let i = 0; i < response.data.length; i++) {
          stocks.push(response.data[i].symbol)
        }

        // store data
        self.stocksMetaData = response.data
        self.stockOptions = self.staticOptions = stocks

        // if stocks have been found, load the current stock
        if (self.stocks.length !== 0) {
          self.requestStock(this.stocks[0])
        }
      })
  },
  methods: {
    changeInterval () { // if the user changes the time period to display on the stock graph
      let currentStocks = this.stocks // get current stock
      this.stocks = [] // reset stocks
      let self = this
      setTimeout(function () {
        self.stocks = currentStocks // after 10ms, load back in same data
      }, 10)

      // THIS REFRESHES THE CHART TO UPDATE PARAMETERS
    },
    checkValidNumber (max, min) { // check if user input is within the range
      if (this.amountToBuy > max) {
        this.amountToBuy = max
      } else if (this.amountToBuy < min) {
        this.amountToBuy = min
      }
    },
    checkBalance () { // check the user's balance
      let self = this
      if (self.$store.state.user) { // if user logged in
        axios // get user
          .get(`http://localhost:3000/api/users/get/user/${self.$store.state.user}`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Authorization': 'Bearer ' + self.$store.state.JWTtoken
            }
          })
          .then((response) => {
            let user = response.data[0] // set user and update balance globally
            self.$store.commit('updateBalance', user.balance)
          })
      }
    },
    requestStock (input) { // request current stock and display info
      const stock = String(input).toUpperCase()

      this.disableInput = true
      this.userHolding = null // reset meta variables
      this.maxToSell = 0

      this.stocks = [] // empty chart
      this.stocks = [stock] // refresh chart to new stock

      console.log('Requesting current stock', this.stocks)

      history.pushState( // redirect to correct URL
        { urlPath: `/#/stock/${stock}` },
        '',
        `/#/stock/${stock}`
      )

      this.checkBalance() // update user balance

      let self = this

      // go through each stock's meta data
      for (let i = 0; i < self.stocksMetaData.length; i++) {
        const target = self.stocksMetaData[i]

        if (target.symbol === self.stocks[0]) { // find current stock's meta data
          self.stockMetaData = target
        }
      }

      if (this.stocks.length >= 1) { // check there is a selected stock
        axios
          .get(`http://localhost:3000/api/market/get/stockHistory/${this.stocks[0]}/DAILY`, { // get daily stock history
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Authorization': 'Bearer ' + self.$store.state.JWTtoken // give auth token
            }
          })
          .then((response) => {
            if (response.data.type === 'err') { // if error getting stock data, display err
              self.$q.notify({ message: 'Error getting stock data!', color: 'red' })
            } else {
              console.log('Received stock history')
              let stockHistory = response.data // store stock history
              self.currentStockPrice = stockHistory[0]['5. adjusted close'] // get current stock value
              console.log('Current stock pice', self.currentStockPrice)
            }
          })
          .catch((err) => { // if error getting stock history, display err
            console.log('Error getting stock', err)
            self.$q.notify({ message: 'Error getting stock data!', color: 'red' })
          })
      }

      if (self.$store.state.JWTtoken) { // if user logged in
        axios
          .get('http://localhost:3000/api/auth/validate', { // check if user valid
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Authorization': 'Bearer ' + self.$store.state.JWTtoken // give auth token
            }
          })
          .then((response) => {
            if (response.data === 'Validated') { // check validated
              self.authenticated = true // tell page that user can buy/sell stocks
              console.log('User is authenticated')

              axios // get user's holdings
                .get(`http://localhost:3000/api/market/get/holdings/${this.$store.state.user}`)
                .then((holdings) => {
                  console.log('Users holdings', holdings.data)
                  this.disableInput = false // enable the user to user buy/sell buttons

                  let userHoldings = holdings.data

                  // go though all user's holdings
                  for (var i = 0; i < userHoldings.length; i++) {
                    if (userHoldings[i].stock === self.stockMetaData._id) {
                      console.log('User owns current stock') // find current stock holding and amount
                      self.userHolding = userHoldings[i]
                      self.maxToSell = userHoldings[i].amount
                      console.log('Maximum user can sell of stock', self.maxToSell)
                    }
                  }
                })
            } else {
              self.authenticated = false // if user unauthorised do not allow to buy/sell stocks
            }
          })
      } else {
        self.authenticated = false // if no token provided, do not let user buy/sell stocks
      }
    },
    filterFn (val, update, abort) { // used for the stock search bar, displays options depenedent on what has been typed
      let self = this
      update(() => {
        const needle = val.toLowerCase()
        this.stockOptions = self.staticOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    buyStock () { // when user tries to buy an amount of a stock
      let self = this

      this.disableInput = true // disable input to prevent spamming

      console.log('Buying stock of id', this.stockMetaData._id, 'times', this.amountToBuy)

      axios // ask server to buy stock
        .post(`http://localhost:3000/api/market/buy/stock/${this.stocks[0]}`, {
          holding: { // provide transaction information
            amount: this.amountToBuy,
            stockID: this.stockMetaData._id
          },
          user: this.$store.state.user // give user ID
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + this.$store.state.JWTtoken // provide auth token
          }
        })
        .then(function (response) {
          // notify all is well
          self.$q.notify({ message: 'Stock bought succesfully!', color: 'green' })
          self.alertBuy = false // reset meta variables
          self.amountToBuy = 1
          self.disableInput = false
          self.requestStock(self.stocks[0]) // update stock info
        })
        .catch((err) => { // if could not buy stock
          console.log('error in buying stock', err)
          let errCode = err.message.split(' ')[err.message.split(' ').length - 1]

          if (errCode === '400') { // if known error, display it
            self.$q.notify({ message: 'You do not have enough money!', color: 'red' })
            self.alertBuy = false // reset meta variables
            self.disableInput = false
          }
        })
    },
    sellStock () { // if user tries to sell stock
      let self = this

      this.disableInput = true // disable buy/sell buttons

      console.log('Selling stock of id', this.stockMetaData._id, 'times', this.amountToBuy)

      axios // ask server to buy stock
        .post(`http://localhost:3000/api/market/sell/stock/${this.stocks[0]}`, {
          holding: { // give transaction information
            amount: this.amountToBuy,
            stockID: this.stockMetaData._id
          },
          user: this.$store.state.user // give user
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + this.$store.state.JWTtoken // give auth token
          }
        })
        .then(function (response) {
          // notify all went well
          self.$q.notify({ message: 'Stock sold succesfully!', color: 'green' })
          self.alertSell = false // reset meta variables
          self.disableInput = false
          self.amountToBuy = 1
          self.requestStock(self.stocks[0]) // update stock info
        })
        .catch((err) => { // if could not sell stock
          console.log('Error selling stock', err)
          let errCode = err.message.split(' ')[err.message.split(' ').length - 1]

          if (errCode === '400') { // if known error, display it
            self.$q.notify({ message: 'You do not have any of this stock!', color: 'red' })
            self.alertSell = false
            self.disableInput = false
          }
        })
    }
  }
}
</script>

<style scoped>

#stock-chart-list {
  margin: auto;
  margin: 1vh;
  display: inline-block;
}

#stock-info {
  background: lightgrey;
  display: inline-block;
  width: calc(50vw - 3vh);
  float: right;
  margin: 1vh;
  margin-left: 0;
  background: rgb(0, 0, 0, 0.05);
  border-radius: 2px;
}

#stock-info > h4, #stock-info > p {
  margin: 1vh;
  width: auto;
  color: black;
}

#stock-info span {
  margin: 0.5vh;
  font-size: 2vh;
  color: grey;
  width: auto;
}

.q-card {
  overflow: hidden;
}

</style>

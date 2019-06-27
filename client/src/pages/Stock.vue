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
      <q-select v-model="timeInterval" @input="changeInterval" :options="['Hourly', 'Daily', 'Weekly', 'Monthly']"></q-select>
      <stock-chart :stock="currentStock" :timeInterval="timeInterval"></stock-chart>
    </div>

    <div id="stock-info" v-if="stockMetaData">
      <h4>{{ stockMetaData.name }}<span> [{{ stockMetaData.symbol }}]</span><span style="float: right;">${{ currentStockPrice }}</span></h4>
      <p>{{ stockMetaData.description }}</p>
      <div id="stock-interactions" v-if='authenticated'>
        <q-btn label="Buy" :disabled="disableInput || Math.floor(balance / currentStockPrice) <= 0" color="primary" @click="alertBuy = true" />
        <q-btn label="Sell" :disabled="disableInput" v-if="maxToSell >= 1" color="primary" @click="alertSell = true" />

        <p v-if="userHolding && maxToSell >= 1">You own {{ userHolding.amount }} shares of this stock.</p>

        <q-dialog v-model="alertBuy">
          <q-card>
            <q-card-section>
              <div class="text-h6">Buy Stock</div>
            </q-card-section>

            <q-card-section>
              <p>-${{ currentStockPrice * amountToBuy }} / Maximum purchasable: {{ Math.floor(balance / currentStockPrice) }}</p>
            </q-card-section>

            <q-card-actions align="right">
              <q-input type="number" @input="checkValidNumber(Math.floor(balance / currentStockPrice), 1)" filled :max="Math.floor(balance / currentStockPrice)" min="1" v-model="amountToBuy"></q-input> <q-btn @click="buyStock" :disabled="disableInput || amountToBuy <= 0" name="buy">Buy</q-btn>
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
              <q-input type="number" filled :max="maxToSell" @input="checkValidNumber(maxToSell, 1)" min="1" v-model="amountToBuy"></q-input> <q-btn @click="sellStock" :disabled="disableInput || amountToBuy <= 0" name="buy">Sell</q-btn>
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
      timeInterval: 'Monthly'
    }
  },
  computed: {
    balance () {
      return this.$store.state.balance
    }
  },
  created () {
    this.stocks = [this.$route.params.stock]
    this.disableInput = true

    if (this.stocks[0] === undefined) {
      this.stocks = []
      console.log('echign')
      this.checkBalance()
    }

    let self = this

    axios
      .get(`http://localhost:3000/api/market/get/stocks/`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + self.$store.state.JWTtoken
        }
      })
      .then((response) => {
        console.log('Found all stocks:', response.data)
        let stocks = []

        for (let i = 0; i < response.data.length; i++) {
          stocks.push(response.data[i].symbol)
        }

        self.stocksMetaData = response.data
        self.stockOptions = self.staticOptions = stocks

        if (self.stocks.length !== 0) {
          self.requestStock(this.stocks[0])
        }
      })
  },
  methods: {
    changeInterval () {
      console.log('change')
      let currentStocks = this.stocks
      this.stocks = []
      let self = this
      setTimeout(function () {
        self.stocks = currentStocks
      }, 10)
    },
    checkValidNumber (max, min) {
      if (this.amountToBuy > max) {
        this.amountToBuy = max
      } else if (this.amountToBuy < min) {
        this.amountToBuy = min
      }
    },
    checkBalance () {
      let self = this
      if (self.$store.state.user) {
        axios
          .get(`http://localhost:3000/api/users/get/user/${self.$store.state.user}`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Authorization': 'Bearer ' + self.$store.state.JWTtoken
            }
          })
          .then((response) => {
            let user = response.data[0]
            console.log('User', user)
            self.$store.commit('updateBalance', user.balance)
          })
      }
    },
    requestStock (input) {
      const stock = String(input).toUpperCase()

      this.disableInput = true
      this.userHolding = null
      this.maxToSell = 0

      this.stocks = []
      this.stocks = [stock]

      console.log('Requesting current stock', this.stocks)

      history.pushState(
        { urlPath: `/#/stock/${stock}` },
        '',
        `/#/stock/${stock}`
      )

      this.checkBalance()

      let self = this

      for (let i = 0; i < self.stocksMetaData.length; i++) {
        const target = self.stocksMetaData[i]

        if (target.symbol === self.stocks[0]) {
          self.stockMetaData = target
        }
      }

      if (this.stocks.length >= 1) {
        axios
          .get(`http://localhost:3000/api/market/get/stockHistory/${this.stocks[0]}/DAILY`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Authorization': 'Bearer ' + self.$store.state.JWTtoken
            }
          })
          .then((response) => {
            if (response.data.type === 'err') {
              self.$q.notify({ message: 'Error getting stock data!', color: 'red' })
            } else {
              console.log('Received stock history')
              let stockHistory = response.data
              console.log(stockHistory)
              self.currentStockPrice = stockHistory[0]['5. adjusted close']
              console.log('Current stock pice', self.currentStockPrice)
            }
          })
          .catch((err) => {
            console.log(err)
            self.$q.notify({ message: 'Error getting stock data!', color: 'red' })
          })
      }

      if (self.$store.state.JWTtoken) {
        axios
          .get('http://localhost:3000/api/auth/validate', {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Authorization': 'Bearer ' + self.$store.state.JWTtoken
            }
          })
          .then((response) => {
            if (response.data === 'Validated') {
              self.authenticated = true
              console.log('User is authenticated')

              axios
                .get(`http://localhost:3000/api/market/get/holdings/${this.$store.state.user}`)
                .then((holdings) => {
                  console.log('Users holdings ', holdings.data)
                  this.disableInput = false

                  let userHoldings = holdings.data

                  for (var i = 0; i < userHoldings.length; i++) {
                    if (userHoldings[i].stock === self.stockMetaData._id) {
                      console.log('User owns current stock')
                      self.userHolding = userHoldings[i]
                      self.maxToSell = userHoldings[i].amount
                      console.log('Maximum user can sell of stock', self.maxToSell)
                    }
                  }
                })
            } else {
              self.authenticated = false
            }
          })
      } else {
        self.authenticated = false
      }
    },
    filterFn (val, update, abort) {
      let self = this
      update(() => {
        const needle = val.toLowerCase()
        this.stockOptions = self.staticOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    buyStock () {
      let self = this

      this.disableInput = true

      console.log('Buying stock of id', this.stockMetaData._id)

      axios
        .post(`http://localhost:3000/api/market/buy/stock/${this.stocks[0]}`, {
          holding: {
            amount: this.amountToBuy,
            stockID: this.stockMetaData._id
          },
          user: this.$store.state.user
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + this.$store.state.JWTtoken
          }
        })
        .then(function (response) {
          console.log('Bought stock')
          self.$q.notify({ message: 'Stock bought succesfully!', color: 'green' })
          self.alertBuy = false
          self.amountToBuy = 1
          self.disableInput = false
          self.requestStock(self.stocks[0])
        })
        .catch((err) => {
          console.log('error in buying stock', err)
          let errCode = err.message.split(' ')[err.message.split(' ').length - 1]

          if (errCode === '400') {
            self.$q.notify({ message: 'You do not have enough money!', color: 'red' })
            self.alertBuy = false
            self.disableInput = false
          }
        })
    },
    sellStock () {
      let self = this

      this.disableInput = true

      console.log('Selling stock of id', this.stockMetaData._id, 'times', this.amountToBuy)

      axios
        .post(`http://localhost:3000/api/market/sell/stock/${this.stocks[0]}`, {
          holding: {
            amount: this.amountToBuy,
            stockID: this.stockMetaData._id
          },
          user: this.$store.state.user
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + this.$store.state.JWTtoken
          }
        })
        .then(function (response) {
          console.log('Sold stock succesfully')
          self.$q.notify({ message: 'Stock sold succesfully!', color: 'green' })
          self.alertSell = false
          self.disableInput = false
          self.amountToBuy = 1
          self.requestStock(self.stocks[0])
        })
        .catch((err) => {
          console.log('Error selling stock', err)
          let errCode = err.message.split(' ')[err.message.split(' ').length - 1]

          if (errCode === '400') {
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
  background: #212733;
}

#stock-info h4, p {
  margin: 1vh;
  width: auto;
  color: white;
}

#stock-info span {
  margin: 0.5vh;
  font-size: 2vh;
  color: lightgrey;
  width: auto;
}

</style>

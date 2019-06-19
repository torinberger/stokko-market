<template>
  <div class="stock-page">

    <q-select
      filled
      v-model="model"
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
      <stock-chart :stock="currentStock"></stock-chart>
    </div>

    <div id="stock-info" v-if="stockMetaData">
      <h4>{{ stockMetaData.name }}<span> {{ stockMetaData.symbol }}</span></h4>
      <p>{{ stockMetaData.description }}</p>
      <div id="stock-interactions" v-if='authenticated'>
        <q-btn label="Buy" color="primary" @click="alertBuy = true" />
        <q-btn label="Sell" v-if="maxToSell >= 1" color="primary" @click="alertSell = true" />

        <p v-if="userHolding && maxToSell >= 1">You own {{ userHolding.amount }} shares of this stock.</p>

        <q-dialog v-model="alertBuy">
          <q-card>
            <q-card-section>
              <div class="text-h6">Buy Stock</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-input type="number" filled min="1" v-model="amountToBuy"></q-input> <q-btn @click="buyStock" name="buy">Buy</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="alertSell">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sell Stock</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-input type="number" filled :max="maxToSell" min="1" v-model="amountToBuy"></q-input> <q-btn @click="sellStock" name="buy">Sell</q-btn>
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
      model: null,
      stocks: [],
      stockOptions: [],
      staticStocks: [],
      metaStocks: [],
      userHolding: null,
      amountToBuy: 1,
      maxToSell: 0,
      alertBuy: false,
      alertSell: false,
      stockMetaData: null,
      authenticated: false
    }
  },
  created () {
    this.stocks = [this.$route.params.stock]

    if (this.stocks[0] === undefined) {
      this.stocks = []
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
        console.log(response.data)
        let stocks = []

        for (let i = 0; i < response.data.length; i++) {
          stocks.push(response.data[i].symbol)
        }

        self.metaStocks = response.data
        self.staticStocks = stocks
        self.stockOptions = stocks
      })
  },
  methods: {
    requestStock (input) {
      const stock = String(input).toUpperCase()

      this.stocks = []
      this.stocks = [stock]

      console.log(this.stocks)

      history.pushState(
        { urlPath: `/#/stock/${stock}` },
        '',
        `/#/stock/${stock}`
      )

      let self = this

      console.log(self.metaStocks)

      for (let i = 0; i < self.metaStocks.length; i++) {
        const target = self.metaStocks[i]

        if (target.symbol === self.stocks[0]) {
          self.stockMetaData = target
        }
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
            console.log('auth:')
            console.log(response)

            if (response.data === 'Validated') {
              self.authenticated = true

              axios
                .get(`http://localhost:3000/api/market/get/holdings/${this.$store.state.user}`)
                .then((holdings) => {
                  console.log('Holdings ', holdings.data)
                  console.log(self.$store.state.user)

                  console.log(self.stockMetaData)
                  let userHoldings = holdings.data

                  for (var i = 0; i < userHoldings.length; i++) {
                    console.log(userHoldings[i]._id, self.stockMetaData._id)
                    if (userHoldings[i].stock === self.stockMetaData._id) {
                      console.log('User owns current stock!')
                      self.userHolding = userHoldings[i]
                      self.maxToSell = userHoldings[i].amount
                      console.log('max to sell', self.maxToSell)
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
        this.stockOptions = self.staticStocks.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    buyStock () {
      let self = this

      console.log('biyung stock of id ', this.stockMetaData._id)

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
          console.log(response)
          self.$q.notify({ message: 'Stock bought succesfully!', color: 'green' })
          self.requestStock(self.stocks[0])
        })
        .catch((err) => {
          console.log(err)
          let errCode = err.message.split(' ')[err.message.split(' ').length - 1]

          if (errCode === '400') {
            self.$q.notify({ message: 'You do not have enough money!', color: 'red' })
          }
        })
    },
    sellStock () {
      let self = this

      console.log('selling stock of id ', this.stockMetaData._id)

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
          console.log(response)
          self.$q.notify({ message: 'Stock sold succesfully!', color: 'green' })
          self.requestStock(self.stocks[0])
        })
        .catch((err) => {
          console.log(err)
          let errCode = err.message.split(' ')[err.message.split(' ').length - 1]

          if (errCode === '400') {
            self.$q.notify({ message: 'You do not have any of this stock!', color: 'red' })
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

#stock-info h4 {
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

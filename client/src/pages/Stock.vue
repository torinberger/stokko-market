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
        <q-btn label="Alert" color="primary" @click="alert = true" />

        <q-dialog v-model="alert">
          <q-card>
            <q-card-section>
              <div class="text-h6">Alert</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-input type="number" filled v-model="amountToBuy"></q-input> <q-btn @click="buyStock" name="buy">Buy</q-btn>
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
      userHoldings: [],
      amountToBuy: 1,
      alert: false,
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

    if() // test if authenticated

    axios
      .get(`http://localhost:3000/api/market/get/holdings/${this.$store.state.user}`)
      .then((holdings) => {
        console.log('Holdings')
        console.log(holdings)
        self.userHoldings = holdings
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
        })
        .catch((err) => {
          console.log(err)
          let errCode = err.message.split(' ')[err.message.split(' ').length - 1]

          if (errCode === '400') {
            self.$q.notify({ message: 'You do not have enough money!', color: 'red' })
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

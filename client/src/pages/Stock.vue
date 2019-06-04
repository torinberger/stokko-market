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

    <div id="stock-chart-list" v-bind:key="currentStock" v-for="currentStock in stocks">
      <stock-chart :stock="currentStock"></stock-chart>
    </div>

    <div id="stock-info" v-if="authenticated">
      <h1>{{ stocks[0] }}</h1>
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
      .get(`http://localhost:3000/api/market/get/stocklist`, {
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
    }
  }
}
</script>

<style scoped>

#stock-chart-list {
  display: inline-block;
}

</style>

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
      placeholder="Basic autocomplete"
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

    <div v-bind:key="currentStock" v-for="currentStock in stocks">
      <stock-chart :stock="currentStock"></stock-chart>
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
      staticStocks: []
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
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then((response) => {
        self.staticStocks = response.data
        self.stockOptions = response.data
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

</style>

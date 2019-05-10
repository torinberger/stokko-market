<template>
  <div class="stock-page">

    <q-select
      filled
      v-model="model"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="options"
      @filter="filterFn"
      @new-value="requestStock"
      @input="requestStock"
      placeholder="Basic autocomplete"
      style="width: 100%; padding-bottom: 32px"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <stock-chart :stock="$route.params.stock"></stock-chart>
  </div>
</template>

<script>

const stringOptions = [
  'AAPL', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]

export default {
  name: 'Stock',
  components: {
    StockChart: () => import('../components/StockChart.vue')
  },
  data () {
    return {
      model: null,
      options: stringOptions
    }
  },
  methods: {
    requestStock (input) {
      const stock = String(input)
      console.log(stock.toUpperCase())
    },
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>

<style scoped>

</style>

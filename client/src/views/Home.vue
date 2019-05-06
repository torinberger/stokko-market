<template>
  <div id="home">
    <stock-chart :stock="stock"></stock-chart>
  </div>
</template>

<script>

// import LineChart from '@/components/LineChart.js'
import StockChart from '@/components/StockChart.vue'

export default {
  name: 'home',
  components: {
    StockChart
  },
  data () {
    return {
      stock: 'AAPL'
    }
  }
}

</script>

<style>
</style>

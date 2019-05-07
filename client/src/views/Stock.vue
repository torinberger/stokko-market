<template>
  <div class="stock-page">

    <q-search
      inverted color="blue-6"
      v-model="terms"
      placeholder="Featuring static data">

      <q-autocomplete
        :static-data="{field: 'value', list: countries}"
        @selected="requestStock"
      />
    </q-search>

    <stock-chart :stock="$route.params.stock"></stock-chart>
  </div>
</template>

<script>
import StockChart from '@/components/StockChart.vue'

export default {
  name: 'Stock',
  components: {
    StockChart
  },
  data () {
    return {
      terms: '',
      countries: [
        {
          value: 'test',
          label: 'test',
          icon: 'alarm'
        }
      ]
    }
  },
  methods: {
    requestStock () {
      console.log(this.terms)
    }
  }
}
</script>

<style scoped>

</style>

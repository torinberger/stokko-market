<template>
  <div class="stock-chart">
    <div class="container">
      <div class="Chart__list">
        <div class="Chart">
          <h2>Linechart</h2>
          <line-chart :chartData="chartData"></line-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import LineChart from '@/components/LineChart.js'
import axios from 'axios'

export default {
  name: 'stockChart',
  components: {
    LineChart
	},
	props: ['stock'],
  data() {
    return {
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Data One',
            borderColor: '#FC2525',
            pointBackgroundColor: 'lightgrey',
            borderWidth: 1,
            pointBorderColor: 'lightgrey',
            backgroundColor: 'rgba(255, 0, 0)',
            data: [40, 39, 10, 40, 39, 80, 40]
          },
          {
            label: 'Data Two',
            borderColor: 'rgba(0, 150, 255)',
            pointBackgroundColor: 'lightgrey',
            pointBorderColor: 'lightgrey',
            borderWidth: 1,
            backgroundColor: 'rgba(0, 231, 255)',
            data: [60, 55, 32, 10, 2, 12, 53]
          }
        ]
      }
    }
  },
  mounted() {
    axios
      .get(`http://localhost:3000/api/get/stock/${this.stock}`)
      .then((response) => {
        console.log(response.data);
      })
  }
}

</script>

<style>
.container {
  max-width: 800px;
  margin:  0 auto;
  background: #212733;
}
</style>
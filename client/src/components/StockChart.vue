<template>
  <div class="stock-chart">
    <div class="container">
      <div class="Chart__list">
        <div class="Chart">
          <h2>{{ stock }}</h2>
          <line-chart v-if="ready" :chartData="chartData"></line-chart>
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
  data () {
    return {
      testChartData: {
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
      },
      chartData: {
        labels: [],
        datasets: []
      },
      ready: false
    }
  },
  mounted () {
    let self = this

    this.$q.loadingBar.start()

    axios
      .get(`http://localhost:3000/api/get/stock/${this.stock}`, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then((response) => {
        console.log(response)

        let data = response.data.dataset_data.data.reverse()
        console.log(data)

        self.chartData.datasets.push({
          label: self.stock,
          borderColor: '#FC2525',
          pointBackgroundColor: 'lightgrey',
          borderWidth: 1,
          pointBorderColor: 'lightgrey',
          backgroundColor: 'rgba(255, 0, 0)',
          data: []
        })

        for (let i = 0; i < data.length; i++) {
          const point = data[i]

          let cleanTime = point[0]

          self.chartData.labels.push(cleanTime)
          self.chartData.datasets[0].data.push(Math.round(Number(point[11])))
        }

        console.log(self)

        this.$q.loadingBar.stop()

        self.ready = true
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

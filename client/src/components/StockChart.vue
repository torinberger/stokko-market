<template>
  <div class="stock-chart">
    <div class="container">
      <div class="Chart__list">
        <div class="Chart">
          <!-- <h2>{{ stock }}</h2> -->
          <line-chart v-if="ready" :chartData="chartData"></line-chart>
          <div class="chart-loading-container" v-if="!ready" style="width: 800px; height: 400px; background: #212733;">
            <q-circular-progress
              indeterminate
              size="40px"
              color="blue-6"
              class="q-ma-md"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import LineChart from './LineChart.js'
import axios from 'axios'

export default {
  name: 'stockChart',
  components: {
    LineChart
  },
  props: ['stock'],
  data () {
    return {
      chartData: {
        labels: [],
        datasets: []
      },
      ready: false
    }
  },
  mounted () {
    let self = this

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
          borderColor: 'rgb(13, 71, 161)',
          pointBackgroundColor: 'rgb(179, 229, 252)',
          borderWidth: 2,
          pointBorderColor: 'rgb(179, 229, 252)',
          backgroundColor: 'rgb(68, 138, 255)',
          data: []
        })

        for (let i = 0; i < data.length; i++) {
          const point = data[i]

          let cleanTime = point[0]

          self.chartData.labels.push(cleanTime)
          self.chartData.datasets[0].data.push(Math.round(Number(point[11])))
        }

        console.log(self)

        self.ready = true
      })
  }
}

</script>

<style>
.container {
  max-width: 800px;
  background: #212733;
}

.chart-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

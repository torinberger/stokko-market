<template>
  <div class="stock-chart">
    <div class="container">
      <div class="Chart__list">
        <div class="Chart">
          <!-- <h2>{{ stock }}</h2> -->
          <line-chart v-if="ready && !errorMsg" :chartData="chartData"></line-chart>
          <div class="chart-loading-container" v-if="!ready">
            <q-circular-progress
              indeterminate
              size="40px"
              color="blue-6"
              class="q-ma-md"
            />
          </div>
          <div v-if="ready && errorMsg" class="chart-err-container">
            {{ errorMsg }}
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
      ready: false,
      errorMsg: ''
    }
  },
  mounted () {
    let self = this

    axios
      .get(`http://localhost:3000/api/market/get/stockHistory/${this.stock}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + self.$store.state.JWTtoken
        }
      })
      .then((response) => {
        if (response.data.type === 'err') {
          this.errorMsg = 'Couldn\'t Find Stock'
          this.ready = true
        }

        let data = response.data.dataset_data.data.reverse()

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

        self.ready = true
      })
      .catch((err) => {
        console.log('Error in getting stock history', err)
        this.errorMsg = 'Couldn\'t Find Stock'
        this.ready = true
      })
  }
}

</script>

<style scoped>

@media only screen and (max-width: 500px) and (max-height: 820px) {
  .container {
    width: 100vw;
    height: 60vh;
  }

  #line-chart {
    width: 100vw !important;
    height: 60vh !important;
  }

  .stock-chart {
    height: 60vh;
  }

  .chart-err-container {
    width: 100vw;
    height: 60vh;
    background: #212733;
  }

  .chart-loading-container {
    width: 100vw;
    height: 60vh;
    background: #212733;
  }
}

@media not screen and (max-width: 500px) and (max-height: 820px) {
  .container {
    width: 50vw;
  }

  .chart-err-container {
    width: 50vw;
    height: 400px;
    background: #212733;
  }

  .chart-loading-container {
    width: 50vw;
    height: 400px;
    background: #212733;
  }
}

.container {
  display: inline-block;
  background: #212733;
}

.stock-chart {
  display: inline-block;
}

.chart-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-err-container {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

</style>

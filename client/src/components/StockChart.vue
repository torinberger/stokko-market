<template>
  <div class="stock-chart">
    <div class="container">
      <div class="Chart__list">
        <div class="Chart">
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
  props: ['stock', 'timeInterval'],
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
      .get(`http://localhost:3000/api/market/get/stockHistory/${this.stock}/${this.timeInterval === 'Hourly' ? 'INTRADAY' : this.timeInterval.toUpperCase()}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + self.$store.state.JWTtoken
        }
      })
      .then((response) => {
        if (response.data.type === 'err') {
          self.$q.notify({ message: 'Error getting stock data!', color: 'red' })
        } else {
          console.log('Received stock history')
          let data = response.data

          if (response.data.type === 'err') {
            this.errorMsg = 'Couldn\'t Find Stock'
            this.ready = true
          }

          self.chartData.datasets.push({
            label: self.stock,
            borderColor: 'rgb(56, 71, 255)',
            pointBackgroundColor: 'rgb(34, 23, 255)',
            borderWidth: 2,
            pointBorderColor: 'rgb(34, 45, 255)',
            backgroundColor: 'rgb(24, 60, 225)',
            data: []
          })

          for (let i = 0; i < data.length; i++) {
            const point = data[i]

            let cleanTime = point['0. date']

            self.chartData.labels.push(cleanTime)
            if (this.timeInterval === 'Hourly') {
              self.chartData.datasets[0].data.push(Math.round(Number(point['4. close'])))
            } else {
              self.chartData.datasets[0].data.push(Math.round(Number(point['5. adjusted close'])))
            }
          }

          self.ready = true
        }
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
    background: #ffffff;
  }

  .chart-loading-container {
    width: 100vw;
    height: 60vh;
    background: #ffffff;
  }
}

@media not screen and (max-width: 500px) and (max-height: 820px) {
  .container {
    width: 50vw;
  }

  .chart-err-container {
    width: 50vw;
    height: 400px;
    background: #ffffff;
  }

  .chart-loading-container {
    width: 50vw;
    height: 400px;
    background: #ffffff;
  }
}

.container {
  display: inline-block;
  background: #ffffff;
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

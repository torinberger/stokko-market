<template>
  <div class="portfolio-chart">
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
  name: 'portfolioChart',
  components: {
    LineChart
  },
  props: ['user', 'timeInterval'],
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

    console.log(`User id for history`, this.user)

    axios
      .get(`http://localhost:3000/api/users/get/user/transactions/${this.user}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + self.$store.state.JWTtoken
        }
      })
      .then((response) => {
        if (response.data.type === 'err') {
          self.$q.notify({ message: 'Error getting stock data!', color: 'red' })
        } else {
          console.log('Received user history')
          let data = response.data
          console.log(data)

          self.chartData.datasets.push({
            label: 'User Net Worth',
            borderColor: 'rgb(13, 71, 161)',
            pointBackgroundColor: 'rgb(179, 229, 252)',
            borderWidth: 2,
            pointBorderColor: 'rgb(179, 229, 252)',
            backgroundColor: 'rgb(68, 138, 255)',
            data: []
          })

          self.chartData.datasets.push({
            label: 'User Balance',
            borderColor: 'rgb(13, 71, 161)',
            pointBackgroundColor: 'rgb(179, 229, 252)',
            borderWidth: 2,
            pointBorderColor: 'rgb(179, 229, 252)',
            backgroundColor: 'rgb(222, 222, 222)',
            data: []
          })

          let userBal = 100

          let holdings = []

          self.chartData.labels.push('Starting Balance')

          self.chartData.datasets[0].data.push(Math.round(Number(userBal)))
          self.chartData.datasets[1].data.push(Math.round(Number(userBal)))

          for (let i = 0; i < data.length; i++) {
            const point = data[i]
            console.log(point)

            if (point.type === 'buy') {
              let found = false
              for (let n = 0; n < holdings.length; n++) {
                if (holdings[n].id === point.stock) {
                  holdings[n].amount += point.amount
                  holdings[n].price = point.price
                  found = true
                }
              }
              if (!found) {
                holdings.push({
                  id: point.stock,
                  amount: point.amount,
                  price: point.price
                })
              }
            } else if (point.type === 'sell') {
              for (let n = 0; n < holdings.length; n++) {
                if (holdings[n].id === point.stock) {
                  holdings[n].amount -= point.amount
                  holdings[n].price = point.price
                }
              }
            }

            console.log(holdings)

            userBal = userBal + (point.type === 'buy' ? -(point.price * point.amount) : (point.price * point.amount))

            let assetBal = 0

            for (let n = 0; n < holdings.length; n++) {
              assetBal += (holdings[n].amount * holdings[n].price)
            }

            let value = userBal + assetBal

            let cleanTime =
              new Date(Number(point.date)).getFullYear() + '-' +
              (new Date(Number(point.date)).getMonth() + 1) + '-' +
              new Date(Number(point.date)).getDate()

            self.chartData.labels.push(cleanTime)

            self.chartData.datasets[0].data.push(Math.round(Number(value)))
            self.chartData.datasets[1].data.push(Math.round(Number(userBal)))
          }

          self.ready = true
        }
      })
      .catch((err) => {
        console.log('Error in getting user history', err)
        this.errorMsg = 'Couldn\'t Find User'
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

  .portfolio-chart {
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

.portfolio-chart {
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

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
      chartData: { // labels and actual data points to be on chart
        labels: [],
        datasets: []
      },
      ready: false,
      errorMsg: '' // message to be displayed on error
    }
  },
  mounted () {
    let self = this

    console.log(`User id for portfolio`, this.user)

    axios // get user transactions
      .get(`http://localhost:3000/api/users/get/user/transactions/${this.user}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + self.$store.state.JWTtoken // give auth token
        }
      })
      .then((response) => {
        if (response.data.type === 'err') { // check for error
          self.$q.notify({ message: 'Error getting stock data!', color: 'red' })
        } else { // if no error
          console.log('Received user\'s transactions')
          let data = response.data

          // add two lines with seperate data
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
            borderColor: 'rgb(56, 71, 255)',
            pointBackgroundColor: 'rgb(34, 23, 255)',
            borderWidth: 2,
            pointBorderColor: 'rgb(34, 45, 255)',
            backgroundColor: 'rgb(24, 60, 225)',
            data: []
          })

          // track user balance
          let userBal = 100
          let holdings = []

          // show starting balance/value
          self.chartData.labels.push('Starting Balance')

          self.chartData.datasets[0].data.push(Math.round(Number(userBal)))
          self.chartData.datasets[1].data.push(Math.round(Number(userBal)))

          // go through each transaction
          for (let i = 0; i < data.length; i++) {
            const point = data[i]

            if (point.type === 'buy') { // if buy transaction
              let found = false
              for (let n = 0; n < holdings.length; n++) { // check if holding for stock exists
                if (holdings[n].id === point.stock) { // add amount and update price if exists
                  holdings[n].amount += point.amount
                  holdings[n].price = point.price
                  found = true
                }
              }
              if (!found) { // if doesn't exist create it
                holdings.push({
                  id: point.stock,
                  amount: point.amount,
                  price: point.price
                })
              }
            } else if (point.type === 'sell') { // if sell transaction
              for (let n = 0; n < holdings.length; n++) {
                if (holdings[n].id === point.stock) { // reduce amount and update price
                  holdings[n].amount -= point.amount
                  holdings[n].price = point.price
                }
              }
            }

            // user formula to update user's balance based on transaction
            userBal = userBal + (point.type === 'buy' ? -(point.price * point.amount) : (point.price * point.amount))

            // determine user's asset values
            let assetBal = 0
            for (let n = 0; n < holdings.length; n++) {
              assetBal += (holdings[n].amount * holdings[n].price) // go through each holding and add its value
            }

            let value = userBal + assetBal // formula for total net worth

            let cleanTime =
              new Date(Number(point.date)).getFullYear() + '-' +
              (new Date(Number(point.date)).getMonth() + 1) + '-' +
              new Date(Number(point.date)).getDate() // determine the neat date of the transaction

            // display net worth and user balance along with their times on the chart
            self.chartData.labels.push(cleanTime)

            self.chartData.datasets[0].data.push(Math.round(Number(value)))
            self.chartData.datasets[1].data.push(Math.round(Number(userBal)))
          }

          // ready the chart
          self.ready = true
        }
      })
      .catch((err) => {
        // if there was an error getting stock data
        console.log('Error in getting user history', err)
        this.errorMsg = 'Couldn\'t Find User' // set err msg
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

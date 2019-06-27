import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data () {
    return {
      gradients: []
    }
  },
  props: ['chartData'], // chart data to display
  mounted () {
    const { chartData } = this

    for (let i = 0; i < chartData.datasets.length; i++) {
      const color = chartData.datasets[i].backgroundColor.slice(0, -1)

      // simple gradient formula for looks
      this.gradients[i] = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
      this.gradients[i].addColorStop(0, `${color}, 0.5)`)
      this.gradients[i].addColorStop(0.5, `${color}, 0.25)`)
      this.gradients[i].addColorStop(1, `${color}, 0.0)`)

      chartData.datasets[i].backgroundColor = this.gradients[i]
    }

    // render chart
    this.renderChart(this.chartData, { responsive: true, maintainAspectRatio: false })
  }
}

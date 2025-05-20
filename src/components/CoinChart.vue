<script setup>
import '@/assets/css/utils/chart.scss'

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  coinData: {
    type: Array,
    required: true
  }
})

const chartData = {
  labels: props.coinData.map(coin => coin.symbol.toUpperCase()),
  datasets: [
    {
      label: 'Price (USD)',
      data: props.coinData.map(coin => coin.current_price),
      backgroundColor: props.coinData.map(coin =>
        coin.price_change_percentage_24h > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
      ),
      borderColor: props.coinData.map(coin =>
        coin.price_change_percentage_24h > 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)'
      ),
      borderWidth: 1
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.1)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: true
    },
    title: {
      display: true,
      text: 'Cryptocurrency Prices'
    }
  }
}
</script>

<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" height="300" />
  </div>
</template>

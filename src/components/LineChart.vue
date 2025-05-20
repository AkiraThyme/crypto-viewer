<script setup>
import '@/assets/css/utils/chart.scss'
import { Line } from 'vue-chartjs'
import { ref, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  coin: {
    type: Object,
    required: true
  },
  historicalData: {
    type: Array,
    required: true
  }
})

const chartData = ref({
  labels: [],
  datasets: [{
    label: `${props.coin.symbol.toUpperCase()} Price`,
    data: [],
    borderColor: props.coin.price_change_percentage_24h > 0 ? '#00ff00' : '#ff0000',
    backgroundColor: props.coin.price_change_percentage_24h > 0
      ? 'rgba(0, 255, 0, 0.1)'
      : 'rgba(255, 0, 0, 0.1)',
    fill: true,
    tension: 0.4
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        color: '#888',
        callback: (value) => `$${value.toLocaleString()}`
      },
      grid: { color: 'rgba(200, 200, 200, 0.1)' }
    },
    x: {
      ticks: { display: false },
      grid: { display: false }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}

const updateChartData = (historicalData) => {
  if (!historicalData || historicalData.length === 0) return

  chartData.value = {
    labels: historicalData.map(item =>
      new Date(item[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [{
      ...chartData.value.datasets[0],
      data: historicalData.map(item => item[1])
    }]
  }
}

// Update chart when prop changes
watch(
  () => props.historicalData,
  (newData) => {
    updateChartData(newData)
  },
  { immediate: true }
)
</script>

<template>
  <div class="chart-wrapper">
    <Line :data="chartData" :options="chartOptions" height="150" />
  </div>
</template>

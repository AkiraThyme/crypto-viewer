<script setup>
import '@/assets/css/_marketlist.scss'
import { onMounted, computed, watch } from 'vue'
import { useMarketStore } from '@/stores/market'
import LineChart from '@/components/LineChart.vue'

const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  }
})

const store = useMarketStore()

const topCoins = computed(() => store.getCoins.slice(0, 10))

const searchedCoin = computed(() => {
  if (!props.searchTerm) return null
  return store.getCoins.find(coin =>
    coin.name.toLowerCase() === props.searchTerm.toLowerCase() ||
    coin.symbol.toLowerCase() === props.searchTerm.toLowerCase()
  )
})

// Fetch historical data for searched coin if searching
watch(
  () => props.searchTerm,
  async (newTerm) => {
    if (newTerm && searchedCoin.value) {
      await store.fetchHistoricalData(searchedCoin.value.id)
    }
  }
)

onMounted(() => {
  store.startInterval()
})
</script>

<template>
  <div class="market-container">
    <div v-if="store.isLoading" class="loading">
      <div class="loader"></div>
      <p>Loading market data...</p>
    </div>
    <div v-else-if="store.error" class="error">
      {{ store.error }}
    </div>
    <div v-else class="market-content">
      <div class="market-list">
        <div class="list-header">
          <h2>All Cryptocurrencies</h2>
        </div>

        <div v-if="props.searchTerm && searchedCoin">
          <div class="coin-grid">
            <div class="coin-card">
              <div class="coin-header">
                <img :src="searchedCoin.image" :alt="searchedCoin.name" class="coin-image" />
                <div class="coin-info">
                  <h3 class="coin-name">{{ searchedCoin.name }}</h3>
                  <span class="coin-symbol">{{ searchedCoin.symbol.toUpperCase() }}</span>
                </div>
                <div class="price-badge"
                  :class="searchedCoin.price_change_percentage_24h > 0 ? 'positive' : 'negative'">
                  {{ searchedCoin.price_change_percentage_24h.toFixed(2) }}%
                </div>
              </div>
              <div class="coin-details">
                <div class="price-info">
                  <span class="current-price">${{ searchedCoin.current_price.toLocaleString() }}</span>
                </div>
                <div class="market-stats">
                  <div class="stat">
                    <span class="label">Market Cap</span>
                    <span class="value">${{ (searchedCoin.market_cap / 1e9).toFixed(2) }}B</span>
                  </div>
                  <div class="stat">
                    <span class="label">Volume (24h)</span>
                    <span class="value">${{ (searchedCoin.total_volume / 1e6).toFixed(2) }}M</span>
                  </div>
                </div>
              </div>
              <div class="coin-chart">
                <LineChart :coin="searchedCoin" :historicalData="store.getHistoricalData(searchedCoin.id)" />
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="coin-grid">
            <div v-for="coin in topCoins" :key="coin.id" class="coin-card" :class="{
              'positive-change': coin.price_change_percentage_24h > 0,
              'negative-change': coin.price_change_percentage_24h < 0
            }">
              <div class="coin-header">
                <img :src="coin.image" :alt="coin.name" class="coin-image" />
                <div class="coin-info">
                  <h3 class="coin-name">{{ coin.name }}</h3>
                  <span class="coin-symbol">{{ coin.symbol.toUpperCase() }}</span>
                </div>
                <div class="price-badge" :class="coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'">
                  {{ coin.price_change_percentage_24h.toFixed(2) }}%
                </div>
              </div>
              <div class="coin-details">
                <div class="price-info">
                  <span class="current-price">${{ coin.current_price.toLocaleString() }}</span>
                </div>
                <div class="market-stats">
                  <div class="stat">
                    <span class="label">Market Cap</span>
                    <span class="value">${{ (coin.market_cap / 1e9).toFixed(2) }}B</span>
                  </div>
                  <div class="stat">
                    <span class="label">Volume (24h)</span>
                    <span class="value">${{ (coin.total_volume / 1e6).toFixed(2) }}M</span>
                  </div>
                </div>
              </div>
              <div class="coin-chart">
                <LineChart :coin="coin" :historicalData="store.getHistoricalData(coin.id)" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

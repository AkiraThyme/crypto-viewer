import { defineStore } from 'pinia'
import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_COINGECKO_API_URL,
  headers: {
    [import.meta.env.VITE_COINGECKO_API_KEY_HEADER]: import.meta.env.VITE_COINGECKO_API_KEY
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 429) {
      // Rate limit exceeded
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(api(error.config))
        }, 60000) // Wait 1 minute before retrying
      })
    }
    return Promise.reject(error)
  }
)

export const useMarketStore = defineStore('market', {
  state: () => ({
    coins: [],
    loading: false,
    error: null,
    historicalData: {},
  }),

  actions: {
    async fetchCoins() {
      try {
        this.loading = true
        const response = await api.get('/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          }
        })
        this.coins = response.data
        this.error = null
      } catch (error) {
        this.error = error.response?.data?.error || error.message
        console.error('Error fetching coins:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchHistoricalData(coinId) {
      try {
        const response = await api.get(`/coins/${coinId}/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: '1',
          }
        })
        this.historicalData[coinId] = response.data.prices
        this.error = null
      } catch (error) {
        this.error = error.response?.data?.error || error.message
        console.error('Error fetching historical data:', error)
      }
    },

    startInterval() {
      this.stopInterval()
      this.fetchCoins().then(() => {
        // Only fetch historical data for top 10 coins
        this.coins.slice(0, 10).forEach((coin, index) => {
          setTimeout(() => {
            this.fetchHistoricalData(coin.id)
          }, index * 2000) // 2 seconds between requests (max 30/min)
        })
      })

      this.intervalId = setInterval(() => {
        this.fetchCoins().then(() => {
          this.coins.slice(0, 10).forEach((coin, index) => {
            setTimeout(() => {
              this.fetchHistoricalData(coin.id)
            }, index * 2000)
          })
        })
      }, 5 * 60000) // every 5 minutes
    },

    stopInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    }
  },

  getters: {
    getCoins: (state) => state.coins,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getHistoricalData: (state) => (coinId) => state.historicalData[coinId] || []
  },
})

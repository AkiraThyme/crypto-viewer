<script setup>
import '@/assets/css/_markethome.scss'
import MarketList from '@/components/MarketList.vue'
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
  <div class="market-home">
    <div class="market-header">
      <h1>Cryptocurrency Market</h1>
      <p class="market-description">Track real-time cryptocurrency prices and market statistics</p>
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Search cryptocurrencies..." class="search-input" />
      </div>
    </div>
    <MarketList :search-term="searchQuery" />
  </div>
</template>

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'market',
      component: () => import('@/views/market/MarketHome.vue'),
      meta: {
        title: 'Global Market Overview',
      },
    },
  ],
})

export default router

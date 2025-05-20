import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { routes } from '@/router/index.js'
import { useMarketStore } from '@/stores/market.js'

export async function render(url, manifest) {
  const app = createSSRApp(App)
  const pinia = createPinia()
  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  app.use(pinia)
  app.use(router)

  const store = useMarketStore()
  await store.fetchCoins()

  await router.push(url)
  await router.isReady()

  const ctx = {}
  const html = await renderToString(app, ctx)

  const state = JSON.stringify(pinia.state.value)

  return { html, state }
}

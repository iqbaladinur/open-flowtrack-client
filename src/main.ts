import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import router from './router'
import './style.css'
import './assets/nprogress.css'
import App from './App.vue'
import { useThemeStore } from './stores/theme'
import i18n from './i18n'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize theme
const themeStore = useThemeStore()
themeStore.init()

app.mount('#app')

registerSW({ immediate: true })

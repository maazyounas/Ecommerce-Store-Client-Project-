import './assets/main.css'
import router from './router/routing.js'
import { createApp } from 'vue'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  theme: 'light',
  position: 'top-right'
})

app.mount('#app')

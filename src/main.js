// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import ElementPlus from 'element-plus'

import App from './MyTest2.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')

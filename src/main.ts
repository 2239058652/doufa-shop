import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// import 'default-passive-events'


import Antd from 'ant-design-vue'

import App from './App.vue'

import 'ant-design-vue/dist/reset.css'
import './permission'

import router from './router'
//引入模板的全局的样式
import '@/styles/index.scss'



const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.use(Antd).mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import './permission'

import router from './router'
//引入模板的全局的样式
import '@/styles/index.scss'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')

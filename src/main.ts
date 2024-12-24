import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue'

import App from './App.vue'

import 'ant-design-vue/dist/reset.css'
import './permission'

import router from './router'
//引入模板的全局的样式
import '@/styles/index.scss'



const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Antd).mount('#app')

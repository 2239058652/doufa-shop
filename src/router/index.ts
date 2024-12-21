import { createRouter, createWebHistory } from 'vue-router'
import TopLayoutBar from '../layout/TopBar/TopBar.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TopLayoutBar,
      meta: {
        title: '首页'
      }
    }
  ]
})

export default router

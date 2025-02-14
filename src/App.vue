<template>
  <a-config-provider :locale="locale">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" v-if="getFirstLevelRoute(route).meta.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!getFirstLevelRoute(route).meta.keepAlive" />
    </router-view>
  </a-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onErrorCaptured, ref } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 修改全局颜色留的方法
// const initColor = () => {
//   // 从 localStorage 获取保存的颜色，如果没有则使用默认色值
//   const savedColor = localStorage.getItem('theme-color') || '#F83126'
//   document.documentElement.style.setProperty('--red-color', savedColor)
// }

// 设置 dayjs 的语言为中文
dayjs.locale('zh-cn')

const locale = zhCN

// 错误处理
onErrorCaptured((error, instance, info) => {
  console.error('App Error:', error, instance, info)
  // 这里可以添加错误上报逻辑
  return false // 阻止错误继续传播
})

// 处理二级路由加载俩次问题，1级就返回第1个就不加载俩次
function getFirstLevelRoute(route: { matched: string | any[] }) {
  if (!Array.isArray(route.matched) || route.matched.length === 0) {
    return route
  }
  return route.matched[0]
}
</script>

<style scoped>
/* #app {
  height: 100vh;
} */
</style>

<style lang="scss">
// 移除 scoped，因为这些是全局样式
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  // 防止页面溢出
  overflow-x: hidden;
}
</style>

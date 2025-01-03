<script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const locale = zhCN

</script>

<template>
  <!-- 全局中文 -->
  <a-config-provider :locale="locale">
    <RouterView v-slot="{ Component }">
      <!-- 路由缓存 -->
      <keep-alive v-if="$route.meta.keepAlive">
        <component :is="Component" />
      </keep-alive>
      <component v-else :is="Component" />
    </RouterView>
  </a-config-provider>
</template>

<style scoped>
#app {
  height: 100vh;
}
</style>

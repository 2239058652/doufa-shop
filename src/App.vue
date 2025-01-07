<!-- <script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const locale = zhCN

</script>

<template>
  <a-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" />
    </router-view>
  </a-config-provider>
</template>

<style scoped>
#app {
  height: 100vh;
}
</style> -->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { computed, onErrorCaptured } from 'vue'
import { useRoute } from 'vue-router'

const locale = zhCN
const route = useRoute()

// 错误处理
onErrorCaptured((error, instance, info) => {
  console.error('App Error:', error, instance, info)
  // 这里可以添加错误上报逻辑
  return false // 阻止错误继续传播
})

// 使用computed优化性能
const isKeepAlive = computed(() => route.meta.keepAlive)
</script>

<template>
  <ConfigProvider :locale="locale">
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <keep-alive v-if="isKeepAlive">
          <component :is="Component" />
        </keep-alive>
        <component :is="Component" v-else />
      </template>
    </router-view>
  </ConfigProvider>
</template>

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

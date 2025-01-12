<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import TopLayoutBar from '@/layout/TopBar/TopBar.vue'
import SiderMenuBar from '@/layout/SideMenu/SideMenu.vue'

export default {
  name: 'App',
  computed: {
    layout() {
      return this.$route.meta.requireSidebar ? SiderMenuBar : TopLayoutBar
    }
  }
}
</script>

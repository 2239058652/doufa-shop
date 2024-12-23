<template>
  <div style="font-size: 30px; font-weight: 900; color: brown; line-height: 30px">
    <div> 顶部 </div>
    <!-- 底部开发者信息 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '@/components/footer/index.vue'
import { px } from '@/utils/util'
</script>

<style scoped lang="scss">
@import '@/utils/helpers.sass';
* {
  margin: px(0);
  padding: 0;
}
</style>

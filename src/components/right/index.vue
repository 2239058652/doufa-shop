<template>
  <div class="fixed">
    <div class="fixed_item">
      <img src="../../assets/image/logo.png" />
      <span>我的收藏</span>
    </div>
    <div class="fixed_item">
      <img src="../../assets/image/logo.png" />
      <span>购物车</span>
    </div>
    <div class="fixed_item">
      <img src="../../assets/image/logo.png" />
      <span>站内信</span>
    </div>
    <a-popover placement="left" :width="230" trigger="hover">
      <img src="../../assets/image/logo.png" style="width: 200px; height: 200px" />
      <template #reference>
        <div class="fixed_item">
          <img src="../../assets/image/logo.png" />
          <span>联系我们</span>
        </div>
      </template>
    </a-popover>
    <div class="fixed_item">
      <img src="../../assets/image/logo.png" />
      <span>投诉反馈</span>
    </div>
    <div class="fixed_item" @click="goTop">
      <img src="../../assets/image/logo.png" />
      <span>返回顶部</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 固定栏返回顶部按钮
const goTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style src="./index.scss" scoped></style>

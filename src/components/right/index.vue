<template>
  <div class="right-menu">
    <div class="r-menu-item">
      <img src="../../assets/image/fixed_live.png" />
      <span>我的收藏</span>
    </div>
    <div class="r-menu-item">
      <img src="../../assets/image/fixed_shopcar.png" />
      <span>购物车</span>
    </div>
    <div class="r-menu-item">
      <img src="../../assets/image/fixed_email.png" />
      <span>站内信</span>
    </div>
    <a-popover placement="left">
      <template #content>
        <img src="../../assets/image/kefu_erweima.png" style="width: 200px; height: 200px" />
      </template>
      <div class="r-menu-item">
        <img src="../../assets/image/fixed_waiter.png" />
        <span>联系我们</span>
      </div>
    </a-popover>
    <div class="r-menu-item">
      <img src="../../assets/image/fixed_feedback.png" />
      <span>投诉反馈</span>
    </div>
    <div class="r-menu-item" @click="goTop">
      <img src="../../assets/image/fixed_toTop.png" />
      <span>返回顶部</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 固定栏返回顶部按钮
const goTop = () => {
  // 因为设置了高度，所以回到顶部会失效，要获取到router-view的dom元素，然后调用scrollTo方法
  const appElement = document.querySelector('.router-view')
  if (appElement) {
    appElement.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    })
  }
}
</script>

<style src="./index.scss" scoped></style>

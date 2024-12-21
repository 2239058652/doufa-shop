<template>
  <div class="top-bar">
    <a-affix :offset-top="0">
      <div class="menu-bar">
        <!-- 登录后 -->
        <div class="menu-content">
          <div class="menu-title">
            <span>{{ 'hi 你好！' }}</span>
          </div>
          <div class="menu-items">
            <span class="menu-item" @click="$router.push('/home')">首页</span>
            <span class="hr">|</span>
            <a-popover trigger="hover" placement="bottom">
              <span class="menu-item">
                个人中心
                <img src="../../assets/image/head-bot.png" />
              </span>
              <template #content>
                <div class="con" style="display: flex; justify-content: space-around; font-size: 14px; color: #333">
                  <div class="order_ctrl" style="display: flex; flex-direction: column; margin: 0 30px">
                    <span class="active" style="margin-top: 16px" @click="$router.push('/userManage')"> 用户中心 </span>
                    <span class="active" style="margin-top: 22px"> 订单管理 </span>
                    <span class="active" style="margin-top: 22px"> 下单管理 </span>
                  </div>
                </div>
              </template>
            </a-popover>
            <span class="hr">|</span>
            <span class="menu-item" @click="$router.push(`/`)">消息通知</span>
            <span class="hr">|</span>
            <span class="menu-item" @click="$router.push(`/`)">退货地址</span>
            <span class="hr">|</span>
            <span class="menu-item" @click="open = true">退出</span>
          </div>
        </div>
      </div>
    </a-affix>
    <a-modal v-model:open="open">
      <template #title>
        <div class="title">
          <img src="../../assets/image/remind.png" />
          <div>退出登录</div>
        </div>
      </template>
      <p class="text">确定要退出系统吗？</p>
      <template #footer>
        <a-button key="back" @click="open = false">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="loginOut">退出</a-button>
      </template>
    </a-modal>
  </div>
  <router-view v-if="showSidebar"></router-view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from "vue-router";

const open = ref<boolean>(false)
const loading = ref<boolean>(false);

const router = useRouter();
// 获取当前路由
const route = useRoute();

console.log(router);

// 计算属性判断是否需要左侧菜单
const showSidebar = computed(() => {
  return route.meta.requireSidebar == false;
})

// 退出登录
const loginOut = () => {
  loading.value = true;
  localStorage.clear();
  router.push("/home");
  loading.value = false;
  open.value = false;
}
</script>

<style src="./TopBar.scss" scoped></style>
<style scoped>
.title {
  width: 93px;
  height: 21px;
  color: #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    width: 18px;
    height: 18px;
  }
}

.text {
  margin-top: 22px;
  margin-left: 61px;
  color: #333;
  font-size: 18px;
}
</style>

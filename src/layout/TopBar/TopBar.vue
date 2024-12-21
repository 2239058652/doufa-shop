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
                <div class="con" style="display: flex; justify-content: space-around; font-size: 14px; color:#333;">
                  <div class="order_ctrl" style="display: flex; flex-direction: column; margin:0 49px;">
                    <span class="active" style="margin-top:16px;">
                      用户中心
                    </span>
                    <span class="active" style="margin-top: 22px;">
                      订单管理
                    </span>
                    <span class="active" style="margin-top: 22px;">
                      下单管理
                    </span>
                  </div>
                </div>
              </template>
            </a-popover>
            <span class="hr">|</span>
            <span class="menu-item" @click="$router.push(`/`)">消息通知</span>
            <span class="hr">|</span>
            <span class="menu-item" @click="$router.push(`/`)">退货地址</span>
            <span class="hr">|</span>
            <span class="menu-item" @click="loginOut">退出</span>
          </div>
        </div>
      </div>
    </a-affix>
  </div>
  <router-view></router-view>
</template>

<script lang="ts" setup>

// 退出登录
const loginOut = () => {

}

</script>

<style src="./TopBar.scss" scoped></style>

<template>
  <div class="layout">
    <div class="top-bar">
      <a-affix :offset-top="0">
        <div class="menu-bar">
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
                  <div
                    class="con"
                    style="
                      display: flex;
                      justify-content: space-around;
                      font-size: 14px;
                      color: #333;
                    "
                  >
                    <div
                      class="order_ctrl"
                      style="display: flex; flex-direction: column; margin: 0 30px"
                    >
                      <span
                        class="active"
                        style="margin-top: 16px"
                        @click="handleClick('/usermanage')"
                      >
                        用户中心
                      </span>
                      <span
                        class="active"
                        style="margin-top: 22px"
                        @click="handleClick('/ordermanage')"
                      >
                        订单管理
                      </span>
                      <span
                        class="active"
                        style="margin-top: 22px"
                        @click="handleClick('/shopsmanage')"
                      >
                        下单管理
                      </span>
                    </div>
                  </div>
                </template>
              </a-popover>
              <span class="hr">|</span>
              <span class="menu-item" @click="$router.push(`/`)">消息通知</span>
              <span class="hr">|</span>
              <span class="menu-item" @click="getAddressList">退货地址</span>
              <span class="hr">|</span>
              <span class="menu-item" @click="open = true" v-if="token">退出</span>
              <span class="menu-item" @click="handleLogin" v-if="!token">登录</span>
              <span class="hr" v-if="!token">|</span>
              <span class="menu-item" @click="handleRegister" v-if="!token">注册</span>
            </div>
          </div>
        </div>
      </a-affix>

      <!-- 退出系统 -->
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

      <!-- 退货地址 -->
      <a-modal v-model:open="addressOpen" title="退货地址">
        <div class="return_address">
          <div v-for="(item, index) in addressList" :key="index" class="dialog_wrap">
            <div class="dialog_title_wrap">{{ item.address_name }}仓-{{ item.real_name }}</div>
            <div class="dialog_span_wrap">
              <div>姓名：{{ item.real_name }}</div>
              <div>手机号：{{ item.phone }}</div>
              <div
                >地址：{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</div
              >
            </div>
          </div>
        </div>
        <template #footer>
          <a-button type="primary" @click="addressOpen = false">确认</a-button>
        </template>
      </a-modal>
      <!-- 登录modal -->
      <LoginModal ref="loginModalRef" />
      <!-- 注册modal -->
      <RegisterModal ref="registerModalRef" />
    </div>
    <div class="router-view">
      <router-view v-if="showSidebar" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { returnAddressList } from '@/api/store'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'

const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const addressOpen = ref<boolean>(false)
const addressList = ref<any>([])
const token = localStorage.getItem('token')
const loginModalRef = ref()
const registerModalRef = ref()

const router = useRouter()
// 获取当前路由
const route = useRoute()

// 计算属性判断是否需要左侧菜单
const showSidebar = computed(() => {
  return route.meta.requireSidebar == false
})

const handleClick = (path: string) => {
  // 只有在用户登录时才允许访问(个人中心)
  if (token) {
    router.push(path)
  } else {
    message.error('您还未登录，请先登录再访问个人中心！')
  }
}
// 登录
const handleLogin = () => {
  loginModalRef.value.setModalInit(true)
}
// 注册
const handleRegister = () => {
  registerModalRef.value.setRegisModalInit(true)
}
// 退出登录
const loginOut = () => {
  loading.value = true
  localStorage.clear()
  setTimeout(() => {
    loading.value = false
    open.value = false
    router.push('/home')
    location.reload()
  }, 500)
}
// 退货地址
const getAddressList = async () => {
  const res = await returnAddressList({
    page: 0,
    limit: 10
  })
  console.log(res)
  if (res.status == 200) {
    addressList.value = res.data.data
    addressOpen.value = true
  } else {
    message.error(res.msg)
  }
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

.return_address {
  width: 1636px;
  height: auto;
  display: flex;
  flex-direction: column;
  background: #fff;

  .dialog_wrap {
    width: 100%;

    .dialog_title_wrap {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .dialog_span_wrap {
      font-size: 20px;
      font-weight: 400;
      margin-bottom: 20px;
    }
  }
}
</style>

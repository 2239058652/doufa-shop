<template>
  <div>
    <context-holder />
    <div class="layout">
      <div class="top-bar">
        <a-affix :offset-top="0">
          <div class="menu-bar">
            <div class="menu-content">
              <div class="menu-title">
                <span @click="$router.push('/usermanage/userinfo')"
                  >hi, {{ userInfo ? userInfo.nickname : ' 你好！' }}</span
                >
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
                    <div class="con">
                      <div class="order_ctrl" style="display: flex; flex-direction: column; margin: 0 20px">
                        <span class="active" style="margin-top: 2px" @click="router.push('/usermanage')">
                          用户中心
                        </span>
                        <span class="active" style="margin-top: 16px" @click="router.push('/ordermanage')">
                          订单管理
                        </span>
                        <span class="active" style="margin-top: 16px" @click="router.push('/shopsmanage')">
                          下单管理
                        </span>
                      </div>
                    </div>
                  </template>
                </a-popover>
                <span class="hr">|</span>
                <span class="menu-item" @click="() => messageApi.warning('暂未开放')">消息通知</span>
                <span class="hr">|</span>
                <span class="menu-item" @click="getAddressList">退货地址</span>
                <span class="hr">|</span>
                <span class="menu-item" @click="open = true" v-if="token">退出</span>
                <span class="menu-item" @click="handleLogin" v-if="!token">登录</span>
                <span class="hr" v-if="!token">|</span>
                <span class="menu-item" @click="handleRegister('zhuce')" v-if="!token">注册</span>
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
        <a-modal v-model:open="addressOpen" title="退货地址" width="55%">
          <div class="return_address">
            <div v-for="(item, index) in addressList" :key="index" class="dialog_wrap">
              <div class="dialog_title_wrap">{{ item.address_name }}仓-{{ item.real_name }}</div>
              <div class="dialog_span_wrap">
                <div>姓名：{{ item.real_name }}</div>
                <div>手机号：{{ item.phone }}</div>
                <div>地址：{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</div>
              </div>
            </div>
          </div>
          <template #footer>
            <a-button type="primary" @click="addressOpen = false">确认</a-button>
          </template>
        </a-modal>
        <!-- 登录modal -->
        <LoginModal ref="loginModalRef" @hanldeToRegis="handleRegister" />
        <!-- 注册modal -->
        <RegisterModal ref="registerModalRef" />
      </div>
      <div class="router-view" id="router-view" v-if="showSidebar">
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" v-if="getFirstLevelRoute(route).meta.keepAlive" />
          </keep-alive>
          <component :is="Component" v-if="!getFirstLevelRoute(route).meta.keepAlive" />
        </router-view>
        <Footer v-if="showFooter" />

        <!-- 右侧悬浮功能区 -->
        <RightMenu />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { computed, ref, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { returnAddressList } from '@/api/store'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import RightMenu from '../../components/right/index.vue'
import Footer from '@/components/footer/index.vue'

const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const addressOpen = ref<boolean>(false)
const addressList = ref<any>([])
const loginModalRef = ref()
const registerModalRef = ref()

const token = localStorage.getItem('token')
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

const [messageApi, contextHolder] = message.useMessage()

const router = useRouter()
// 获取当前路由
const route = useRoute()

// 处理二级路由加载俩次问题，二级就返回第二个就不加载俩次
function getFirstLevelRoute(route: { matched: string | any[] }) {
  if (!Array.isArray(route.matched) || route.matched.length === 0) {
    return route
  }
  return route.matched[route.matched.length - 1]
}

// 计算属性判断是否需要左侧菜单
const showSidebar = computed(() => {
  return route.meta.requireSidebar == false
})

// 计算属性判断是否需要底部footer
const showFooter = computed(() => {
  return route.meta.requireFooter == false ? false : true
})

// 登录
const handleLogin = () => {
  loginModalRef.value.setModalInit(true)
}
// 注册
const handleRegister = (type: string) => {
  registerModalRef.value.setRegisModalInit(true, type)
}
// 退出登录
const loginOut = () => {
  messageApi.loading('正在退出登录...')
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
  const hide = messageApi.loading('正在获取退货地址...', 0)
  const res = await returnAddressList({
    page: 0,
    limit: 10
  })
  if (res.status == 200) {
    setTimeout(hide, 0)
    messageApi.success('退货地址获取成功！')
    addressList.value = res.data
    addressOpen.value = true
  } else {
    messageApi.error(res.msg)
  }
}

provide('loginOut', open)
provide('loginModalRef', loginModalRef)
provide('registerModalRef', registerModalRef)

defineExpose({
  handleRegister // 暴露出去的注册方法
})
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
  width: 100%;
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

<template>
  <div ref="createCreative" class="create-creative">
    <a-modal
      v-model:open="modalLoginVisible"
      centered
      :footer="null"
      :getContainer="() => createCreative"
      destroyOnClose
      :afterClose="handleLoginModalClose"
      style="width: 27%"
    >
      <div class="login-modal">
        <!-- 顶部登录和验证码登录切换部分 -->
        <div class="login-tabs">
          <div :class="activeKey == '1' ? 'tab-tane-active' : 'tab-tane'" @click="activeKey = '1'"> 登录 </div>
          <div :class="activeKey == '1' ? 'tab-tane-phone' : 'tab-tane-phone-active'" @click="activeKey = '2'">
            验证码登录
          </div>
        </div>
        <!-- 输入框部分 -->
        <div class="login-content">
          <a-form>
            <!-- 账号密码登录 -->
            <template v-if="activeKey == '1'">
              <a-input class="login-input" placeholder="手机号或用户名" v-model:value="inputData.account" />
              <a-input-password
                class="login-input-password"
                placeholder="密码"
                v-model:value="inputData.password"
                autocomplete="off"
              />
            </template>
            <!-- 手机验证码登录 -->
            <template v-else>
              <a-input class="login-input" placeholder="手机号" v-model:value="inputData.phone" ref="phoneInputRef" />
              <a-input class="login-input-password" placeholder="验证码" v-model:value="inputData.captcha">
                <template #suffix>
                  <div class="hqyzm" :class="{ disabled: !canClick }" @click="getYanzhengma">{{ yanzhengma }}</div>
                </template>
              </a-input>
            </template>
          </a-form>
          <div class="login-text">
            <span @click="handleToEditRegister">重置密码</span>
            <span @click="handleToRegister">注册</span>
          </div>
        </div>
        <!-- 登录按钮 -->
        <a-button key="submit" type="primary" :loading="loginLoading" @click="handleLogin(activeKey)" class="login-btn">
          <span>登录</span>
        </a-button>
        <!-- 微信图标部分 -->
        <div class="login-wechat">
          <img src="../../../assets/image/wechat.png" alt="" />
        </div>
        <!-- 下面协议说明部分 -->
        <div class="login-xieyi">
          <div class="xieyi-html"
            >注册登录即代表同意<span @click="viewXieYiModal(agreeMentList[0].data.content)"> 《抖发用户协议》 </span>
            <span @click="viewXieYiModal(agreeMentList[2].data.content)">《抖发隐私政策》</span>
            <span @click="viewXieYiModal(agreeMentList[1].data.content)">《抖发服务协议》</span>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal destroyOnClose :closable="false" v-model:open="modalXieYiVisible" :footer="null" width="1000px">
      <div class="xieyi-content" v-html="viewAgreeMent"></div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { sendVerify, agreeMents, doLogin, doLoginByPhone, getUserInfo } from '@/api/user'
import { message } from 'ant-design-vue'
import { debounce } from '@/utils/util' // 引入防抖函数

const activeKey = ref('1')
const modalLoginVisible = ref<boolean>(false)
const modalXieYiVisible = ref<boolean>(false)
const loginLoading = ref<boolean>(false)
const createCreative = ref()
const phoneInputRef = ref()
const agreeMentList = ref<any>([])
const viewAgreeMent = ref<any>({})
const yanzhengma = ref<string>('获取验证码')
const timer = ref<any>(null)
const canClick = ref(true)

const inputData = reactive<any>({
  account: '',
  password: '',
  phone: '',
  captcha: ''
})

const emits = defineEmits(['hanldeToRegis'])

const setModalInit = (open: boolean) => {
  // 获取协议list
  Promise.all([agreeMents({ type: 1 }), agreeMents({ type: 2 }), agreeMents({ type: 3 })]).then((res) => {
    agreeMentList.value = res
  })
  modalLoginVisible.value = open
}
// 登录
const handleLogin = debounce((key: string) => {
  switch (key) {
    case '1': // 账号密码登录
      if (inputData.account && inputData.password) {
        loginLoading.value = true
        doLogin({ account: inputData.account, password: inputData.password })
          .then((res: any) => {
            if (res.status === 200) {
              message.success('登录成功')
              setTimeout(() => {
                localStorage.setItem('token', res.data.token)
                loginLoading.value = false
                modalLoginVisible.value = false
                fetchUserInfo()
              }, 200)
            } else {
              message.error('请检查账号密码是否正确')
              loginLoading.value = false
            }
          })
          .catch(() => {
            loginLoading.value = false
          })
      } else {
        message.error('请输入账号密码')
      }
      break
    case '2': // 手机验证码登录
      console.log('手机验证码登录')
      if (inputData.phone && inputData.captcha) {
        loginLoading.value = true
        doLoginByPhone({ phone: inputData.phone, captcha: inputData.captcha })
          .then((res: any) => {
            if (res.status === 200) {
              message.success('登录成功')
              localStorage.setItem('token', res.data.token)
              loginLoading.value = false
              modalLoginVisible.value = false
              fetchUserInfo()
            } else if (res.msg == '请完成注册后再登录') {
              message.error('请完成注册后再登录')
              loginLoading.value = false
            } else {
              message.error('请检查手机号验证码是否正确')
              loginLoading.value = false
            }
          })
          .catch(() => {
            loginLoading.value = false
          })
      } else {
        message.error('请输入手机号和验证码')
      }
      break
  }
}, 200)

// 正则校验手机号
const phoneReg =
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
// 获取验证码
const getYanzhengma = () => {
  if (inputData.phone) {
    if (phoneReg.test(inputData.phone)) {
      if (timer.value) {
        clearInterval(timer.value)
      }
      if (!canClick.value) return
      canClick.value = false
      yanzhengma.value = '60s'
      let time = 60
      timer.value = setInterval(() => {
        time--
        yanzhengma.value = time + 's'
        if (time <= 0) {
          clearInterval(timer.value)
          timer.value = null
          yanzhengma.value = '重新获取'
          canClick.value = true
        }
      }, 1000)
      // 发送验证码
      sendVerify({ phone: inputData.phone, type: 'mobile' }).then((res: any) => {
        if (res.status === 200) {
          message.success('验证码发送成功,请查看手机')
        }
      })
    } else {
      phoneInputRef.value.focus()
      message.error('请输入正确的手机号')
      return
    }
  } else {
    phoneInputRef.value.focus()
    message.error('请先输入手机号')
    return
  }
}

// 注册
const handleToRegister = () => {
  emits('hanldeToRegis', 'zhuce')
}
// 重置密码
const handleToEditRegister = () => {
  emits('hanldeToRegis', 'chongzhi')
}
// 打开协议modal
const viewXieYiModal = (view: any) => {
  viewAgreeMent.value = view
  modalXieYiVisible.value = true
}

// 用户信息, 登录后获取
const fetchUserInfo = () => {
  getUserInfo().then((res: any) => {
    if (res.status == 200) {
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      location.reload()
      return
    }
    location.reload()
  })
}

watch(modalLoginVisible, (newVal) => {
  if (!newVal) {
    // modal关闭时清除定时器
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
    yanzhengma.value = '获取验证码'
    canClick.value = true
    activeKey.value = '1'
  }
})
// 关闭弹窗,清空inputdata
const handleLoginModalClose = () => {
  Object.keys(inputData).forEach((key) => {
    inputData[key] = ''
  })
}

defineExpose({ setModalInit })
</script>

<style scoped lang="scss">
.login-modal {
  width: 480px;
  height: 100%;
  max-height: 514px;
  display: flex;
  flex-direction: column;
}

.login-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 27px;
  height: auto;
}

.tab-tane {
  width: 36px;
  height: 25px;
  font-weight: 500;
  font-size: 18px;
  color: #666666;
  line-height: 25px;
  text-align: center;
  font-style: normal;
  cursor: pointer;
}

.tab-tane-active {
  width: 40px;
  height: 28px;
  font-weight: 600;
  font-size: 20px;
  color: #333333;
  line-height: 28px;
  text-align: center;
  font-style: normal;
  cursor: pointer;
  border-bottom: 2px solid #333333;
}

.tab-tane-phone {
  width: 90px;
  height: 25px;
  font-weight: 500;
  font-size: 18px;
  color: #666666;
  line-height: 25px;
  text-align: center;
  font-style: normal;
  margin-left: 40px;
  cursor: pointer;
}

.tab-tane-phone-active {
  width: 100px;
  height: 28px;
  font-weight: 600;
  font-size: 20px;
  color: #333333;
  line-height: 28px;
  text-align: center;
  font-style: normal;
  margin-left: 40px;
  cursor: pointer;
  border-bottom: 2px solid #333333;
}

.create-creative {
  :deep(.ant-modal-content) {
    border-radius: 24px;
  }
}

.login-content {
  width: 100%;
  height: 220px;

  .login-input {
    width: 378px;
    height: 46px;
    margin: 37px 51px 10px 51px;
  }

  .login-input-password {
    width: 378px;
    height: 46px;
    margin: 10px 51px 10px 51px;
    /* 修改这里：把296px改为10px */
  }

  .hqyzm {
    width: 70px;
    height: 20px;
    font-weight: 400;
    font-size: 14px;
    color: #f83126;
    line-height: 20px;
    text-align: right;
    font-style: normal;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .login-text {
    display: flex;
    justify-content: space-between;
    margin: 0 51px 10px 51px;
    height: 30px;

    span {
      width: 64px;
      height: 22px;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      line-height: 22px;
      text-align: left;
      font-style: normal;
      cursor: pointer;
    }
  }
}

.login-btn {
  width: 378px;
  height: 40px;
  border-radius: 8px;
  background: #f83126;
  margin: 0 51px 10px 51px;
  padding: 10px 175px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #fa6f67;
  }
}

.login-wechat {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 34px;
    height: 34px;
    cursor: pointer;
  }
}

.login-xieyi {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;

  .xieyi-html {
    width: 380px;
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    text-align: center;
    font-style: normal;

    span {
      cursor: pointer;

      &:hover {
        color: #666666;
      }
    }
  }
}

.xieyi-content {
  overflow-y: scroll;
  height: 711px;

  &::-webkit-scrollbar {
    width: 1px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 1px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
}
</style>

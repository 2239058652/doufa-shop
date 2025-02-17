<template>
  <div ref="createRegisCreative" class="create-creative">
    <a-modal
      v-model:open="modalRegisterVisible"
      centered
      :footer="null"
      :getContainer="() => createRegisCreative"
      destroyOnClose
      :afterClose="handleRegisModalClose"
      style="width: 27%"
    >
      <div class="login-modal">
        <!-- 顶部登录和验证码登录切换部分 -->
        <div class="login-tabs">
          <div class="tab-tane-active"> {{ modalTitle }} </div>
        </div>
        <!-- 输入框部分 -->
        <div class="login-content">
          <a-form
            style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 20px"
          >
            <a-input class="login-input" placeholder="手机号" v-model:value="inputData.account" ref="phoneInputRef" />
            <a-input class="login-input-password" placeholder="验证码" v-model:value="inputData.captcha">
              <!-- 获取验证码 -->
              <template #suffix>
                <div class="hqyzm" :class="{ disabled: !canClick }" @click="getYanzhengma">{{ yanzhengma }}</div>
              </template>
            </a-input>
            <a-input-password
              class="login-input-password"
              placeholder="密码"
              v-model:value="inputData.password"
              autocomplete="off"
            />
            <a-input-password
              class="login-input-password"
              placeholder="确认密码"
              v-model:value="inputData.repassword"
              autocomplete="off"
            />
          </a-form>
        </div>
        <!-- 注册 -->
        <a-button key="submit" type="primary" :loading="loginLoading" @click="handleRegister" class="login-btn">
          <span>{{ modalTitle }}</span>
        </a-button>
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
import { sendVerify, agreeMents, doRegister, resetRegister } from '@/api/user'
import { message } from 'ant-design-vue'

const modalRegisterVisible = ref<boolean>(false)
const modalXieYiVisible = ref<boolean>(false)
const loginLoading = ref<boolean>(false)
const createRegisCreative = ref()
const phoneInputRef = ref()
const agreeMentList = ref<any>([])
const viewAgreeMent = ref<any>({})
const yanzhengma = ref<string>('获取验证码')
const timer = ref<any>(null)
const canClick = ref(true)
const modalTitle = ref<string>('注册')

const token = localStorage.getItem('token') // token

const inputData = reactive<any>({
  account: '',
  password: '',
  repassword: '',
  captcha: ''
})

// 初始化
const setRegisModalInit = (open: boolean, type: string) => {
  modalTitle.value = type === 'zhuce' ? '注册' : '重置密码'

  // 获取协议list
  Promise.all([agreeMents({ type: 1 }), agreeMents({ type: 2 }), agreeMents({ type: 3 })]).then((res) => {
    agreeMentList.value = res
  })
  modalRegisterVisible.value = open
}
// 注册 或者 修改密码
const handleRegister = () => {
  console.log(modalTitle.value, 'typeeeeeeeeeeeee')
  if (inputData.account && inputData.password && inputData.captcha && inputData.repassword) {
    if (inputData.password !== inputData.repassword) {
      message.error('两次密码不一致')
      return
    }
    loginLoading.value = true
    if (modalTitle.value == '注册') {
      doRegister({
        account: inputData.account,
        password: inputData.password,
        captcha: inputData.captcha
      })
        .then((res: any) => {
          if (res.status === 200) {
            message.success('注册成功')
            loginLoading.value = false
            modalRegisterVisible.value = false
          } else {
            message.error(res.msg) //'请检查信息填写是否正确'
            loginLoading.value = false
          }
        })
        .catch(() => {
          loginLoading.value = false
        })
    } else {
      // 修改密码
      resetRegister({
        account: inputData.account,
        password: inputData.password,
        captcha: inputData.captcha
      })
        .then((res: any) => {
          if (res.status === 200) {
            message.success('修改密码成功')
            loginLoading.value = false
            modalRegisterVisible.value = false
            if (token) {
              localStorage.removeItem('token')
            }
          } else {
            message.error(res.msg) //'请检查信息填写是否正确'
            loginLoading.value = false
          }
        })
        .catch(() => {
          loginLoading.value = false
        })
    }
  } else {
    message.error('请填写完整信息')
  }
}

// 正则校验手机号
const phoneReg =
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[\d]))\d{8}$/
// 获取验证码
const getYanzhengma = () => {
  if (inputData.account) {
    if (phoneReg.test(inputData.account)) {
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
      if (modalTitle.value == '注册') {
        sendVerify({ phone: inputData.account, type: 'register' }).then((res: any) => {
          if (res.status === 200) {
            message.success('验证码发送成功,请查看手机')
          } else {
            message.error(res.msg)
          }
        })
      } else {
        // 修改密码发送验证码
        sendVerify({ phone: inputData.account, type: 'reset' }).then((res: any) => {
          if (res.status === 200) {
            message.success('验证码发送成功,请查看手机')
          } else {
            message.error(res.msg)
          }
        })
      }
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
// 打开协议modal
const viewXieYiModal = (view: any) => {
  viewAgreeMent.value = view
  modalXieYiVisible.value = true
}

watch(modalRegisterVisible, (newVal) => {
  if (!newVal) {
    // modal关闭时清除定时器
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
    yanzhengma.value = '获取验证码'
    canClick.value = true
  }
})
// 关闭弹窗,清空inputdata
const handleRegisModalClose = () => {
  Object.keys(inputData).forEach((key) => {
    inputData[key] = ''
  })
}
defineExpose({ setRegisModalInit })
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
.tab-tane-active {
  width: 80px;
  height: 28px;
  font-weight: 600;
  font-size: 20px;
  color: #333333;
  line-height: 28px;
  text-align: center;
  font-style: normal;
}
.create-creative {
  :deep(.ant-modal-content) {
    border-radius: 24px;
  }
}
.login-content {
  width: 100%;
  height: 100%;
  padding: 37px 51px;
  .login-input {
    width: 378px;
    height: 46px;
  }
  .login-input-password {
    width: 378px;
    height: 46px;
  }
  .hqyzm {
    width: 70px;
    font-weight: 400;
    font-size: 14px;
    color: $red-color;
    line-height: 20px;
    text-align: right;
    font-style: normal;
    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
.login-btn {
  width: 378px;
  height: 40px;
  border-radius: 8px;
  background: $red-color;
  margin: 0 51px 10px 51px;
  padding: 10px 175px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: #fa6f67;
  }
}

.login-xieyi {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
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

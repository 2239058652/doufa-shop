<template>
  <div ref="createCreative" class="create-creative">
    <a-modal
      v-model:open="modal2Visible"
      centered
      :footer="null"
      :getContainer="() => createCreative"
    >
      <div class="login-modal">
        <div class="login-tabs">
          <div :class="activeKey == '1' ? 'tab-tane-active' : 'tab-tane'" @click="activeKey = '1'">
            登录
          </div>
          <div
            :class="activeKey == '1' ? 'tab-tane-phone' : 'tab-tane-phone-active'"
            @click="activeKey = '2'"
          >
            验证码登录
          </div>
        </div>
        <div class="login-content">
          <a-input class="login-input" />
          <a-input class="login-input-password" />
          <div class="login-text">
            <span>重置密码</span>
            <span>注册</span>
          </div>
        </div>
        <a-button
          key="submit"
          type="primary"
          :loading="loginLoading"
          @click="handleLogin"
          style="
            width: 378px;
            height: 40px;
            border-radius: 8px;
            background: #f83126;
            margin: 75px 51px 181px 51px;
            padding: 10px 175px;
          "
        >
          登录
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const activeKey = ref('1')
const modal2Visible = ref<boolean>(false)
const loginLoading = ref<boolean>(false)
const createCreative = ref()

const setModal1Visible = (open: boolean) => {
  modal2Visible.value = open
}
const handleLogin = () => {}
defineExpose({ setModal1Visible })
</script>

<style scoped lang="scss">
.login-modal {
  width: 480px;
  height: 514px;
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
  width: 480px;
  height: 514px;
  margin: 283px 720px;
  ::v-deep .ant-modal-content {
    border-radius: 24px;
  }
}
.login-content {
  width: 100%;
  height: 260px;
  .login-input {
    width: 378px;
    height: 46px;
    margin: 37px 51px 10px 51px;
  }
  .login-input-password {
    width: 378px;
    height: 46px;
    margin: 10px 51px 10px 51px; /* 修改这里：把296px改为10px */
  }
  .login-text {
    display: flex;
    justify-content: space-between;
    margin: 0 51px 280px 51px;
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
</style>

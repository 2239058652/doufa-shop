<template>
  <div class="user-info">
    <a-card v-show="!showUserInfo">
      <div class="title">基本信息</div>
      <a-form :colon="false" labelAlign="right" :labelCol="{ span: 1 }" class="demo-form-inline" :rules="rules">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="头像">
              <a-flex gap="10px" vertical justify="center" align="center" style="width: 120px; height: auto">
                <div class="attr_img">
                  <img src="../../../assets/image/touxiang.png" alt="头像" />
                </div>
                <div class="arr_calss">
                  <span>更换头像</span>
                </div>
              </a-flex>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用户名" name="name">
              <a-input v-model:value="formData.name" placeholder="用户名" style="width: 30%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="UID">
              <a-input v-model:value="formData.name" placeholder="UID" style="width: 30%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用户组">
              <a-input v-model:value="formData.name" placeholder="用户组" style="width: 30%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="密码" name="code">
              <a-input-password
                v-model:value="formData.code"
                placeholder="密码"
                :visibility-toggle="false"
                style="width: 30%"
              />
              <span class="code_cls">更改密码</span>
            </a-form-item>
          </a-col>
          <a-form-item noStyle>
            <span class="submit_btn">
              <span>提交</span>
            </span>
            <span class="cancel_btn">
              <span>取消</span>
            </span>
          </a-form-item>
        </a-row>
      </a-form>
    </a-card>
    <a-flex gap="20" align="center" justify="center" vertical>
      <a-card style="width: 100%">
        <a-flex align="center" justify="space-between">
          <div class="user_arr">
            <div class="arr_img">
              <img src="../../../assets/image/user.png" alt="" />
            </div>
            <div class="user_info">
              <div class="user_nich">sky以沫_</div>
              <div class="user_uid">UID：86868686</div>
            </div>
          </div>
          <div class="youhuiquan">
            <div class="yhq_title">
              <span>优惠券</span>
              <span>0</span>
              <span>张</span>
            </div>
            <div class="yhq_card">
              <div class="yhq_img">
                <img src="../../../assets/image/youhuiquan.png" alt="" />
                <div class="yhq_font">
                  <div>暂无可用优惠券</div>
                  <div>0张优惠券可用</div>
                </div>
              </div>
              <div class="yhq_btn">
                <span>去查看</span>
              </div>
            </div>
          </div>
        </a-flex>
      </a-card>
      <a-card style="width: 100%">2</a-card>
      <a-card style="width: 100%">3</a-card>
      <a-card style="width: 100%">4</a-card>
      <a-card style="width: 100%">5</a-card>
    </a-flex>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'

const showUserInfo = ref(false)
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Please input Activity name', trigger: 'change' }],
  code: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }]
}
const formData = ref({
  name: '黄欢欢',
  code: ''
})
</script>

<style scoped src="./UserInfo.scss"></style>

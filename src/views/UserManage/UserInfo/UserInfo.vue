<template>
  <context-holder />
  <div class="user-info">
    <!-- 个人信息 -->
    <a-flex gap="20" align="center" justify="center" vertical v-show="!showUserInfo">
      <a-card style="width: 100%">
        <a-flex align="center" justify="space-between">
          <div class="user_arr" @click="showUserInfo = true">
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

      <!-- 待处理 -->
      <a-card class="dcl_card">
        <div class="dcl">待处理</div>
        <div class="dcl_item">
          <div class="item">
            <div>1230</div>
            <div>待付款</div>
          </div>
          <div class="xiantiao"> </div>
          <div class="item">
            <div>1230</div>
            <div>未发出</div>
          </div>
          <div class="xiantiao"> </div>
          <div class="item">
            <div>1230</div>
            <div>已发货</div>
          </div>
          <div class="xiantiao"> </div>
          <div class="item">
            <div>1230</div>
            <div>仅退款</div>
          </div>
          <div class="xiantiao"> </div>
          <div class="item">
            <div>1230</div>
            <div>退货退款</div>
          </div>
        </div>
      </a-card>

      <!-- 销量统计 -->
      <a-card class="xltj">
        <div class="top">
          <div class="title">销量统计</div>
          <div class="custom-radio-group">
            <div
              v-for="option in options"
              :key="option.value"
              class="custom-radio"
              :class="{ selected: selectedValue === option.value }"
              @click="handleSelect(option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
        <div class="adaptive-radio-group">
          <div
            v-for="option in options1"
            :key="option.value"
            class="adaptive-radio"
            :class="{ selected: selectedValue1 === option.value }"
            @click="handleSelect(option.value)"
          >
            {{ option.label }}
          </div>
        </div>
      </a-card>
      <a-card style="width: 100%">4</a-card>
      <a-card style="width: 100%">5</a-card>
    </a-flex>

    <!-- 修改基本信息 -->
    <a-card v-show="showUserInfo">
      <div class="info_title">基本信息</div>
      <a-form
        :colon="false"
        labelAlign="right"
        :labelCol="{ span: 2 }"
        class="demo-form-inline"
        :rules="rules"
        autocomplete="off"
      >
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="头像">
              <a-flex gap="10px" vertical justify="center" align="center" style="width: 120px; height: auto">
                <div class="attr_img">
                  <img :src="arrSrcUrl" alt="头像" />
                </div>
                <div class="arr_calss">
                  <a-upload
                    accept=".png,.jpg,.jpeg,.pneg"
                    :max-count="1"
                    :beforeUpload="handleUpload"
                    :showUploadList="false"
                  >
                    <span>更换头像</span>
                  </a-upload>
                </div>
              </a-flex>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="formData.username" placeholder="用户名" style="width: 30%" autocomplete="off" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="UID">
              <a-input v-model:value="formData.UID" placeholder="UID" style="width: 30%" autocomplete="off" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用户组">
              <a-input v-model:value="formData.nameinfo" placeholder="用户组" style="width: 30%" autocomplete="off" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="密码" name="code">
              <a-input-password
                v-model:value="formData.code"
                placeholder="密码"
                :visibility-toggle="false"
                autocomplete="current-password"
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
              <span @click="showUserInfo = false">取消</span>
            </span>
          </a-form-item>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { fetchUploadFile } from '@/api/index'
import { message } from 'ant-design-vue'
import srcUrl from '../../../assets/image/touxiang.png'

const [messageApi, contextHolder] = message.useMessage()

const showUserInfo = ref(false)
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Please input Activity name', trigger: 'change' }],
  code: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }]
}
const formData = ref({
  username: '黄欢欢',
  code: '············',
  UID: '263323432',
  nameinfo: '普通用户'
})

const options = [
  { value: 'a', label: '日' },
  { value: 'b', label: '月' },
  { value: 'c', label: '年' }
]
const options1 = [
  { value: 'a', label: '全部' },
  { value: 'b', label: '菲菲不是菲菲' },
  { value: 'c', label: '哈喽克缇' },
  { value: 'd', label: '沉香的男装店' }
]

const selectedValue = ref('a')
const selectedValue1 = ref('a')

const fileList = ref([])
const arrSrcUrl = ref(srcUrl)

const handleSelect = (value: string) => {
  selectedValue.value = value
  selectedValue1.value = value
}

// 更换头像上传
const handleUpload = async (file: any) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetchUploadFile(formData)
    if (res.status === 200) {
      arrSrcUrl.value = res.data.url
      fileList.value = []
      return false
    } else {
      messageApi.error(res.msg)
      return false // 上传失败，阻止上传
    }
  } catch (e) {
    messageApi.error('上传失败')
    return false
  }
}
</script>

<style scoped src="./UserInfo.scss"></style>
<style scoped lang="scss">
.custom-radio-group {
  display: flex;
}

.custom-radio {
  width: 42px;
  height: 24px;
  line-height: 19px;
  text-align: center;
  font-size: 14px;
  color: #666666; /* 未选中时文字颜色 */
  border: 1px solid #e1e1e1; /* 默认边框颜色 */
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center; /* 文字靠左对齐 */
}

.custom-radio.selected {
  border-color: f83126; /* 选中时边框颜色 */
  color: #f83126; /* 选中时文字颜色 */
}

.custom-radio.selected {
  color: #f83126; /* 选中时颜色 */
}

.adaptive-radio-group {
  margin-top: 30px;
  display: flex;
  gap: 14px;
}

.adaptive-radio {
  padding: 0 12px; /* 左右内边距，确保文字周围有空间 */
  height: 34px;
  border-radius: 6px;
  background-color: #f7f8fa;
  display: inline-flex; /* 自适应宽度 */
  align-items: center;
  justify-content: center; /* 文字居中 */
  font-family: MicrosoftYaHei, sans-serif;
  font-size: 16px;
  line-height: 21px;
  color: #666666;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-style: normal;
  border: 1px solid #e1e1e1; /* 默认边框 */
}

.adaptive-radio.selected {
  background-color: #ffebe9;
  color: #f83126;
  border-color: #f83126;
}
</style>

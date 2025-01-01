<template>
  <context-holder />
  <div class="home">
    <!-- LOGO区域 -->
    <div class="logo">
      <a href="/">
        <img src="../../assets/image/payfxdf.png" alt="" />
      </a>
    </div>
    <!-- 订单信息, 左右布局，左侧为收货和订单信息，右侧为付款详情 -->
    <div class="oder_info">
      <div class="address_sales_info">
        <div class="address_info">
          <div class="address_title">确认收货信息</div>
          <div class="input_textarea">
            <a-input type="textarea" :auto-size="{ minRows: 1, maxRows: 3 }" v-model:value="textareaVal"
              :bordered="false" placeholder="粘贴文本，智能识别收货信息">
              <template #suffix>
                <div class="suffix">
                  <span>快速识别</span>
                </div>
              </template>
            </a-input>
          </div>
          <div class="adress_tishi">
            例：抖发网，13888888888，浙江省 杭州市 上城区 清江路138号，景园家苑，310016
          </div>
          <div class="form_row">
            <a-form ref="formAddressRef" labelAlign="left" :model="formState" name="address" autocomplete="off">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="收货人" name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input v-model:value="formState.username" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="联系方式" name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input v-model:value="formState.username" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="收货地区" name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-cascader :dropdownStyle="{}" v-model:value="value" :options="options" expand-trigger="hover"
                      placeholder="请选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="详细地址" name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input v-model:value="formState.username" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
        <div class="sales_info">2</div>
      </div>
      <div class="pay_info">yc</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { reactive, ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { regionData, codeToText } from "element-china-area-data"


const [messageApi, contextHolder] = message.useMessage()
const route = useRoute()
console.log(route.query, 'route')

const textareaVal = ref('')  // 智能识别信息

const options = ref(regionData) //// 省市区选择数据

const formAddressRef = ref<FormInstance>()
const formState = reactive<any>({
  username: '',
  password: '',
  remember: true,
})

</script>

<style src="./PayOrder.scss" scoped></style>
<style scoped lang="scss">
// class="ant-select-dropdown ant-cascader-dropdown css-dev-only-do-not-override-1p3hq3p ant-select-dropdown-placement-bottomLeft"
// :deep(div.ant-cascader-menus) {
//   display: none;
// }</style>

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


const [messageApi, contextHolder] = message.useMessage()
const route = useRoute()
console.log(route.query, 'route')

</script>

<style src="./PayOrder.scss" scoped></style>
<style scoped></style>

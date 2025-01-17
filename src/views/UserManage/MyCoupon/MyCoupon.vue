<template>
  <context-holder />
  <div class="coupon">
    <a-card class="coupon-card">
      <div class="title">优惠券</div>
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 0 }" @click="activeTab = 0">
          <span>未使用（1）</span>
        </div>
        <div class="tab" :class="{ active: activeTab === 1 }" @click="activeTab = 1">
          <span>已使用（0）</span>
        </div>
        <div class="tab" :class="{ active: activeTab === 2 }" @click="activeTab = 2">
          <span>已过期（0）</span>
        </div>
      </div>

      <a-flex justify="flex-start" align="center" :gap="20" wrap="wrap" class="quan">
        <div
          class="yhquan"
          v-for="(item, index) in 5"
          :key="index"
          :class="{ quan_active: activeQaun === index }"
          @click="activeQaun = index"
        >
          <a-flex justify="space-around" align="center" style="width: 100%">
            <a-flex justify="center" align="center" vertical>
              <div class="price">¥1</div>
              <div class="price_name">商品优惠券</div>
            </a-flex>
            <a-flex justify="center" align="center" vertical :gap="8">
              <div class="require">满20可用</div>
              <div class="time">2024.12.12 15:57—2025.2.12 15:57</div>
              <div class="type">所有店铺通用券</div>
            </a-flex>
            <a-flex justify="center" align="center" vertical>
              <div class="btn">
                <span>去使用</span>
              </div>
            </a-flex>
          </a-flex>
        </div>
      </a-flex>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { message, Modal, Form, FormItem, Input, QRCode } from 'ant-design-vue'
import { ref } from 'vue'

const activeTab = ref(0)
const activeQaun = ref(0)

const [messageApi, contextHolder] = message.useMessage()
</script>

<style scoped src="./MyCoupon.scss"></style>

<template>
  <div class="home">
    <div class="top-func">
      <div class="func-img">
        <a href="/">
          <img src="../assets/image/logo.png" alt="" />
        </a>
      </div>
      <div class="func-address">
        <div class="address-name">【济南】</div>
        <div class="address-tab">切换地址</div>
      </div>
      <div class="func-sou">
        <div class="func-sou-input">
          <a-input v-model:value="inputVal" :bordered="false" placeholder="请搜索产品名称、货号">
            <template #prefix>
              <a-select :bordered="false" v-model:value="selectVal" style="width: 100px">
                <a-select-option value="jack">宝贝货号</a-select-option>
                <a-select-option value="lucy">档口搜索</a-select-option>
              </a-select>
            </template>
          </a-input>
        </div>
        <div class="func-sou-type">2024</div>
      </div>
      <div class="func-car">gouwhce</div>
    </div>
    <div class="shop-sort"> 商品分类 广告等 </div>
    <div class="hot-rank"> 精选 热销 </div>
    <div class="hot-merchants"> 热销商家 </div>
    <div class="quality-source"> 精选 热销 </div>
    <!-- 底部开发者信息 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '@/components/footer/index.vue'
import { ref } from 'vue'

const inputVal = ref('')
const selectVal = ref('jack')
</script>

<style scoped lang="scss">
@use '@/utils/helpers.sass' as helpers;
.home {
  margin: helpers.px(0);
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: helpers.px(20);
}
.top-func {
  width: helpers.px(1560);
  height: helpers.px(124);
  display: flex;
  justify-content: space-around;
  align-items: center;
  .func-img {
    img {
      width: helpers.px(193);
      height: helpers.px(82);
      cursor: pointer;
    }
  }
  .func-address {
    width: helpers.px(80);
    height: helpers.px(80);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: helpers.px(5);
    .address-name {
      width: 80px;
      height: 26px;
      font-size: 20px;
      color: #333333;
      line-height: 26px;
      text-align: center;
      font-style: normal;
      cursor: pointer;
      &:hover {
        color: #131010;
      }
    }
    .address-tab {
      width: 56px;
      height: 19px;
      font-size: 14px;
      color: #999999;
      line-height: 19px;
      text-align: center;
      font-style: normal;
      cursor: pointer;
      &:hover {
        color: #c2b4b4;
      }
    }
  }
  .func-sou {
    width: helpers.px(782);
    height: helpers.px(80);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: helpers.px(5);
    .func-sou-input {
      width: helpers.px(782);
      height: helpers.px(50);
      border: 2px solid #f83126;
      border-radius: 8px;
    }
    .func-sou-type {
      width: helpers.px(782);
      height: helpers.px(20);
      background-color: #ffffff;
    }
  }
  .func-car {
    width: helpers.px(140);
    height: helpers.px(50);
    background-color: #f3f3f3;
  }
}
.shop-sort {
  width: helpers.px(1560);
  height: helpers.px(700);
  background-color: #bbc2ca;
}
.hot-rank {
  width: helpers.px(1560);
  height: helpers.px(500);
  background-color: #a1a4a7;
}
.hot-merchants {
  width: helpers.px(1560);
  height: helpers.px(600);
  background-color: #bec9d3;
}
.quality-source {
  width: helpers.px(1560);
  height: helpers.px(1300);
  background-color: #92bfec;
}
</style>

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
              <a-select :bordered="false" v-model:value="selectVal" style="width: 110px">
                <a-select-option value="jack">宝贝货号</a-select-option>
                <a-select-option value="lucy">档口搜索</a-select-option>
              </a-select>
            </template>
            <template #suffix>
              <div class="photo-sou">
                <img src="../assets/image/photo.png" alt="识图" />
                <a-button type="primary" danger>搜索</a-button>
              </div>
            </template>
          </a-input>
        </div>
        <div class="func-sou-type">
          <div class="hot-type">
            <span
              :class="{ active: activeIndex === index }"
              v-for="(item, index) in hotSouTypeList"
              :key="index"
              @click="activeIndex = index"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
      <div class="func-car">
        <div class="car-top">
          <span class="cart-count">{{ cartCount }}</span>
        </div>
        <div class="car-bottom">
          <img src="../assets/image/shopcar.png" alt="" />
          <div class="shop-car">购物车</div>
        </div>
      </div>
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
const hotSouTypeList = ref(['2024', 'T恤', '毛衣', '牛仔裤', '羽绒服'])
const activeIndex = ref(0)
const cartCount = ref(3)
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

  .func-img img {
    width: helpers.px(193);
    height: helpers.px(82);
    cursor: pointer;
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

      .photo-sou {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: helpers.px(19);

        img {
          width: helpers.px(22);
          height: helpers.px(20);
          cursor: pointer;
        }
      }
    }

    .func-sou-type {
      width: helpers.px(782);
      height: helpers.px(20);
      background-color: #ffffff;

      .hot-type {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: helpers.px(20);

        span {
          font-size: 14px;
          line-height: 19px;
          color: #999999;
          cursor: pointer;

          &:hover {
            color: #f83126;
          }

          &.active {
            color: #f83126;
          }
        }
      }
    }
  }

  .func-car {
    width: helpers.px(140);
    height: helpers.px(50);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .car-top {
      width: helpers.px(23);
      height: helpers.px(16);
      border-radius: helpers.px(8);
      position: relative;

      .cart-count {
        position: absolute;
        top: helpers.px(5);
        right: helpers.px(15);
        background: #f83126;
        color: white;
        font-size: 12px;
        min-width: 16px;
        height: 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
      }
    }

    .car-bottom {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: helpers.px(5);

      img {
        width: helpers.px(21);
        height: helpers.px(19);
      }

      .shop-car {
        width: 48px;
        height: 21px;
        font-size: 16px;
        color: #f83126;
        line-height: 21px;
        text-align: left;
        font-style: normal;
      }
    }
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

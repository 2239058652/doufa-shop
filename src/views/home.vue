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
    <div class="shop-sort">
      <div class="s-s-left">商品分类</div>
      <div class="s-s-middle">中间</div>
      <div class="s-s-right">右侧</div>
    </div>
    <div class="hot-rank">
      <div class="hot-rank-item">精选货源</div>
      <div class="hot-rank-item">热销榜</div>
      <div class="hot-rank-item">好评榜</div>
      <div class="hot-rank-item">礼品专区</div>
    </div>
    <div class="hot-merchants">
      <div class="hot-merch-item">热销商家</div>
      <div class="hot-merch-item">优质商家</div>
      <div class="hot-merch-item">信誉商家</div>
    </div>
    <div class="quality-source">
      <div class="q-s-item" v-for="(item, index) in 18" :key="index">
        <div> {{ item }}{{ '优质货源' }}</div>
      </div>
    </div>
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
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.top-func {
  width: 1560px;
  height: 124px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .func-img img {
    width: 193px;
    height: 82px;
    cursor: pointer;
  }

  .func-address {
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;

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
    width: 782px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;

    .func-sou-input {
      width: 782px;
      height: 50px;
      border: 2px solid #f83126;
      border-radius: 8px;

      .photo-sou {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 19px;

        img {
          width: 22px;
          height: 20px;
          cursor: pointer;
        }
      }
    }

    .func-sou-type {
      width: 782px;
      height: 20px;
      background-color: #ffffff;

      .hot-type {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;

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
    width: 140px;
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .car-top {
      width: 23px;
      height: 16px;
      border-radius: 8px;
      position: relative;

      .cart-count {
        position: absolute;
        top: 5px;
        right: 15px;
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
      gap: 5px;

      img {
        width: 21px;
        height: 19px;
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
  width: 1560px;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  .s-s-left {
    width: 252px;
    height: 646px;
    background-color: #bbc2ca;
  }
  .s-s-middle {
    width: 712px;
    height: 646px;
    background-color: #bbc2ca;
  }
  .s-s-right {
    width: 516px;
    height: 646px;
    background-color: #bbc2ca;
  }
}

.hot-rank {
  width: 1560px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  .hot-rank-item {
    width: 375px;
    height: 496px;
    background-color: #a1a4a7;
  }
}

.hot-merchants {
  width: 1560px;
  height: 610px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  .hot-merch-item {
    width: 506px;
    height: 608px;
    background-color: #a1a4a7;
  }
}

.quality-source {
  width: 1560px;
  height: 1282px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 2px;
  .q-s-item {
    width: 255px;
    height: 372px;
    background-color: #a1a4a7;
  }
}
</style>

<template>
  <div class="merchandis">
    <!-- 顶部logo搜索框 -->
    <div class="logo-search">
      <div class="logo">
        <img src="../../assets/image/fxdfpure.png" alt="" />
      </div>
      <div class="search">
        <a-input :bordered="false" style="width: 100%;height: 100%;" v-model:value="inputVal" placeholder="宝贝搜索">
          <template #suffix>
            <div class="s-suffix">
              <div><span>搜索</span></div>
              <div><span>搜本店</span></div>
            </div>
          </template>
        </a-input>
      </div>
    </div>
    <!-- 顶部个人店铺信息 -->
    <div class="user-store">
      <div class="store-info">
        <div class="user-atrr">
          <div class="atrr-img">
            <img src="../../assets/image/user.png" alt="" />
          </div>
          <div class="atrr-info">
            <div class="attr-name">慢慢家男装</div>
            <div class="zhuying">主营: 男装</div>
          </div>
        </div>
        <div class="user-tongji">
          <div>
            <div>
              4.6
              <div class="star" v-for="(item, index) in 4" :key="index"></div>
            </div>
          </div>
          <div>退货率3%</div>
          <div>缺货率93%</div>
        </div>
      </div>
      <div class="store-btn">
        <div>
          <img src="../../assets/image/store-icon.png" alt="" />
          <span>进入店铺</span>
        </div>
        <div>
          <img src="../../assets/image/kefu-icon.png" alt="" />
          <span>在线客服</span>
        </div>
      </div>
    </div>

    <!-- 商品图片下单区域 -->
    <div class="goods-order">
      <!-- 左侧商品图片 -->
      <div class="goods-img">
        <div class="img-slide">
          <img @mouseover="handleImgMoveOver(index)" :class="imgIndex == index ? 'active' : ''"
            src="../../assets/static/img-slide.png" alt="" v-for="(item, index) in 14" :key="index" />
        </div>

        <!-- 右侧主大图 -->
        <div class="main-img">
          <img src="../../assets/static/main-img.png" alt="" />
        </div>
      </div>
      <!-- 右侧下单区域 -->
      <div class="goods-func"></div>
    </div>
    <div class="goods-detail"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const inputVal = ref('')
const rateVal = ref(4.6)
const imgIndex = ref(0)

// 接受商品详情的ID+
const { id: detailId } = route.params
console.log(detailId)

// 商品图鼠标移入
const handleImgMoveOver = (index: number) => {
  imgIndex.value = index
}


</script>

<style scoped src="./Merchandis.scss"></style>
<style scoped></style>

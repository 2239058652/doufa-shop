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
        <div class="main-img" ref="target">
          <img src="../../assets/static/main-img.png" alt="" />
          <!-- 蒙层小滑块 -->
          <div class="layer" v-show="!isOutside" :style="{ left: `${left}px`, top: `${top}px`, borderRadius: '12px' }">
          </div>
          <!-- 放大镜大图 -->
          <!-- <div class="large" :style="[
            {
              backgroundImage: `url('../../assets/static/main-img.png')`,
              // backgroundImage: `url(${imageList[activeIndex]})`,
              backgroundPositionX: `${positionX}px`,
              backgroundPositionY: `${positionY}px`,
            },
          ]" v-show="!isOutside"></div> -->
          <div class="large" :style="[{
            backgroundImage: `url(${url})`,
            backgroundPositionX: `${positionX}px`,
            backgroundPositionY: `${positionY}px`,
          }]" v-show="!isOutside"></div>

        </div>
      </div>
      <!-- 右侧下单区域 -->
      <div class="goods-func"></div>
    </div>
    <div class="goods-detail"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMouseInElement } from '@vueuse/core'
import url from '../../assets/static/main-img.png'


const target = ref(null)

const { elementX, elementY, isOutside } = useMouseInElement(target)
const left = ref(0)
const top = ref(0)
const positionX = ref(0)
const positionY = ref(0)
watch([elementX, elementY, isOutside], () => {
  if (isOutside.value) return

  const containerWidth = 624
  const containerHeight = 624
  const layerSize = 197
  const scale = 2 // 放大倍数

  // 计算鼠标位置，考虑蒙层的一半尺寸
  const halfLayer = layerSize / 2
  left.value = Math.max(halfLayer, Math.min(elementX.value, containerWidth - halfLayer)) - halfLayer
  top.value = Math.max(halfLayer, Math.min(elementY.value, containerHeight - halfLayer)) - halfLayer

  // 计算放大图位置，使用比例计算
  positionX.value = -(left.value / containerWidth) * (800 - 400)
  positionY.value = -(top.value / containerHeight) * (800 - 400)
})




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
<style scoped lang="scss"></style>

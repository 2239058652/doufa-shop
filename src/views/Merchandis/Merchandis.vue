<template>
  <context-holder />
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
    <div class="goods-main">
      <div class="goods-order">
        <!-- 左侧商品图片 -->
        <div class="goods-img">
          <div class="img-slide">
            <img @mouseover="handleImgMoveOver(item, index)" :class="imgIndex == index ? 'active' : ''" :src="item"
              alt="" v-for="(item, index) in goodsDetail?.storeInfo?.slider_image" :key="index" />
          </div>

          <!-- 右侧主大图 -->
          <div class="main-img" ref="target">
            <img :src="imageBaseUrl" alt="" />
            <!-- 蒙层小滑块 -->
            <div class="img-layer" v-show="!isOutside"
              :style="{ left: `${left}px`, top: `${top}px`, borderRadius: '12px' }">
            </div>
            <!-- 放大镜大图 -->
            <div class="img-large" :style="[
              {
                backgroundImage: `url(${imageBaseUrl})`,
                backgroundPositionX: `${positionX}px`,
                backgroundPositionY: `${positionY}px`,
              },
            ]" v-show="!isOutside"></div>

          </div>
        </div>
        <!-- 右侧下单区域 -->
        <a-skeleton :loading="!goodsDetail.productAttr" active>
          <div class="goods-func">
            <div class="store_name">{{ goodsDetail?.storeInfo?.store_name }}</div>
            <div class="goods-price">
              <span>¥</span>
              <span>{{ goodsDetail?.storeInfo?.price }}</span>
              <span>已售：{{ goodsDetail?.storeInfo?.sales }}</span>
            </div>
            <div class="goods-keyword">
              <span>货 号：</span>
              <span> {{ goodsDetail?.storeInfo?.keyword }}</span>
            </div>
            <div class="goods-cate_name">
              <span>类 目： </span>
              <span> {{ goodsDetail?.storeInfo?.cate_name }}</span>
            </div>
            <div class="goods-add_time">
              <span>发布日期：</span>
              <span>{{ formatTime(goodsDetail?.storeInfo?.add_time) }}</span>
            </div>
            <div class="colors">
              <div class="colors_title">颜 色：</div>
              <div class="colors_box">
                <div v-for="(item, index) in goodsDetail?.productAttr[0]?.attr_values" :key="index">
                  <div id="colors_item" @click="colorIndex = index" :class="colorIndex == index ? 'active' : ''">
                    <div>{{ item }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="colors">
              <div class="colors_title">尺 码： </div>
              <div class="colors_box">
                <div v-for="(item, index) in goodsDetail?.productAttr[1]?.attr_values" :key="index">
                  <div id="colors_item" @click="sizeIndex = index" :class="sizeIndex == index ? 'active' : ''">
                    <div>{{ item }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="goods-num">
              <span>数 量：</span>
              <a-input-number v-model:value="goodsDetailNum" :min="0" :max="1000000">
                <template #addonBefore>
                  <div class="jian" @click="goodsDetailNum--">-</div>
                </template>
                <template #addonAfter>
                  <div class="jia" @click="goodsDetailNum++">+</div>
                </template>
              </a-input-number>
            </div>
            <div class="oders-fc">
              <div class="oders-fc_left">
                <div class="fc_text">共2件</div>
                <div>
                  <span class="fc_text">合计金额：</span>
                  <span class="fc_price">698.01</span>
                  <span class="fc_text">元</span>
                </div>
              </div>
              <div class="oders-fc_right">
                <div class="fc_r_text">已选清单</div>
                <div>
                  <img src="../../assets/image/fixed_toTop.png" alt="" />
                </div>
              </div>
            </div>
            <div class="oders-btn">
              <div class="oders-fc_left">
                <div class="fc_text">共2件</div>
                <div>
                  <span class="fc_text">合计金额：</span>
                  <span class="fc_price">698.01</span>
                  <span class="fc_text">元</span>
                </div>
              </div>
              <div class="oders-fc_right">
                <div class="fc_r_text">已选清单</div>
                <div>
                  <img src="../../assets/image/fixed_toTop.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </a-skeleton>
      </div>
      <div class="download-btn">
        <div>
          <span>
            <img src="../../assets/image/xcicon.png" alt="" />
          </span>
          <span>相册下载</span>
        </div>
        <div>
          <span>
            <img src="../../assets/image/scxzicon.png" alt="" />
          </span>
          <span>下载素材</span>
        </div>
      </div>
    </div>
    <div class="goods-detail"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMouseInElement } from '@vueuse/core'
import { getProductDetail } from '@/api/store'
import { message } from 'ant-design-vue'
import moment from "moment"

const [messageApi, contextHolder] = message.useMessage()


const target = ref(null)
// 放大镜相关代码
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
const colorIndex = ref(0)
const sizeIndex = ref(0)
const goodsDetailNum = ref(0)

const goodsDetail = ref<any>({}) // 商品详情
const imageBaseUrl = ref('')  // 商品大图

// 接受商品详情的ID+
const { id: detailId }: any = route.params
console.log(detailId)
// 获取商品详情
const fetchGoodsDetail = () => {
  getProductDetail(detailId).then((res: any) => {
    console.log(res.data)
    if (res.status == 200) {
      goodsDetail.value = res.data
      imageBaseUrl.value = res.data.storeInfo.image_base
    } else {
      messageApi.error(res.msg)
    }
  })
}


// 商品图鼠标移入
const handleImgMoveOver = (item: any, index: number) => {
  imgIndex.value = index
  imageBaseUrl.value = item
}

// 转换时间戳
const formatTime = (time: number) => {
  return moment(time * 1000).format("YYYY-MM-DD HH:mm")
}

fetchGoodsDetail()
</script>

<style scoped src="./Merchandis.scss"></style>
<style scoped lang="scss"></style>

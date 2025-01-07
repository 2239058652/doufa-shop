<template>
  <context-holder />
  <div class="merchandis">
    <!-- 顶部logo搜索框 -->
    <div class="logo-search">
      <div class="logo">
        <a href="/">
          <img src="../../assets/image/fxdfpure.png" alt="" />
        </a>
      </div>
      <div class="search">
        <a-input :bordered="false" style="width: 100%; height: 100%" v-model:value="inputVal" placeholder="宝贝搜索">
          <template #suffix>
            <div class="s-suffix">
              <div>
                <!-- 以图搜索封装组件 -->
                <Popover @beforeUpload="beforeUpload" v-model:open="photoPopoverVisible" />
              </div>
              <div @click="routerToSearch"><span>搜索</span></div>
              <div @click="$router.push('/merhome')"><span>搜本店</span></div>
            </div>
          </template>
        </a-input>
      </div>
    </div>

    <!-- 顶部个人店铺信息 -->
    <div class="user-store">
      <div class="store-info">
        <a-popover placement="bottom" :overlayInnerStyle="{
          width: '279px',
          height: 'auto',
          borderRadius: '12px',
          padding: '15px',
        }" :overlayStyle="{ paddingRight: '', paddingTop: '10px' }" :arrow="false">
          <template #title>
            <div class="store-popover-title">
              <span class="store-name">{{ storeInfo.name }}</span>
              <span class="follow-button" @click="followStore"> +关注店铺 </span>
            </div>
          </template>
          <template #content>
            <div class="store-popover-content">
              <div class="popover-item">
                <span class="item-label">综合评分：</span>
                <!-- <span class="item-value">{{ storeInfo.rating }}</span> -->
                <div class="item-value" style="display: flex; align-items: center;">
                  {{ storeInfo.rating }}
                  <div class="star" v-for="(item, index) in 4" :key="index"></div>
                </div>
              </div>
              <div class="popover-item">
                <span class="item-label">联系方式：</span>
                <span class="item-value">{{ storeInfo.phone }}</span>
                <img class="copy-icon" src="../../assets/image/copy.png" alt="" @click="copyPhone(storeInfo.phone)" />
              </div>
              <div class="popover-item">
                <span class="item-label">客 服：</span>
                <img class="kefu-icon" src="../../assets/image/kefu-icon.png" alt="" />
                <span class="item-value">在线客服</span>
              </div>
              <div class="divider"></div>
              <div class="store-stats">
                <div class="stat-item">
                  <div class="stat-label">评分</div>
                  <div class="stat-value">{{ storeInfo.rating }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">退货率</div>
                  <div class="stat-value">{{ storeInfo.returnRate }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">缺货率</div>
                  <div class="stat-value">{{ storeInfo.outOfStockRate }}</div>
                </div>
              </div>
              <div class="enter-store-button" @click="$router.push('/merhome')">
                进入店铺
              </div>
            </div>
          </template>
          <div class="user-atrr">
            <div class="atrr-img">
              <img src="../../assets/image/user.png" alt="" />
            </div>
            <div class="atrr-info">
              <div class="attr-name">慢慢家男装</div>
              <div class="zhuying">主营: 男装</div>
            </div>
          </div>
        </a-popover>
        <div class="user-tongji">
          <div>
            <div>
              {{ storeInfo.rating }}
              <div class="star" v-for="(item, index) in 4" :key="index"></div>
            </div>
          </div>
          <div>退货率{{ storeInfo.returnRate }}</div>
          <div>缺货率{{ storeInfo.outOfStockRate }}</div>
        </div>
      </div>
      <div class="store-btn">
        <div @click="$router.push('/merhome')">
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
        <!-- 左侧商品图片列表 -->
        <div class="goods-img">
          <div class="img-slide">
            <img @mouseover="handleImgMoveOver(item, index)" :class="imgIndex == index ? 'active' : ''" :src="item"
              alt="" v-for="(item, index) in goodsDetail?.storeInfo?.slider_image" :key="index" />
          </div>

          <!-- 右侧主大图 -->
          <div class="main-img" ref="target">
            <img :src="imageBaseUrl" alt="加载中。。。" />
            <!-- 蒙层小滑块 -->
            <div class="img-layer" v-show="!isOutside"
              :style="{ left: `${left}px`, top: `${top}px`, borderRadius: '12px' }">
            </div>
            <!-- 放大镜大图 -->
            <div class="img-large" :style="[
              {
                backgroundImage: `url(${imageBaseUrl})`,
                backgroundPositionX: `${positionX}px`,
                backgroundPositionY: `${positionY}px`
              }
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
                <div v-for="(item, index) in newAttrValueList" :key="index">
                  <div id="colors_item" @click="handleColorSelect(index)" :class="colorIndex == index ? 'active' : ''">
                    <img :src="item.image" alt="item.attr" />
                    <div>{{ item.attr }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="colors">
              <div class="colors_title">尺 码： </div>
              <div class="colors_box">
                <div v-for="(item, index) in goodsDetail?.productAttr[1]?.attr_values" :key="index">
                  <div id="colors_item" @click="handleSizeSelect(index)" :class="sizeIndex == index ? 'active' : ''">
                    <div>{{ item }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="goods-num">
              <span>数 量：</span>
              <a-input-number v-model:value="goodsDetailNum" :min="0" :max="100">
                <template #addonBefore>
                  <div class="jian" @click="caculateGoodsNum('reduce')">-</div>
                </template>
                <template #addonAfter>
                  <div class="jia" @click="caculateGoodsNum('add')">+</div>
                </template>
              </a-input-number>
            </div>
            <div class="oders-fc">
              <div class="oders-fc_left">
                <div class="fc_text">共{{ selectedInfo.quantity }}件</div>
                <div>
                  <span class="fc_text">合计金额：</span>
                  <span class="fc_price">{{ selectedInfo.totalAmount }}</span>
                  <span class="fc_text">元</span>
                </div>
              </div>

              <!-- // 注释掉 -->
              <!-- div class="oders-fc_right">
                <div class="fc_r_text">已选清单</div>
                <div>
                  <img src="../../assets/image/fixed_toTop.png" alt="" />
                </div>
              </!-->
            </div>
            <div class="oders-btn">
              <div @click="payOrderNow">
                <span>立即下单</span>
              </div>
              <div @click="hanldeAddToCart">
                <span>加入购物车</span>
              </div>
              <div>
                <span>加入货架</span>
              </div>
              <div>
                <span>一件上传</span>
              </div>
              <div>
                <span>站内同款</span>
              </div>
              <div>
                <span>
                  <img src="../../assets/image/fixed_live.png" alt="" />
                </span>
                <span>收藏</span>
              </div>
            </div>
          </div>
        </a-skeleton>
      </div>

      <!-- 图片下载先注释掉 -->
      <!-- <div class="download-btn">
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
      </div> -->
    </div>

    <!-- 商品详情区 -->
    <div class="goods-detail">
      <!-- 商品详情和代发说明切换 -->
      <div class="goods-tabs">
        <div :class="tabsIndex == 0 ? 'tabs_active' : 'tabs_unactive'" @click="tabsIndex = 0">商品详情</div>
        <div :class="tabsIndex == 1 ? 'tabs_active' : 'tabs_unactive'" @click="tabsIndex = 1">代发说明</div>
      </div>
      <!-- 我是一条线 -->
      <div class="woshiyitiaoxian"></div>
      <!-- 商品详情 -->
      <div class="goods_detail_box">
        <!-- 商品详情 -->
        <a-skeleton :loading="!goodsDetail.storeInfo" active>
          <div class="spxq" v-if="tabsIndex == 0">
            <div class="norms">
              <div class="norms_item" v-for="(item, index) in goodsDetail?.attribute" :key="index">
                <a-tooltip placement="top">
                  <template #title>{{ item }}</template>
                  <span>{{ item }}</span>
                </a-tooltip>
              </div>
            </div>
            <!-- 商品详情描述富文本 -->
            <div v-html="goodsDetail?.storeInfo.description" class="goods_description"></div>
          </div>
          <!-- 代发说明 -->
          <div class="spdf" v-else></div>
        </a-skeleton>
        <!-- 浮动下单框 -->
        <div class="float_order">
          <a-skeleton :loading="!goodsDetail.storeInfo" active>
            <!-- 图片和售价 -->
            <div class="float_top_img_price">
              <img src="../../assets/static/shangpinbg.png" alt="" />
              <div>
                <span>售价：</span>
                <span>¥{{ goodsDetail?.storeInfo?.price }}</span>
              </div>
            </div>
            <div class="colors">
              <div class="colors_title">颜 色：</div>
              <div class="colors_box">
                <div v-for="(item, index) in newAttrValueList" :key="index">
                  <div id="colors_item" @click="handleColorSelect(index)" :class="colorIndex == index ? 'active' : ''">
                    <img :src="item.image" alt="item.attr" />
                    <div>{{ item.attr }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="colors">
              <div class="colors_title">尺 码： </div>
              <div class="colors_box">
                <div v-for="(item, index) in goodsDetail?.productAttr[1]?.attr_values" :key="index">
                  <div id="colors_item" @click="handleSizeSelect(index)" :class="sizeIndex == index ? 'active' : ''">
                    <div>{{ item }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="goods-num">
              <span>数 量：</span>
              <a-input-number v-model:value="goodsDetailNum" :min="0" :max="100">
                <template #addonBefore>
                  <div class="jian" @click="caculateGoodsNum('reduce')">-</div>
                </template>
                <template #addonAfter>
                  <div class="jia" @click="caculateGoodsNum('add')">+</div>
                </template>
              </a-input-number>
            </div>
            <div class="goods_func">
              <div @click="payOrderNow">
                <span>立即下单</span>
              </div>
              <div @click="hanldeAddToCart">
                <span>加入购物车</span>
              </div>
            </div>
          </a-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMouseInElement, useScroll } from '@vueuse/core'
import { getProductDetail, addGoodsToCart } from '@/api/store'
import { message } from 'ant-design-vue'
import moment from 'moment'
import Popover from '@/components/phopopover/index.vue'
import { useClipboard } from '@vueuse/core'
import { useGoodsCartsTableStore } from '@/stores/goodCartsTable'

const goodsCartsTableStore = useGoodsCartsTableStore()  // 购物车表格数据,存到pinia中

const storeInfo = ref({
  name: '慢慢家男装店',
  rating: 4.6,
  phone: '13823234343',
  returnRate: '3%',
  outOfStockRate: '3%',
})

// 商品选择信息
const selectedInfo = ref({
  quantity: 0,
  totalAmount: '0.00',
  color: '',
  size: '',
  isValid: false
})

// 响应式数据
const el = ref<HTMLElement | null>(null)
const target = ref(null)
const inputVal = ref('')
const photoPopoverVisible = ref(false) //  以图搜索弹窗显示状态
const imgIndex = ref(0)
const colorIndex = ref(-1)
const tabsIndex = ref(0)
const sizeIndex = ref(-1)
const goodsDetailNum = ref(0)
const goodsDetail = ref<any>({})
const imageBaseUrl = ref('')
const newAttrValueList = ref<any[]>([])

const [messageApi, contextHolder] = message.useMessage()
const route = useRoute()
const router = useRouter()

// 监听选择变化
watch([goodsDetailNum, colorIndex, sizeIndex], () => {
  updateSelectedInfo()
})

// 更新选择信息
const updateSelectedInfo = () => {
  const price = Number(goodsDetail.value?.storeInfo?.price || 0)
  const quantity = goodsDetailNum.value
  selectedInfo.value = {
    quantity,
    totalAmount: (price * quantity).toFixed(2),
    color: goodsDetail.value?.productAttr?.[0]?.attr_values?.[colorIndex.value] || '',
    size: goodsDetail.value?.productAttr?.[1]?.attr_values?.[sizeIndex.value] || '',
    isValid: quantity > 0 && colorIndex.value >= 0 && sizeIndex.value >= 0
  }
}

// 选择颜色
const handleColorSelect = (index: number) => {
  colorIndex.value = index
  imageBaseUrl.value = newAttrValueList.value[index]?.image
  updateSelectedInfo()
}

// 选择尺码
const handleSizeSelect = (index: number) => {
  sizeIndex.value = index
  updateSelectedInfo()
}
// 修改数量
const caculateGoodsNum = (type: string) => {
  switch (type) {
    case 'add':
      goodsDetailNum.value++
      break
    case 'reduce':
      if (goodsDetailNum.value > 0) {
        goodsDetailNum.value--
      }
      break
  }
  updateSelectedInfo()
}

// 立即下单
const payOrderNow = () => {
  if (!selectedInfo.value.isValid) {
    messageApi.error('请选择商品数量、颜色和尺码！')
    return
  }

  // 构建订单数据
  const orderData = {
    id: detailId,
    productInfo: {
      store_name: goodsDetail.value?.storeInfo?.store_name,
      keyword: goodsDetail.value?.storeInfo?.keyword,
      attrInfo: {
        image: imageBaseUrl.value,
        price: goodsDetail.value?.storeInfo?.price,
        suk: `${selectedInfo.value.color},${selectedInfo.value.size}`,
      }
    },
    cart_num: selectedInfo.value.quantity,
    mer_name: goodsDetail.value?.storeInfo?.mer_name,
    goods_address: goodsDetail.value?.storeInfo?.goods_address
  }

  // 存储订单数据到pinia
  goodsCartsTableStore.reGoodsCartsTable([orderData])

  // 跳转到支付页面
  router.push({
    path: '/payorder',
    query: {
      type: 'direct', // 标记为直接购买
      id: detailId,
      num: selectedInfo.value.quantity,
      color: selectedInfo.value.color,
      size: selectedInfo.value.size
    }
  })
}

// 加入购物车
const hanldeAddToCart = () => {
  console.log('jiarugouwuche')

  // addGoodsToCart({ })
}


// 放大镜相关
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
  const scale = 2

  const halfLayer = layerSize / 2
  left.value = Math.max(halfLayer, Math.min(elementX.value, containerWidth - halfLayer)) - halfLayer
  top.value = Math.max(halfLayer, Math.min(elementY.value, containerHeight - halfLayer)) - halfLayer

  positionX.value = -(left.value / containerWidth) * (800 - 400)
  positionY.value = -(top.value / containerHeight) * (800 - 400)
})

// 滚动检测
const { y: scrollYval } = useScroll(el, { behavior: 'auto' })
watch([scrollYval], () => {
  const floatOrder = document.querySelector('.float_order')
  if (scrollYval.value >= 600) {
    floatOrder?.classList.add('show')
  } else {
    floatOrder?.classList.remove('show')
  }
})

const followStore = () => {
  console.log('关注店铺')
  // 可以在这里添加你的关注逻辑
}

// 复制手机号
const copyPhone = (source: any) => {
  const { copy } = useClipboard({ source, legacy: true })
  copy(source)
  messageApi.success('复制成功')
}

// 获取商品详情
const { id: detailId }: any = route.params
const fetchGoodsDetail = () => {
  getProductDetail(detailId).then((res: any) => {
    if (res.status == 200) {
      console.log(res.data)
      handleColorFilter(res.data)
      goodsDetail.value = res.data
      imageBaseUrl.value = res.data.storeInfo.image_base
    } else {
      messageApi.error(res.msg)
    }
  })
}

// 处理颜色数据获取到颜色对应的图片
const handleColorFilter = (item: any) => {
  const productArray = convertToArray(item.productValue)
  const newAttrValue = getAttrImages(productArray, item.productAttr?.[0]?.attr_value)
  newAttrValueList.value = newAttrValue
  console.log(newAttrValueList.value)
}

// 处理颜色数据获取到颜色对应的图片
const getAttrImages = (productArray: any[], attrValue: any[]) => {
  return attrValue.map(item => {
    const matchProduct = productArray.find(product => product.suk.startsWith(item.attr))
    return {
      ...item,
      image: matchProduct ? matchProduct.image : ''
    }
  })
}
// 将商品详情获取到的productValue处理为数组
const convertToArray = (productValue: Record<string, any>) => {
  return Object.entries(productValue).map(([key, value]) => {
    return {
      ...value,
      suk_name: key
    }
  })
}

// 商品图片切换
const handleImgMoveOver = (item: any, index: number) => {
  imgIndex.value = index
  imageBaseUrl.value = item
}

// 时间格式化
const formatTime = (time: number) => {
  return moment(time * 1000).format('YYYY-MM-DD HH:mm')
}

// 以图搜索
const beforeUpload = (res: any) => {
  if (res.status == 200) {
    messageApi.success('上传成功,即将跳转搜索页面搜索商品')
    setTimeout(() => {
      router.push({
        path: `/search`,
        query: {
          url: res.data.url
        }
      })
    }, 1000)
  }
}

// 跳转搜索页  传参搜索关键词
const routerToSearch = () => {
  router.push({
    path: `/search`,
    query: {
      keyword: inputVal.value,
    }
  })
}

onMounted(() => {
  el.value = document.querySelector('.router-view')
  fetchGoodsDetail()
})
</script>
<style scoped src="./Merchandis.scss"></style>
<style lang="scss" scoped>
:deep(.ant-input-number-input) {
  text-align: center;
}

.store-popover-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.store-name {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  line-height: 22px;
  white-space: nowrap;
}

.follow-button {
  width: 76px;
  height: 26px;
  border-radius: 4px;
  border: 1px solid #e2e4e6;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #333333;
  line-height: 17px;
  white-space: nowrap;
  cursor: pointer;
  font-weight: 400;
}

.store-popover-content {
  padding: 10px;
}

.popover-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.item-label {
  width: 70px;
  font-size: 14px;
  color: #999999;
  white-space: nowrap;
}

.item-value {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
}

.copy-icon {
  width: 12px;
  height: 12px;
  object-fit: cover;
  cursor: pointer;
}

.kefu-icon {
  width: 18px;
  height: 18px;
  object-fit: cover;
  margin-right: -5px;
}

.divider {
  height: 1px;
  background-color: #e2e4e6;
  margin: 15px 0;
}

.store-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #999999;
}

.stat-value {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
}

.enter-store-button {
  width: 100%;
  height: 38px;
  border-radius: 5px;
  background: #f3f6f8;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  margin-top: 5px;
}

.star {
  width: 14px;
  height: 14px;
  background: #F83126;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
</style>

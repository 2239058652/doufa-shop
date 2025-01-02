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
                <Popover @beforeUpload="beforeUpload" :fileList="fileList" />
              </div>
              <div @click="$router.push('/search')"><span>搜索</span></div>
              <div><span>搜本店</span></div>
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
          height: '340px',
          borderRadius: '12px'
        }" :overlayStyle="{ paddingRight: '', paddingTop: '10px' }" :arrow="false">
          <template #content>
            <div class="store_pop">
              <div class="pop_item" style="margin-top: 20px">
                <span class="pop_name">综合评分：</span>
                <span class="pop_name_1">4.6</span>
              </div>
              <div class="pop_item">
                <span class="pop_name">联系方式：</span>
                <span class="pop_name_1">{{ phone }}</span>
                <img style="width: 12px; height: 12px; object-fit: cover;cursor: pointer;"
                  src="../../assets/image/copy.png" alt="" @click="copyPhone(phone)" />
              </div>
              <div class="pop_item">
                <span class="pop_name">客 服：</span>
                <img style="width: 18px; height: 18px; object-fit: cover; margin-right: -5px"
                  src="../../assets/image/kefu-icon.png" alt="" />
                <span class="pop_name_1">在线客服</span>
              </div>
              <div class="woshiyitiaoxian"></div>
              <div style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 48px;
                  margin-top: 20px;
                ">
                <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 1px;
                  ">
                  <div class="pop_name1">评分</div>
                  <div class="pop_name2">4.6</div>
                </div>
                <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 1px;
                  ">
                  <div class="pop_name1">退货率</div>
                  <div class="pop_name2">3%</div>
                </div>
                <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 1px;
                  ">
                  <div class="pop_name1">缺货率</div>
                  <div class="pop_name2">3%</div>
                </div>
              </div>
              <div style="
                  width: 222px;
                  height: 38px;
                  border-radius: 5px;
                  background: #f3f6f8;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  cursor: pointer;
                  position: absolute;
                  top: 215px;
                  right: -12px;
                " @click="$router.push('/merhome')">
                <span style="
                    width: 72px;
                    height: 25px;
                    font-weight: bold;
                    font-size: 18px;
                    color: #333333;
                    line-height: 25px;
                  ">进入店铺</span>
              </div>
            </div>
          </template>
          <template #title>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 55px">
              <span style="
                  width: 96px;
                  height: 22px;
                  font-weight: bold;
                  font-size: 16px;
                  color: #333333;
                  line-height: 22px;
                ">慢慢家男装店</span>
              <span style="
                  width: 76px;
                  height: 26px;
                  border-radius: 4px;
                  border: 1px solid #e2e4e6;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                ">
                <span style="
                    width: 50px;
                    height: 17px;
                    font-weight: 400;
                    font-size: 12px;
                    color: #333333;
                    line-height: 17px;
                    white-space: nowrap;
                    cursor: pointer;
                  ">+关注店铺</span>
              </span>
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
              4.6
              <div class="star" v-for="(item, index) in 4" :key="index"></div>
            </div>
          </div>
          <div>退货率3%</div>
          <div>缺货率93%</div>
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
                  <div class="jian" @click="caculateGoodsNum('reduce')">-</div>
                </template>
                <template #addonAfter>
                  <div class="jia" @click="caculateGoodsNum('add')">+</div>
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
              <div @click="payOrderNow">
                <span>立即下单</span>
              </div>
              <div>
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
              <div>
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
import { getProductDetail } from '@/api/store'
import { message } from 'ant-design-vue'
import moment from 'moment'
import Popover from '@/components/phopopover/index.vue' // 以图搜索
import { useClipboard } from '@vueuse/core'

// 商品详情框检测滚动浮现出来
const el = ref<HTMLElement | null>(null)
const { y: scrollYval } = useScroll(el, { behavior: 'auto' })
watch([scrollYval], () => {
  const floatOrder = document.querySelector('.float_order')
  floatOrder?.classList.add('show')
  if (scrollYval.value >= 600) {
    floatOrder?.classList.add('show')
  } else {
    floatOrder?.classList.remove('show')
  }
})
onMounted(() => {
  el.value = document.querySelector('.router-view')
})

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
const router = useRouter()

const inputVal = ref('') // 搜索框输入框
const fileList = ref([]) // 以图搜索list
const imgIndex = ref(0) // 左侧小图片列表选中的索引
const colorIndex = ref(0) // 颜色索引
const tabsIndex = ref(0) // 商品详情和代发说明tab切换
const sizeIndex = ref(0) // 尺码索引
const goodsDetailNum = ref(0) // 购买商品数量

const goodsDetail = ref<any>({}) // 商品详情
const imageBaseUrl = ref('') // 商品大图

const phone = ref('13823234343') // 手机号

// 复制手机号
const copyPhone = (source: any) => {
  const { text, copy, copied, isSupported } = useClipboard({ source, legacy: true })
  copy(source)
  messageApi.success('复制成功')
}


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
  return moment(time * 1000).format('YYYY-MM-DD HH:mm')
}

// 购物数量jian
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
}

// 立即下单
const payOrderNow = () => {
  if (goodsDetailNum.value <= 0) {
    messageApi.error('请选择商品数量！')
    return
  } else {
    router.push({
      path: '/payorder',
      query: {
        id: detailId,
        num: goodsDetailNum.value
      }
    })
  }
}

// 以图搜索
const beforeUpload = (file: any) => {
  console.log(file, 'aaaaaaaaaa')
}

fetchGoodsDetail()
</script>

<style scoped src="./Merchandis.scss"></style>
<style scoped lang="scss">
.store_pop {
  margin: 0 29px;
  position: relative;
}

.pop_item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.pop_name {
  width: 70px;
  height: 20px;
  font-weight: 400;
  font-size: 14px;
  color: #999999;
  line-height: 20px;
}

.pop_name_1 {
  height: 20px;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
}

.woshiyitiaoxian {
  width: 221px;
  height: 1px;
  border: 1px solid #e2e4e6;
}

.pop_name1 {
  width: 42px;
  height: 20px;
  font-weight: 400;
  font-size: 14px;
  color: #999999;
  line-height: 20px;
}

.pop_name2 {
  width: 27px;
  height: 25px;
  font-weight: 500;
  font-size: 18px;
  color: #333333;
  line-height: 25px;
}
</style>

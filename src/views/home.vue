<template>
  <context-holder />
  <div class="home">
    <!-- 顶部搜索 框 功能区 -->
    <div class="top-func">
      <!-- LOGO区域 -->
      <div class="func-img">
        <a href="/">
          <img src="../assets/image/logo.png" alt="" />
        </a>
      </div>
      <!-- 地址选择区 -->
      <div class="func-address">
        <div class="address-name">【济南】</div>
        <div class="address-tab">切换地址</div>
      </div>
      <!-- 搜索区域 -->
      <div class="func-sou">
        <div class="func-sou-input">
          <!-- 搜索输入框 -->
          <a-input v-model:value="inputVal" :bordered="false" placeholder="请搜索产品名称、货号">
            <template #prefix>
              <a-select :bordered="false" v-model:value="selectVal">
                <a-select-option value="jack">宝贝货号</a-select-option>
                <a-select-option value="lucy">档口搜索</a-select-option>
              </a-select>
            </template>
            <template #suffix>
              <div class="func-sou-suffix">
                <div class="photo-sou">
                  <img src="../assets/image/photo.png" alt="识图" />
                </div>
                <div class="sousuo-btn">
                  <span>搜索</span>
                </div>
              </div>
            </template>
          </a-input>
        </div>
        <!-- 热门搜索标签 -->
        <div class="func-sou-type">
          <div class="hot-type">
            <span :class="{ active: activeIndex === index }" v-for="(item, index) in hotSouTypeList" :key="index"
              @click="activeIndex = index">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
      <!-- 购物车 -->
      <div class="func-car">
        <div class="car-top">
          <span class="cart-count">{{ Number(cartCount) > 99 ? '99+' : cartCount }}</span>
        </div>
        <div class="car-bottom">
          <img src="../assets/image/shopcar.png" alt="" />
          <div class="shop-car">购物车</div>
        </div>
      </div>
    </div>
    <!-- 主要内容区 -->
    <div class="shop-sort">
      <!-- 左侧分类导航 -->
      <div class="s-s-left">
        <!-- 分类标题 -->
        <div class="shops-title">
          <span>商品分类</span>
          <img src="../assets/image/weitu.png" alt="" />
        </div>
        <!-- 商品分类 --> <!-- 分类列表 -->
        <div class="shop-cate">
          <a-skeleton :loading="categoryList.length == 0" active>
            <div class="cate-item" v-for="item in categoryList" :key="item.id">
              <div class="item-left">
                <img src="../assets/image/fenlei.png" alt="" />
              </div>
              <a-popover :title="item.cate_name" placement="right"
                :overlayInnerStyle="{ width: '612px', height: '446px' }">
                <div class="item-right">
                  <div class="text-line">
                    <span v-for="(v, index) in item.children.slice(0, 3)" :key="v.id">
                      {{ v.cate_name }}
                      {{ index !== 2 ? ' ' : '' }}
                    </span>
                  </div>
                  <div class="text-line">
                    <span v-for="(v, index) in item.children.slice(4, 7)" :key="v.id">
                      {{ v.cate_name }}
                      {{ index !== 2 ? ' ' : '' }}
                    </span>
                  </div>
                </div>
                <template #content>
                  <div class="popover-content">
                    <div class="content-row">
                      <div v-for="i in item.children" :key="i.id" class="content-item">
                        {{ i.cate_name }}
                      </div>
                    </div>
                  </div>
                </template>
              </a-popover>
            </div>
          </a-skeleton>

        </div>
      </div>
      <!-- 中间内容区 -->
      <div class="s-s-middle">
        <!-- 顶部导航 -->
        <div class="m-t">
          <div class="active">
            <span>抖发首页</span>
          </div>
          <div>
            <span class="">爆款专区</span>
            <img src="../assets/image/mail.png" class="badge" />
          </div>
          <div>
            <span>礼品代发</span>
            <img src="../assets/image/gift.png" class="badge" />
          </div>
          <div>
            <span>热门排行</span>
          </div>
          <div>
            <span>搜图搜款</span>
          </div>
        </div>
        <!-- 轮播图 -->
        <div class="m-m">
          <a-skeleton v-if="bannerList.length == 0" active />
          <a-carousel arrows autoplay>
            <template #prevArrow>
              <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                <left-circle-outlined />
              </div>
            </template>
            <template #nextArrow>
              <div class="custom-slick-arrow" style="right: 10px">
                <right-circle-outlined />
              </div>
            </template>
            <div v-for="(item, index) in bannerList" :key="index">
              <a>
                <img :src="item.image_input" />
              </a>
            </div>
          </a-carousel>
        </div>
        <!-- 底部banner -->
        <div class="m-b">
          <a-skeleton v-if="bannerActiveList.length == 0" active />
          <div v-for="(x, index) in bannerActiveList" :key="index">
            <a>
              <img :src="x.image_input" />
            </a>
          </div>
        </div>
      </div>
      <!-- 右侧内容区 -->
      <div class="s-s-right">

        <!-- 登录之后展示的个人信息部分 -->
        <div class="r-t">
          <div class="r-t-l">
            <div class="r-t-l-t">
              <div style="
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  gap: 8px;
                  margin-top: 20px;
                  margin-left: 13px;
                ">
                <div class="dfjp">抖发竞拍</div>
                <div class="yyqp">1元起拍</div>
              </div>
              <div style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 29px;
                  margin-top: 22px;
                ">
                <div class="chuizi"></div>
                <div class="ljcy">
                  <span>立即参与</span>
                </div>
              </div>
            </div>
            <div class="r-t-l-b">
              <div class="r-t-l-b-top">
                <div class="zngg">
                  <span>站内公告</span>
                  <img src="../assets/image/weitu.png" alt="" />
                </div>
                <div class="rightarrimg">
                  <img src="../assets/image/rightarr.png" alt="" />
                </div>
              </div>
              <div class="r-t-l-b-bottoms">
                <div>互动赢免费礼盒！双旦送礼指南来…</div>
                <div>必看！抖发年度10大商品榜单</div>
                <div>江西寻乌:以“橙”为媒 点亮乡村…</div>
                <div>乡村振兴第五期—河北张北县</div>
              </div>
            </div>
          </div>
          <div class="r-t-r" v-if="token">
            <div class="r-t-r-user">
              <div class="user-img">
                <img src="../assets/image/user.png" alt="" />
              </div>
              <div class="user-info">
                <div style="
                    width: 80px;
                    height: 21px;
                    font-size: 16px;
                    color: #333333;
                    line-height: 21px;
                    text-align: left;
                  ">慢慢家男装</div>
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #505259;
                    line-height: 16px;
                    text-align: left;
                    gap: 12px;
                  ">
                  <div style="cursor: pointer;">切换账号</div>
                  <div class="longin-out" @click="handleOutLogin">退出</div>
                </div>
              </div>
            </div>
            <div class="mid-icon">
              <div class="icon-text">
                <img src="../assets/image/tbddicon.png" alt="" />
                <span>同步订单</span>
              </div>
              <div class="icon-text">
                <img src="../assets/image/plshicon.png" alt="" />
                <span>批量上货</span>
              </div>
              <div class="icon-text">
                <img src="../assets/image/idficon.png" alt="" />
                <span>I 抖发</span>
              </div>
            </div>
            <div class="mid-status">
              <div class="status-text">
                <span>12</span>
                <span>待付款</span>
              </div>
              <div class="status-text">
                <span>12</span>
                <span>未发出</span>
              </div>
              <div class="status-text">
                <span>12</span>
                <span>待收货</span>
              </div>
              <div class="status-text">
                <span>12</span>
                <span>售后订单</span>
              </div>
            </div>
            <div class="r-t-r-qb">
              <div class="my-ballet">我的钱包</div>
              <div class="vie-mybalet">查看我的钱包</div>
            </div>
          </div>
          <!-- 登录前首页个人信息展示 -->
          <div class="userinfo-unlogin" v-else>
            <div class="userinfo-unlogin-box">
              <img src="../assets/image/user.png" alt="" />
              <div class="unlogin-info">
                <div class="unlogin-info-top">HI~欢迎来到抖发</div>
                <div class="unlogin-info-bot">找货源上抖发</div>
              </div>
            </div>
            <div class="unlogin-box">
              <div class="unlogin-box-top">登录抖发一键代发/上架</div>
              <div class="unlogin-box-bot">登录可享，专属优惠，贴心服务！</div>
            </div>
            <div class="unlogin-btn">
              <button class="btn-login" @click="handleLogin">登录</button>
              <button class="btn-register" @click="handleRegister">
                注册
              </button>
            </div>
          </div>
        </div>

        <div class="r-b"></div>
      </div>
    </div>
    <!-- 精选货源 精选货源 好评榜 礼品专区 -->
    <div class="hot-rank">
      <!-- 精选货源区域  精选货源-->
      <div class="hot-rank-item-jxhy">
        <!-- 精选货源 星级好物标题 -->
        <div class="hot-jingxuan">
          <div class="jx-img">
            <img src="../assets/image/vipicon.png" alt="" />
            <span>精选货源</span>
          </div>
          <div class="jx-xjhpicon">
            <img src="../assets/image/xjhpicon.png" alt="" />
          </div>
        </div>
        <!-- 商品轮播图 -->
        <div class="swiper-container">
          <div class="swiper-item">
            <!-- 热销左上角热销图标 -->
            <div class="rexiao-icon"></div>
            <!-- 商品图片 -->
            <div class="shangpin-img">
              <img src="../assets/static/shopimg.png" alt="" />
            </div>
            <!-- 价格货号等 -->
            <div class="shangpin-name">M-8XL美式潮牌工装裤男秋</div>
            <div class="shangpin-huohao">货号：32589</div>
            <div class="shangpin-jiage"><span>¥</span>23.20</div>
          </div>
        </div>
        <div class="swiper-container-l">
          <div class="swiper-item">
            <!-- 热销左上角热销图标 -->
            <div class="rexiao-icon"></div>
            <!-- 商品图片 -->
            <div class="shangpin-img">
              <img src="../assets/static/shopimg.png" alt="" />
            </div>
            <!-- 价格货号等 -->
            <div class="shangpin-name">M-8XL美式潮牌工装裤男秋</div>
            <div class="shangpin-huohao">货号：32589</div>
            <div class="shangpin-jiage"><span>¥</span>23.20</div>
          </div>
        </div>
        <div class="swiper-container-r">
          <div class="swiper-item">
            <!-- 热销左上角热销图标 -->
            <div class="rexiao-icon"></div>
            <!-- 商品图片 -->
            <div class="shangpin-img">
              <img src="../assets/static/shopimg.png" alt="" />
            </div>
            <!-- 价格货号等 -->
            <div class="shangpin-name">M-8XL美式潮牌工装裤男秋</div>
            <div class="shangpin-huohao">货号：32589</div>
            <div class="shangpin-jiage"><span>¥</span>23.20</div>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="djck">
          <span>点击查看</span>
          <img src="../assets/image/whitearrow.png" alt="" />
        </div>
      </div>
      <!-- 热销榜 -->
      <div class="hot-rank-item-rx">
        <!-- 标题部分 -->
        <div class="hot-rexiao">
          <div class="rxb-img">
            <span>热销榜</span>
            <img src="../assets/image/ph.gif" alt="" />
          </div>
          <div class="rxb-icon">
            <img src="../assets/image/redarrow.png" alt="" />
          </div>
        </div>
        <!-- 商品总区域部份 要滚动 -->
        <div class="hot-swiper">
          <!-- 单个商品区域 -->
          <div class="hot-swiper-item" v-for="(item, index) in 5" :key="index">
            <div class="h-s-i-left">
              <img src="../assets/static/rexiaoimg2.png" alt="" />
            </div>
            <div class="h-s-i-right">
              <div>M-8XL美式潮牌工装裤男秋</div>
              <div>货号：32589</div>
              <div>3211人已购买</div>
              <div><span>¥</span>23.20</div>
            </div>
          </div>
        </div>
      </div>
      <div class="hot-rank-item-hp">
        <!-- 标题部分 -->
        <div class="hot-hp">
          <div class="hp-title">
            <div>好评榜</div>
            <div>精品荟萃 口碑俱佳</div>
          </div>
          <div class="hp-icon">
            <img src="../assets/image/redarrow.png" alt="" />
          </div>
        </div>
        <!-- 好评商品 -->
        <div class="hp-content">
          <div class="hot-item" v-for="(item, index) in hplist" :key="index">
            <div class="hot-item-left">
              <img :src="item.url" alt="" />
            </div>
            <div class="hot-item-right">
              <div>M-8XL美式潮牌工装裤男秋</div>
              <div>货号：32589</div>
              <div>3211人已购买</div>
              <div><span>¥</span>23.20</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 礼品专区 -->
      <div class="hot-rank-item-gift">
        <!-- 标题部分 -->
        <div class="gift-title">
          <div class="gift-title">
            <div>礼品专区</div>
            <div>起店专用</div>
          </div>
          <div class="gift-icon">
            <img src="../assets/image/pinkarrow.png" alt="" />
          </div>
        </div>
        <!-- 礼品商品 -->
        <div class="gift-content">
          <div class="gift-item" v-for="(item, index) in 4" :key="index">
            <div>
              <img src="../assets/static/paper.png" alt="" />
            </div>
            <div>330抽纸巾一包</div>
            <div>
              <span>¥</span>
              <span>23.20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 热销商家 优质商家 信誉商家  -->
    <div class="hot-merchants">
      <!-- 热销商家 -->
      <div class="hot-merch-rxsj">
        <!-- 顶部logo -->
        <div class="rx-top">
          <div class="rx-title">
            <div class="rxsj">热销商家</div>
            <div class="rx-title-three">
              <div>高销量</div>
              <div>高评分</div>
              <div>热门商家</div>
            </div>
          </div>
          <img src="../assets/image/rxsjicon.png" alt="" />
        </div>
        <!-- 商家列表 -->
        <div class="rx-user">
          <div v-for="(item, index) in rxsjList" @click="rxsjActiveIndex = index" :key="index"
            :class="{ active: rxsjActiveIndex === index }">
            {{ item }}
          </div>
        </div>
        <!-- 商品列表 -->
        <div class="rx-goods" v-for="(item, index) in 3" :key="index">
          <div class="goods-item">
            <!-- 商品图 -->
            <div class="rx-goods-img">
              <img src="../assets/static/goods.png" alt="" />
            </div>
            <!-- 商品名称价格等信息 -->
            <div class="rx-goods-info">
              <div>M-8XL美式潮牌工装裤男秋冬款加绒加厚宽松潮…</div>
              <div>货号：32589</div>
              <div>
                <span>¥</span>
                <span>23.20</span>
                <span>3211人已购买</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 优质商家 -->
      <div class="hot-merch-yzsj">
        <!-- 标题 -->
        <div class="title">
          <span>优质商家</span>
          <span>高品质货源</span>
        </div>
        <div class="content">
          <div class="table-label">
            <div>档口信息</div>
            <div>商品量</div>
            <div>操作</div>
          </div>
          <div class="table-content">
            <div v-for="(item, index) in 5" :key="index" class="table-c-item">
              <!-- 档口信息 -->
              <div class="column-1">
                <img src="../assets/static/yzsjimg.png" alt="" />
                <div class="info">
                  <div>沃德男装</div>
                  <div>站点：常熟</div>
                </div>
              </div>
              <!-- 商品量 -->
              <div class="column-2">2980</div>
              <div class="column-3">
                <span>进入店铺</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 信誉商家 -->
      <div class="hot-merch-xysj">
        <!-- 标题 -->
        <div class="xy-title">
          <span>信誉商家</span>
          <span>极速售后</span>
        </div>
        <div class="xy-content">
          <div v-for="(item, index) in 3" :key="index" class="table-xy-item">
            <div class="xy-c-title">沃德男装</div>
            <!-- 商品信息 -->
            <div class="xysj-info">
              <div class="info-left">
                <div v-for="(i, index) in 4" :key="index" class="left-item">
                  <img src="../assets/static/wode.png" alt="" />
                  <div class="xy-price">
                    <span>¥</span>
                    <span>23.20</span>
                  </div>
                </div>
              </div>
              <div class="info-right">
                <img src="../assets/image/rightarr.png" alt="" />
                <div>99+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 优质货源 -->
    <div class="quality-source">
      <div class="q-s-title">
        <div>
          <span>优质货源</span>
          <img src="../assets/image/qsicon.png" alt="" />
        </div>
        <div>Quality source</div>
      </div>
      <a-skeleton :loading="productsList.length === 0" active>
        <!-- 商品列表 -->
        <div class="q-s-content">
          <div class="q-s-item" v-for="item in productsList" :key="item.id">
            <div class="img-content">
              <img :src="item.image" alt="" />
            </div>
            <div class="store_name">{{ item.store_name }}</div>
            <div class="keyword">货号: &nbsp;{{ item.keyword }}</div>
            <div class="price">
              <span>¥</span>
              <span>{{ item.price }}</span>
              <span>{{ item.sales }}人已购买</span>
            </div>
          </div>
        </div>
      </a-skeleton>
    </div>

    <div v-if="loading" class="spin-loading">
      <a-spin tip="加载中..." :delay="200" />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '@/components/footer/index.vue'
import { debounce } from '@/utils/util'
import { onMounted, onUnmounted, ref, inject } from 'vue'
import { getCategory, getBanner, getProducts } from '@/api/store'
import { message } from 'ant-design-vue'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue'
import photo1 from '../assets/static/photo.png'
import photo2 from '../assets/static/photo1.png'

const [messageApi, contextHolder] = message.useMessage()

const loginOut = inject('loginOut') as any  // 获取退出登录弹窗
const loginModalRef = inject('loginModalRef') as any  // 获取退出登录弹窗
const registerModalRef = inject('registerModalRef') as any  // 获取退出登录弹窗

const inputVal = ref('')
const selectVal = ref('jack')
const hotSouTypeList = ref(['2024', 'T恤', '毛衣', '牛仔裤', '羽绒服'])
const rxsjList = ref(['薰衣草小熊猫', '橘子男装', '橘子男装'])
const activeIndex = ref(0)
const rxsjActiveIndex = ref(0)
const cartCount = ref(113)
const loading = ref(false)
const productsList = ref<any>([])
const page = ref(1)
const token = localStorage.getItem('token')

// 使用防抖包装滚动处理函数
const handleScroll = debounce((e: Event) => {
  const target = e.target as HTMLElement
  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
    getProductsList()
  }
}, 200) // 200ms的防抖延迟

onMounted(() => {
  const routerView = document.querySelector('.router-view')
  if (routerView) {
    routerView.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  const routerView = document.querySelector('.router-view')
  if (routerView) {
    routerView.removeEventListener('scroll', handleScroll)
  }
})
// 好评商品列表
const hplist = ref([
  {
    url: photo1,
    id: 1
  },
  {
    url: photo2,
    id: 2
  }
])

const categoryList = ref<any>([])
const bannerList = ref<any>([])
const bannerActiveList = ref<any>([])
const currentIndex = ref(1)
setInterval(() => {
  if (currentIndex.value > 5) {
    currentIndex.value = 1
    return
  }
  currentIndex.value++
}, 1000)

// 获取分类列表
const getCategoryList = () => {
  getCategory().then((res: any) => {
    if (res.status == 200) {
      categoryList.value = res.data
    } else {
      messageApi.error(res.msg)
    }
  })
}
// 获取轮播数据
const getBannerList = async () => {
  const res = await getBanner(1)
  const response = await getBanner(0)
  bannerList.value = res.data
  bannerActiveList.value = response.data
}

// 获取商品列表
const getProductsList = () => {
  loading.value = true
  if (page.value > 6) {
    loading.value = false
    return
  }
  getProducts({ page: page.value, limit: 18 }).then((res: any) => {
    if (res.status == 200) {
      productsList.value = [...productsList.value, ...res.data.list]
      loading.value = false
      page.value++
    } else {
      messageApi.error(res.msg)
    }

  })
}


// 登录
const handleLogin = () => {
  loginModalRef.value.setModalInit(true)
}

// 注册
const handleRegister = () => {
  registerModalRef.value.setRegisModalInit(true, 'zhuce')
}

// 退出登录
const handleOutLogin = () => {
  loginOut.value = true
}

getBannerList()
getCategoryList()
getProductsList()
</script>

<style src="./home.scss" scoped></style>
<style scoped>
/* 轮播图修改圆角 */
:deep(.slick-list) {
  border-radius: 10px;
}

:deep(.slick-slide) {
  text-align: center;
  height: 100%;
  width: 100%;
  line-height: 324px;
  overflow: auto;
}

:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}

:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.5;
}

:deep(.slick-slide h3) {
  color: #fff;
}


.longin-out {
  cursor: pointer;

  &:hover {
    color: #000;
  }
}
</style>

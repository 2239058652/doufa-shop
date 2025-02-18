<template>
  <context-holder />
  <div class="home">
    <!-- 顶部搜索 框 功能区 -->
    <div class="top-func">
      <!-- LOGO区域 -->
      <div class="func-img">
        <a href="/">
          <img src="../../assets/image/logo.png" alt="" />
        </a>
      </div>
      <!-- 地址选择区 -->
      <div class="func-address" @click="handleAddressChange">
        <div class="address-name">【{{ selectAddressVal }}】</div>
        <div class="address-tab">切换地址</div>
      </div>
      <!-- 搜索区域 -->
      <div class="func-sou">
        <div class="func-sou-input">
          <!-- 搜索输入框 -->
          <a-input
            v-model:value="inputVal"
            :bordered="false"
            :placeholder="selectVal == 'product' ? '请搜索产品名称、货号' : '请搜索商家名称'"
            style="width: 100%; height: 100%"
            @pressEnter="handleSearchByInput"
          >
            <template #prefix>
              <div>
                <a-select :bordered="false" v-model:value="selectVal" @change="inputVal = ''">
                  <a-select-option value="product">宝贝货号</a-select-option>
                  <a-select-option value="stall">档口搜索</a-select-option>
                </a-select>
              </div>
            </template>
            <template #suffix>
              <div class="func-sou-suffix">
                <div class="photo-sou">
                  <!-- 以图搜索封装组件 -->
                  <Popover @beforeUpload="beforeUpload" v-model:open="photoPopoverVisible" />
                </div>
                <div class="sousuo-btn" @click="handleSearchByInput">
                  <span>搜索</span>
                </div>
              </div>
            </template>
          </a-input>
        </div>
        <!-- 热门搜索标签 -->
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
      <!-- 购物车 -->
      <div class="func-car">
        <div class="car-top">
          <span class="cart-count">{{ Number(cartCount) > 99 ? '99+' : cartCount }}</span>
        </div>
        <div class="car-bottom" @click="$router.push('/shoppingcart')">
          <img src="../../assets/image/shopcar.png" alt="" />
          <div class="shop-car">购物车</div>
        </div>
      </div>
    </div>

    <!-- 分类区域 -->
    <div class="fenlei" v-show="showGoodsOrDangKou">
      <div v-for="item in categoryList" :key="item.id" class="cate_item">
        <div class="main_cate_name">{{ item.cate_name }}</div>
        <div class="cate_item_list">
          <div
            class="cate_name_item"
            v-for="i in item.children"
            :class="{ active: selectCateIdVal == i.id }"
            :key="i.id"
            @click="handleCateClick(i)"
          >
            {{ i.cate_name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="shangpin" v-show="showGoodsOrDangKou">
      <div class="shangpin_tabs">
        <div class="sp_tabs_item">
          <span :class="tabsIndex == '' ? 'active' : ''" @click="handleTabsClick('')">综合</span>
          <span :class="tabsIndex == 'desc' ? 'active' : ''" @click="handleXiaoLiang">销量</span>
          <a-dropdown :trigger="['click']">
            <span :class="tabsIndex == 2 ? 'active' : ''" @click="tabsIndex = 2">
              <span>价格 {{ priceSortText }}</span>
              <img src="../../assets/image/head-bot.png" alt="" />
            </span>
            <template #overlay>
              <a-menu selectable @select="handlePriceSort">
                <a-menu-item key="desc">
                  <span>从高到低</span>
                </a-menu-item>
                <a-menu-item key="asc">
                  <span>从低到高</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <span @click="tabsIndex = 3">
            <div>区间</div>
            <div>
              <a-input
                type="number"
                style="width: 100%; height: 100%"
                v-model:value="zuiDiVal"
                placeholder="最低价"
                :bordered="false"
                @pressEnter="getProductsList"
              >
                <template #prefix>
                  <span>¥</span>
                </template>
              </a-input>
            </div>
            <div>
              <a-input
                type="number"
                style="width: 100%; height: 100%"
                v-model:value="zuiGaoVal"
                placeholder="最高价"
                :bordered="false"
                @pressEnter="getProductsList"
              >
                <template #prefix>
                  <span>¥</span>
                </template>
              </a-input>
            </div>
          </span>
        </div>

        <div class="sp_tabs_pagination">
          <img
            src="../../assets/image/toleft.png"
            alt=""
            @click="handleTopPagination(Math.max(1, currentPage - 1))"
            :class="{ disabled: currentPage <= 1 }"
          />
          <span>
            <span>{{ currentPage }}</span>
            <span style="color: #333333">/{{ Math.ceil(total / pageSize) }}</span>
          </span>
          <img
            src="../../assets/image/toright.png"
            alt=""
            @click="handleTopPagination(Math.min(Math.ceil(total / pageSize), currentPage + 1))"
            :class="{ disabled: currentPage >= Math.ceil(total / pageSize) }"
          />
        </div>
      </div>
      <br />
      <div class="woshiyitiaoxian"></div>
      <a-skeleton :loading="productsListLoading" active>
        <!-- 商品列表 -->
        <div class="q-s-content">
          <div class="q-s-item" v-for="item in productsList" :key="item.id" @click="routerToDetail(item)">
            <div class="img-content">
              <img :src="item.image" alt="" />
            </div>
            <div class="store_name">{{ item.store_name }}</div>
            <div class="keyword">货号: &nbsp;{{ item.keyword }}</div>
            <div class="price">
              <span>¥</span>
              <span>{{ item.ot_price }}</span>
              <span>{{ item.sales }}人已购买</span>
            </div>
          </div>
        </div>
        <a-empty v-if="productsList.length === 0" />
      </a-skeleton>
    </div>

    <!-- 店铺列表 -->
    <div class="dianpu" v-show="!showGoodsOrDangKou">
      <a-empty v-if="SystemAdminList.length == 0" />
      <div class="aempty" v-if="SystemAdminList.length == 0"></div>
      <div class="dp_item" v-for="item in SystemAdminList" :key="item.id">
        <div class="dp_item_l">
          <img :src="item.head_pic" alt="item.real_name" />
          <div class="dp_item_img_r">
            <div class="real_name">{{ item.real_name }}</div>
            <div class="zhuying">{{ '主营：男装' }}</div>
            <div class="dianpu_salse">
              <span class="sp_jianshu">商品(件)：</span>
              <span class="sp_sales"> {{ item.sales }}</span>
            </div>
            <div class="dianpu_btn">
              <div class="btn_1">
                <span>进店</span>
              </div>
              <div class="btn_2">
                <img src="../../assets/image/add.png" alt="" />
                <span>关注店铺</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dp_item_r"></div>
      </div>
    </div>
    <Pagination
      v-model:current="currentPage"
      v-model:pageSize="pageSize"
      :total="total"
      @change="getProductsList"
      :pageSizeOptions="showGoodsOrDangKou ? pageSizeGoodsOptions : pageSizeDangKouOptions"
    />
  </div>
</template>

<script setup lang="tsx">
import { computed, h, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAddressRegion, getCategory, getProducts, getCartCount, getSystemAdmin } from '@/api/store'
import { message, Modal } from 'ant-design-vue'
import Pagination from '@/components/pagination/index.vue'
import Popover from '@/components/PhotoPopver/index.vue' // 以图搜索
import './Search.scss'
import { debounce } from '@/utils/util'

const router = useRouter()
const route = useRoute()

const [messageApi, contextHolder] = message.useMessage()

const productsListLoading = ref(true) // 商品列表加载状态
const photoPopoverVisible = ref(false) //  以图搜索弹窗显示状态

const addressList = ref<any>([]) // 地址列表
const selectAddressVal = ref<string>('全部') // 地址选择
const selectCateIdVal = ref<string | any>(route.query.sid || '') //  分类选择,如果路由传值就用路由传的值
const photoSearchUrl = ref<string | any>(route.query.url || '') //  以图搜图传的图片url,如果路由传值就用路由传的值

const inputVal = ref<any>(route.query.keyword || '') // 搜索框输入值
const selectVal = ref<string>((route.query.selectVal as string) || 'product') // 下拉框选择值
const hotSouTypeList = ref(['2024', 'T恤', '毛衣', '牛仔裤', '羽绒服']) // 热门搜索标签
const activeIndex = ref(0) // 热门搜索标签选中状态
const tabsIndex = ref<string | number>('') // 商品列表tab切换
const cartCount = ref(0) // 购物车商品数量
const token = localStorage.getItem('token')
const priceSort = ref('')
const zuiDiVal = ref('')
const zuiGaoVal = ref('')

const categoryList = ref<any>([]) // 分类列表
const productsList = ref<any>([]) // 商品列表
const SystemAdminList = ref<any>([]) // 商家档口列表
const showGoodsOrDangKou = ref<boolean>(true) // 显示商品还是档口
const pageSizeGoodsOptions = ref([24, 48, 72, 96, 120]) // 分页器每页条数
const pageSizeDangKouOptions = ref([3, 5, 10, 20, 30, 50]) // 分页器每页条数
const currentPage = ref(1) // 当前页码
const pageSize = ref(24) // 每页条数
const total = ref(0) // 总条数

// 价格排序文本显示
const priceSortText = computed(() => {
  if (priceSort.value === 'desc') return '(从高到低)'
  if (priceSort.value === 'asc') return '(从低到高)'
  return ''
})

// 商品综合切换 点击综合清空其它选项
const handleTabsClick = (key: string | number) => {
  photoSearchUrl.value = ''
  tabsIndex.value = key
  priceSort.value = ''
  zuiDiVal.value = ''
  zuiGaoVal.value = ''
  getProductsList()
}
// 销量排序
const handleXiaoLiang = () => {
  photoSearchUrl.value = ''
  tabsIndex.value = 'desc'
  priceSort.value = ''
  zuiDiVal.value = ''
  zuiGaoVal.value = ''
  getProductsList()
}

// 处理价格排序
const handlePriceSort = (sel: any) => {
  photoSearchUrl.value = ''
  priceSort.value = sel.key
  zuiDiVal.value = ''
  zuiGaoVal.value = ''
  getProductsList()
}

// 以图搜索
const beforeUpload = (res: any) => {
  if (res.status == 200) {
    messageApi.success('上传成功,正在搜索...')
    photoSearchUrl.value = res.data.url
    tabsIndex.value = ''
    priceSort.value = ''
    zuiDiVal.value = ''
    zuiGaoVal.value = ''
    getProductsList()
  }
}

// 跳转商品详情
const routerToDetail = (item: any) => {
  router.push({
    path: `/merchandis/${item.id}`
  })
}

// 顶部箭头页码改变
const handleTopPagination = (page: number) => {
  // 当页码数不能再减少时或再加时，不再执行
  if (currentPage.value == page) {
    return
  }

  currentPage.value = page
  getProductsList()
}

// 获取分类列表
const getCategoryList = () => {
  if (selectVal.value == 'product') {
    getCategory({ city_name: selectAddressVal.value }).then((res: any) => {
      if (res.status == 200) {
        categoryList.value = res.data
      } else {
        messageApi.error(res.msg)
      }
    })
  }
}

// 获取商品列表
const getProductsList = () => {
  // 仅在初次切换搜索类型时设置默认分页大小
  if (selectVal.value === 'product' && !pageSizeGoodsOptions.value.includes(pageSize.value)) {
    pageSize.value = 24
    currentPage.value = 1
  } else if (selectVal.value === 'stall' && !pageSizeDangKouOptions.value.includes(pageSize.value)) {
    pageSize.value = 3
    currentPage.value = 1
  }

  if (selectVal.value == 'product') {
    showGoodsOrDangKou.value = true
    productsListLoading.value = true
    getProducts({
      page: currentPage.value,
      limit: pageSize.value,
      goods_address: selectAddressVal.value,
      sid: selectCateIdVal.value,
      keyword: inputVal.value,
      url: photoSearchUrl.value,
      salesOrder: tabsIndex.value == 'desc' ? 'desc' : '',
      priceOrder: priceSort.value,
      star_price: zuiDiVal.value,
      end_price: zuiGaoVal.value
    })
      .then((res: any) => {
        if (res.status == 200) {
          productsList.value = res.data.list
          total.value = res.data.count
          productsListLoading.value = false
        } else {
          messageApi.error(res.msg)
        }
      })
      .finally(() => {
        productsListLoading.value = false
      })
  } else {
    showGoodsOrDangKou.value = false
    getSystemAdmin({
      page: currentPage.value > 0 ? currentPage.value - 1 : currentPage.value,
      limit: pageSize.value,
      name: inputVal.value
    }).then((res: any) => {
      console.log(res)
      SystemAdminList.value = res.data.list
      total.value = res.data.count.list
    })
  }
}

// 分类选择变化  当切换分类的时候把输入框的值置为空, 再点击一次就可以取消选中
const handleCateClick = (item: any) => {
  photoSearchUrl.value = ''
  if (item.id == selectCateIdVal.value) {
    selectCateIdVal.value = ''
  } else {
    selectCateIdVal.value = item.id
    inputVal.value = ''
  }
}

// 搜索框输入  当点击搜索的时候把分类选中的项置为空，如果分类选中的项不为空，则把分类选中的项置为空，否则直接请求接口，因为watch监听了分类选中项
// 使用防抖防止频繁请求
const handleSearchByInput = debounce(() => {
  photoSearchUrl.value = ''
  if (inputVal.value !== '') {
    if (selectCateIdVal.value == '') {
      getProductsList()
    } else {
      selectCateIdVal.value = ''
    }
  } else {
    if (selectVal.value == 'product') {
      getProductsList()
    }
  }
}, 300)

// 切换地址
const handleAddressChange = () => {
  Modal.confirm({
    title: h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
      [h('span', '选择地址')]
    ),
    icon: null,
    footer: null,
    width: '40%',
    closable: true,
    maskClosable: true,
    content: () => {
      return h(
        'div',
        { class: 'address-container' },
        addressList.value.map((item: { address_name: string }, index: any) =>
          h(
            'div',
            {
              key: index,
              class: `address-item ${selectAddressVal.value == item.address_name ? 'active' : ''}`,
              onClick: handleAddressConfirm(item)
            },
            [h('span', item.address_name)]
          )
        )
      )
    }
  })
}

// 选择地址  当切换地址把分类选中项置为空，输入框的值置为空，然后请求接口
const handleAddressConfirm = (item: any) => {
  photoSearchUrl.value = ''
  return () => {
    selectCateIdVal.value = ''
    inputVal.value = ''
    selectAddressVal.value = item.address_name
    Modal.destroyAll()
  }
}

// 获取地址列表
const getAddressList = () => {
  getAddressRegion().then((res: any) => {
    if (res.status == 200) {
      addressList.value = [
        { id: 0, address_name: '全部', kefu1_img: null, kefu2_img: null, name: '全部', status: 1 },
        ...res.data
      ]
    } else {
      messageApi.error(res.msg)
    }
  })
}

// 监听地址变化，地址变化时请求分类接口和底部商品列表接口，要先清空商品列表自变量
watch(
  () => selectAddressVal.value,
  () => {
    getProductsList()
    getCategoryList()
  }
)

// 当分类列表被选择时触发商品列表接口
watch(
  () => [selectCateIdVal.value],
  () => {
    getProductsList()
  }
)

// 获取购物车数量
const getGoodsCartsNum = () => {
  getCartCount().then((res: any) => {
    if (res.status == 200) {
      cartCount.value = res.data.count
    } else {
      messageApi.error(res.msg)
    }
  })
}

getGoodsCartsNum() //  获取购物车数量
getAddressList() // 获取地址列表
getCategoryList() // 获取分类列表
getProductsList() // 获取商品列表
</script>

<style src="./Search.scss" scoped></style>
<style scoped lang="scss">
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

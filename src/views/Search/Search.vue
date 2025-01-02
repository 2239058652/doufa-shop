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
      <div class="func-address">
        <div class="address-name">【济南】</div>
        <div class="address-tab">切换地址</div>
      </div>
      <!-- 搜索区域 -->
      <div class="func-sou">
        <div class="func-sou-input">
          <!-- 搜索输入框 -->
          <a-input v-model:value="inputVal" :bordered="false" placeholder="请搜索产品名称、货号"
            style="width: 100%;height: 100%;">
            <template #prefix>
              <div>
                <a-select :bordered="false" v-model:value="selectVal">
                  <a-select-option value="jack">宝贝货号</a-select-option>
                  <a-select-option value="lucy">档口搜索</a-select-option>
                </a-select>
              </div>
            </template>
            <template #suffix>
              <div class="func-sou-suffix">
                <div class="photo-sou">
                  <!-- 以图搜索封装组件 -->
                  <Popover @beforeUpload="beforeUpload" />
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
          <img src="../../assets/image/shopcar.png" alt="" />
          <div class="shop-car">购物车</div>
        </div>
      </div>
    </div>

    <!-- 分类区域 -->
    <div class="fenlei">
      <div v-for="item in categoryList" :key="item.id" class="cate_item">
        <div class="main_cate_name">{{ item.cate_name }}</div>
        <div class="cate_item_list">
          <div class="cate_name_item" v-for="i in item.children" :key="i.id">
            {{ i.cate_name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="shangpin">
      <div class="shangpin_tabs">
        <div class="sp_tabs_item">
          <span :class="tabsIndex == 0 ? 'active' : ''" @click="tabsIndex = 0">综合</span>
          <span :class="tabsIndex == 1 ? 'active' : ''" @click="tabsIndex = 1">销量</span>
          <span :class="tabsIndex == 2 ? 'active' : ''" @click="tabsIndex = 2">
            <span>价格</span>
            <img src="../../assets/image/head-bot.png" alt="" />
          </span>
          <span :class="tabsIndex == 3 ? 'active' : ''" @click="tabsIndex = 3">区间</span>
        </div>

        <div class="sp_tabs_pagination">
          <img src="../../assets/image/toleft.png" alt="" @click="handleTopPagination(Math.max(1, currentPage - 1))"
            :class="{ disabled: currentPage <= 1 }" />
          <span>
            <span>{{ currentPage }}</span>
            <span style="color: #333333;">/{{ Math.ceil(total / pageSize) }}</span>
          </span>
          <img src="../../assets/image/toright.png" alt=""
            @click="handleTopPagination(Math.min(Math.ceil(total / pageSize), currentPage + 1))"
            :class="{ disabled: currentPage >= Math.ceil(total / pageSize) }" />
        </div>

      </div>
      <br />
      <div class="woshiyitiaoxian"></div>
      <a-skeleton :loading="productsList.length === 0" active>
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
              <span>{{ item.price }}</span>
              <span>{{ item.sales }}人已购买</span>
            </div>
          </div>
        </div>
      </a-skeleton>
    </div>
    <Pagination v-model:current="currentPage" v-model:pageSize="pageSize" :total="total" @change="getProductsList" />
  </div>
</template>

<script setup lang="ts">
import { debounce } from '@/utils/util'
import { onMounted, onUnmounted, ref, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCategory, getProducts } from '@/api/store'
import { message } from 'ant-design-vue'
import Pagination from '@/components/pagination/index.vue'
import Popover from '@/components/phopopover/index.vue'  // 以图搜索

const router = useRouter()
const [messageApi, contextHolder] = message.useMessage()

const currentPage = ref(1)
const pageSize = ref(24)
const total = ref(0)


const inputVal = ref('')
const selectVal = ref('jack')
const hotSouTypeList = ref(['2024', 'T恤', '毛衣', '牛仔裤', '羽绒服'])
const activeIndex = ref(0)
const tabsIndex = ref(0)
const cartCount = ref(113)
const productsList = ref<any>([])
const token = localStorage.getItem('token')


const categoryList = ref<any>([])

// 以图搜索
const beforeUpload = (file: any) => {
  console.log(file, 'aaaaaaaaaa')
}

// 跳转商品详情
const routerToDetail = (item: any) => {
  router.push({
    path: `/detail/${item.id}`,
  })
}

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
  getCategory().then((res: any) => {
    if (res.status == 200) {
      categoryList.value = res.data
    } else {
      messageApi.error(res.msg)
    }
  })
}


// 获取商品列表
const getProductsList = () => {
  getProducts({ page: currentPage.value, limit: pageSize.value }).then((res: any) => {
    if (res.status == 200) {
      productsList.value = res.data.list
      total.value = res.data.count
    } else {
      messageApi.error(res.msg)
    }
  })
}





getCategoryList()
getProductsList()
</script>

<style src="./Search.scss" scoped></style>
<style scoped lang="scss">
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

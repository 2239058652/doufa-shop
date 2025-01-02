<template>
  <context-holder />
  <div class="merhome">
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
          <img src="../../assets/image/add.png" alt="" />
          <span>关注店铺</span>
        </div>
        <div>
          <img src="../../assets/image/kefu-icon.png" alt="" />
          <span>在线客服</span>
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
    <div style="width: 100%;height: 20px;"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getProducts } from '@/api/store'
import Pagination from '@/components/pagination/index.vue'
import Popover from '@/components/phopopover/index.vue'  // 以图搜索

const router = useRouter()
const [messageApi, contextHolder] = message.useMessage()


const route = useRoute()

const currentPage = ref(1)  // 当前页码
const pageSize = ref(24)  // 每页显示的商品数量
const total = ref(0)  // 总商品数量


const inputVal = ref('') // 搜索框输入框
const fileList = ref([])  // 以图搜索list
const tabsIndex = ref(0) // 商品tab切换
const productsList = ref<any>([])  // 商品列表
const token = localStorage.getItem('token')


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
getProductsList()
</script>


<style scoped src="./MerHome.scss"></style>

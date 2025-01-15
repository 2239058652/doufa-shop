<template>
  <context-holder />
  <div class="contain">
    <a-flex gap="20" align="center" justify="center" vertical>
      <!-- 收藏商家 -->
      <a-card style="width: 100%">
        <div class="main">
          <div class="title">收藏商家</div>
          <div class="funct">
            <a-space :size="20">
              <a-select style="width: 146px">
                <a-select-option value="jack">全部站点</a-select-option>
              </a-select>
            </a-space>
            <a-space :size="20">
              <a-input
                placeholder="请输入商家名称或站点"
                style="width: 244px"
                v-model:value="inputVal"
                @pressEnter="handleSearch"
              >
                <template #suffix>
                  <div style="cursor: pointer" @click="handleSearch">
                    <SearchOutlined />
                  </div>
                </template>
              </a-input>
            </a-space>
          </div>
          <a-skeleton :loading="loading" active>
            <!-- 商家列表 -->
            <div class="shop_main">
              <div class="shops" v-for="item in shopAtrrList" :key="item.id">
                <div class="shop_arr">
                  <a-space class="atrr">
                    <img :src="item.head_pic" alt="" />
                    <div class="atrr_name">
                      <div class="name">{{ item.real_name }}</div>
                      <div class="zhandian">站点：{{ item.city }}</div>
                    </div>
                  </a-space>
                  <a-space :size="12">
                    <div class="jindian_btn">
                      <span>进店</span>
                    </div>
                    <a-select style="width: 106px">
                      <a-select-option value="jack">关注管理</a-select-option>
                    </a-select>
                  </a-space>
                </div>
                <div class="content">
                  <div
                    class="item"
                    v-for="item in productsList.slice(0, 6)"
                    :key="item.id"
                    @click="routerToDetail(item)"
                  >
                    <div class="img-content">
                      <img :src="item.image" alt="item.image" />
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
              </div>
            </div>
            <a-empty v-if="shopAtrrList.length == 0" />
          </a-skeleton>
        </div>
      </a-card>
      <Pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="total"
        @change="getProductsList"
        :pageSizeOptions="[5, 10, 20, 30, 40, 50, 100]"
      />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getProducts, getSystemAdmin } from '@/api/store'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/pagination/index.vue'
import { SearchOutlined } from '@ant-design/icons-vue'

const [messageApi, contextHolder] = message.useMessage()
const router = useRouter()
const inputVal = ref('') // 搜索框值

const productsList = ref<any>([]) // 商品列表
const shopAtrrList = ref<any>([]) // 商家列表
const loading = ref<boolean>(false) // 商品列表
const currentPage = ref(1) // 当前页码
const pageSize = ref(5) // 每页条数
const total = ref(0) // 总条数

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  pageSize.value = 5
  getProductsList()
}

// 获取收藏列表  1. 获取收藏商品id  2. 根据id获取商品列表
const getProductsList = async () => {
  loading.value = true

  const response = await getProducts({
    page: 1,
    limit: 6
  })
  if (response.status === 200) {
    productsList.value = response.data.list
  } else {
    messageApi.error(response.msg)
  }

  const res = await getSystemAdmin({
    page: currentPage.value > 0 ? currentPage.value - 1 : currentPage.value,
    limit: pageSize.value,
    name: inputVal.value
  })
  if (res.status === 200) {
    shopAtrrList.value = res.data.list
    total.value = res.data.count.list
    loading.value = false
  } else {
    messageApi.error(res.msg)
    loading.value = false
  }
}

// 跳转商品详情
const routerToDetail = (item: any) => {
  router.push({
    path: `/merchandis/${item.id}`
  })
}

getProductsList() // 获取商品列表
</script>

<style scoped src="./SaveMaster.scss"></style>

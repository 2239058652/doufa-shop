<template>
  <context-holder />
  <div class="contain">
    <a-flex gap="20" align="center" justify="center" vertical>
      <!-- 收藏商家 -->
      <a-card style="width: 100%">
        <div class="wdzj">
          <div class="title">收藏商家</div>
          <div class="funct">
            <a-space :size="20">
              <a-select style="width: 146px">
                <a-select-option value="jack">Jack</a-select-option>
              </a-select>
            </a-space>
            <a-space :size="20">
              <a-input placeholder="请输入商品名或货号" style="width: 244px">
                <template #suffix>
                  <div style="cursor: pointer">
                    <SearchOutlined />
                  </div>
                </template>
              </a-input>
            </a-space>
          </div>
          <a-skeleton :loading="loading" active>
            <!-- 商家列表 -->
            <div class="shops">
              <div class="shop_arr">
                <a-space>
                  <img src="../../../assets/static/shopimg.png" alt="" />
                </a-space>
              </div>
              <div class="content">
                <div class="item" v-for="item in productsList.slice(0, 6)" :key="item.id" @click="routerToDetail(item)">
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
            <a-empty v-if="productsList.length == 0" />
          </a-skeleton>
        </div>
      </a-card>
      <Pagination v-model:current="currentPage" v-model:pageSize="pageSize" :total="total" @change="getProductsList" />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getProducts } from '@/api/store'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/pagination/index.vue'
import { SearchOutlined } from '@ant-design/icons-vue'

const [messageApi, contextHolder] = message.useMessage()
const router = useRouter()

const productsList = ref<any>([]) // 商品列表
const loading = ref<boolean>(false) // 商品列表
const currentPage = ref(1) // 当前页码
const pageSize = ref(24) // 每页条数
const total = ref(0) // 总条数

// 获取收藏列表  1. 获取收藏商品id  2. 根据id获取商品列表
const getProductsList = async () => {
  loading.value = true
  const res = await getProducts({
    page: currentPage.value,
    limit: pageSize.value
  })
  if (res.status === 200) {
    productsList.value = res.data.list
    total.value = res.data.count
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

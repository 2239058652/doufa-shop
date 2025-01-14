<template>
  <context-holder />
  <div class="contain">
    <a-flex gap="20" align="center" justify="center" vertical>
      <!-- 收藏商品 -->
      <a-card style="width: 100%">
        <div class="wdzj">
          <div class="title">收藏商品</div>
          <a-skeleton :loading="loading" active>
            <!-- 商品列表 -->
            <div class="content">
              <div class="item" v-for="item in productsList" :key="item.id" @click="routerToDetail(item)">
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
            <a-empty v-if="productsList.length == 0" />
          </a-skeleton>
        </div>
      </a-card>
      <Pagination v-model:current="currentPage" v-model:pageSize="pageSize" :total="total" @change="getProductsList" />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { getProducts } from '@/api/store'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/pagination/index.vue'

const [messageApi, contextHolder] = message.useMessage()
const router = useRouter()

const productsList = ref<any>([]) // 商品列表
const loading = ref<boolean>(false) // 商品列表
const currentPage = ref(1) // 当前页码
const pageSize = ref(24) // 每页条数
const total = ref(0) // 总条数

// 获取商品列表
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

<style scoped src="./SaveShop.scss"></style>

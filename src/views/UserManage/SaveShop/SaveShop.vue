<template>
  <context-holder />
  <div class="save-shop">
    <a-flex gap="20" align="center" justify="center" vertical style="width: 100%; height: 100%">
      <!-- 收藏商品 -->
      <a-card style="width: 100%; height: 100%">
        <div class="wdzj">
          <div class="title">收藏商品</div>
          <div class="funct">
            <a-space :size="20">
              <a-select style="width: 146px">
                <a-select-option value="jack">Jack</a-select-option>
              </a-select>
              <a-select style="width: 146px">
                <a-select-option value="jack">Jack</a-select-option>
              </a-select>
            </a-space>
            <a-space :size="20">
              <div class="btn" v-if="!plglBoolean" @click="plglBoolean = true">
                <span>批量管理</span>
              </div>
              <Checkbox v-else v-model="checkedAll" label="全选" />
              <div class="btn" v-if="plglBoolean" @click="handleDelete">
                <span>批量删除</span>
              </div>
              <div class="btn" v-if="plglBoolean" @click="plglBoolean = false">
                <span>退出管理</span>
              </div>
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
            <!-- 收藏商品商品列表 -->
            <div class="content">
              <div class="item" v-for="item in productsList" :key="item.id" @click="routerToDetail(item)">
                <div class="img-content">
                  <img :src="item.image" alt="item.image" />
                  <Checkbox
                    v-model="item.checkCoupon"
                    @click.stop="handleChecked"
                    class="checkbox"
                    v-if="plglBoolean"
                  />
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
            <a-empty v-if="productsList.length == 0" />
          </a-skeleton>
        </div>
        <Pagination
          style="display: flex; justify-content: center; margin-top: 20px"
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="total"
          @change="getProductsList"
        />
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getProducts, collectGoodsTo } from '@/api/store'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/pagination/index.vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import Checkbox from '@/components/checkbox/index.vue'

const [messageApi, contextHolder] = message.useMessage()
const router = useRouter()

const productsList = ref<any>([]) // 商品列表
const loading = ref<boolean>(false) // 商品列表
const currentPage = ref(1) // 当前页码
const pageSize = ref(24) // 每页条数
const total = ref(0) // 总条数
const checkedAll = ref<boolean>(false) // 全选
const plglBoolean = ref<boolean>(false) // 批量管理
const checkedIdVal = ref<string>('') // 批量删除

// 获取收藏列表  1. 获取收藏商品id  2. 根据id获取商品列表
const getProductsList = async () => {
  collectGoodsTo().then(async (response: any) => {
    if (response.status === 200) {
      loading.value = true
      const res = await getProducts({
        page: currentPage.value,
        limit: pageSize.value,
        ids: response.data.data
      })
      if (res.status === 200) {
        productsList.value = res.data.list
        total.value = res.data.count
        loading.value = false
      } else {
        messageApi.error(res.msg)
        loading.value = false
      }
    } else {
      messageApi.error(response.msg)
    }
  })
}

// 点击单选框
const handleChecked = (item: any) => {
  item.checkCoupon = !item.checkCoupon
}

// 批量删除
const handleDelete = () => {
  if (checkedIdVal.value) {
    Modal.confirm({
      title: '提示',
      content: '确定要批量删除收藏的商品吗？',
      onOk: () => {}
    })
  } else {
    messageApi.error('请先选择要删除的收藏商品')
  }
}

// 监听全选按钮状态变化
watch(
  checkedAll,
  (newVal) => {
    productsList.value.forEach((item: { checkCoupon: boolean }) => {
      if (newVal) {
        item.checkCoupon = true
      } else {
        item.checkCoupon = false
      }
    })
  },
  { deep: true }
)
// 监听单个商品选中状态变化
// 监听单个商品选中状态变化
watch(
  productsList,
  (newVal) => {
    const checkedItems = newVal.filter((item: { checkCoupon: boolean }) => item.checkCoupon)
    const checkedIds = checkedItems.map((item: { id: string | number }) => item.id)
    checkedIdVal.value = checkedIds.join(',')
    console.log('选中的商品:', checkedItems)
  },
  { deep: true }
)

// 跳转商品详情
const routerToDetail = (item: any) => {
  router.push({
    path: `/merchandis/${item.id}`
  })
}

getProductsList() // 获取商品列表
</script>

<style scoped src="./SaveShop.scss"></style>

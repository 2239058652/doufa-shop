<template>
  <context-holder />
  <div class="shoppingcart">
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
            </div>
          </template>
        </a-input>
      </div>
    </div>

    <!-- 左侧购物车列表,右侧结算信息框 -->
    <div class="pay_cart">
      <div class="pay_table">
        <div class="top_btn">
          <div class="car_title">购物车</div>
          <div class="pl_btn">
            <span>批量删除</span>
          </div>
        </div>
        <a-table :pagination="false" :row-selection="{ onChange: hanldeTaableRowChanged }" :columns="columns"
          :data-source="tableDataList" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'detail'">
              <span>{{ record.productInfo.store_name }}</span>
            </template>
            <template v-else-if="column.key === 'operater'">
              <div>
                xxx
              </div>
            </template>
          </template>
        </a-table>

        <div style="display: flex; justify-content: center; align-items: center; margin-top: 20px">
          <Pagination :pageSizeOptions="[10, 20, 30, 50, 100]" v-model:current="currentPage" v-model:pageSize="pageSize"
            :total="total" @change="getProductsList" />
        </div>
      </div>

      <!-- 结算框 -->
      <div class="pay_cash"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Popover from '@/components/phopopover/index.vue' // 以图搜索
import { ref, onActivated, onMounted, defineComponent } from 'vue'
import { message } from 'ant-design-vue'
import Pagination from '@/components/pagination/index.vue'
import { getShoppingCart } from '@/api/store'

defineComponent({
  name: 'ShoppingCart'
})

onMounted(() => {
  console.log('组件首次加载')
})

onActivated(() => {
  console.log('组件激活')
})

const [messageApi, contextHolder] = message.useMessage()

const fileList = ref([]) // 以图搜索list
const inputVal = ref('') // 搜索框输入框

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const columns = [
  {
    title: '商品详情',
    dataIndex: 'detail',
    align: 'center'
  },
  {
    title: '档口',
    dataIndex: 'money',
    align: 'center'
  },
  {
    title: '规格',
    dataIndex: 'address',
    align: 'center'
  },
  {
    title: '数量',
    dataIndex: 'address',
    align: 'center'
  },
  {
    title: '金额（元）',
    dataIndex: 'address',
    align: 'center'
  },
  {
    title: '操作',
    key: 'operater',
    align: 'center'
  }
]
const tableDataList = ref([])

const tableSelectedRowKeys = ref<any>([])

// 表格选中
const hanldeTaableRowChanged = (selectedRowKeys: any, selectedRows: any) => {
  console.log(selectedRowKeys, selectedRows)
}

// 以图搜索
const beforeUpload = (file: any) => {
  console.log(file, 'aaaaaaaaaa')
}

// 获取商品列表
const getProductsList = () => {
  getShoppingCart({ status: 1, page: currentPage.value, limit: pageSize.value }).then((res: any) => {
    console.log(res)
    if (res.status == 200) {
      tableDataList.value = res.data.valid
      total.value = res.data.valid.length
    }
  })
}

getProductsList()
</script>

<style scoped src="./ShoppingCart.scss"></style>

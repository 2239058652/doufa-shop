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
          <div class="pl_btn" @click="handlePLDelete">
            <span>批量删除</span>
          </div>
        </div>
        <a-table :pagination="false" :row-selection="{
          onChange: hanldeTableRowChanged
        }" :columns="tableColumns" :data-source="tableDataList" bordered :scroll="{ x: 1100 }" rowKey="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'detail'">
              <div class="detail_box">
                <img :src="record.productInfo.attrInfo.image" alt="" />
                <div class="detail_box_right">
                  <div class="store_name">{{ record.productInfo.store_name }}</div>
                  <div class="keyword">货号：{{ record.productInfo.keyword }}</div>
                </div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'money'">
              <div class="money_box">
                <div>商家：{{ record.productInfo.mer_name }}</div>
                <div>站点：{{ record.productInfo.goods_address }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'sku'">
              <div style="
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: flex-start;
                ">
                <span><span style="color: #999999">颜色：</span>{{ getColor(record.productInfo.attrInfo.suk) }}</span>
                <span><span style="color: #999999">尺码：</span>{{ getSize(record.productInfo.attrInfo.suk) }}</span>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'price'">
              <div style="
                  height: 22px;
                  font-weight: 500;
                  font-size: 16px;
                  color: #f83126;
                  line-height: 22px;
                ">{{
                  parseFloat(record.productInfo.attrInfo.price) * parseFloat(record.cart_num)
                }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'operater'">
              <a-button type="link" style="color: #999999" @click="handleDelete(record.id)">删除</a-button>
            </template>
            <template v-else-if="column.dataIndex === 'cart_num'">
              <a-input-number v-model:value="record.cart_num" :min="0" :max="1000000">
                <template #addonBefore>
                  <div class="caculate" @click="caculateGoodsNum('reduce', record)">-</div>
                </template>
                <template #addonAfter>
                  <div class="caculate" @click="caculateGoodsNum('add', record)">+</div>
                </template>
              </a-input-number>
            </template>
          </template>
        </a-table>

        <div style="display: flex; justify-content: center; align-items: center; margin-top: 20px">
          <Pagination :pageSizeOptions="[10, 20, 30, 50, 100]" v-model:current="currentPage" v-model:pageSize="pageSize"
            :total="total" @change="getProductsList" />
        </div>
      </div>

      <!-- 结算框 -->
      <div class="pay_cash">
        <div class="pay_cash_top">
          <span class="jsmx">结算明细</span>
          <span class="tishi">实际支付金额以下单页为准</span>
        </div>
        <div class="pay_cash_img" v-if="tableSelectedRowKeys.length > 0">
          <img :src="item.productInfo.attrInfo.image" :alt="item.productInfo.attrInfo.suk"
            v-for="item in tableSelectedRowKeys" :key="item.id" />
        </div>
        <div class="pay_cash_empty_img" v-else>
          <img src="../../assets/image/shopping_cart_empty.png" alt="" />
          <div>请勾选要下单的商品结算</div>
        </div>
        <div class="pay_cash_heji">
          <div class="heji">合计商品金额：</div>
          <div class="price_total">¥{{ totalPrice }}</div>
        </div>
        <div class="jiesuan" @click="handleJieSuan">
          <span>结算 ({{ jieSuanNum }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Popover from '@/components/phopopover/index.vue' // 以图搜索
import { ref, onActivated, onMounted, computed, } from 'vue'
import { message, Modal } from 'ant-design-vue'
import Pagination from '@/components/pagination/index.vue'
import { getShoppingCart, deleteCarts } from '@/api/store'
import { useRouter } from 'vue-router'
import { useGoodsCartsTableStore } from '@/stores/goodCartsTable'

const goodsCartsTableStore = useGoodsCartsTableStore()  // 购物车表格数据,存到pinia中


const router = useRouter()


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
const jieSuanNum = ref(0) // 结算数量


const tableColumns = [
  {
    title: '商品详情',
    dataIndex: 'detail',
    align: 'center',
    width: 400,
    fixed: 'left'
  },
  {
    title: '档口',
    dataIndex: 'money',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '规格',
    dataIndex: 'sku',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '数量',
    dataIndex: 'cart_num',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '金额（元）',
    dataIndex: 'price',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operater',
    width: 90,
    align: 'center'
  }
]
const tableDataList = ref([])

const tableSelectedRowKeys = ref<any>([])
const selectedTableRowKeys = ref<any>([])

// 表格选中
const hanldeTableRowChanged = (selectedRowKeys: any, selectedRows: any) => {
  jieSuanNum.value = selectedRowKeys.length
  tableSelectedRowKeys.value = selectedRows
  selectedTableRowKeys.value = selectedRowKeys
}

// 以图搜索
const beforeUpload = (file: any) => {
  console.log(file, 'aaaaaaaaaa')
}

// 获取商品列表
const getProductsList = () => {
  getShoppingCart({ status: 1, page: currentPage.value, limit: pageSize.value }).then(
    (res: any) => {
      console.log(res)
      if (res.status == 200) {
        tableDataList.value = res.data.valid
        total.value = res.data.valid.length
      }
    }
  )
}

// 购物数量加减
const caculateGoodsNum = (type: string, record: any) => {
  switch (type) {
    case 'add':
      record.cart_num++
      break
    case 'reduce':
      if (record.cart_num > 0) {
        record.cart_num--
      } else {
        messageApi.open({
          type: 'warning',
          content: '商品数量不能小于0'
        })
      }
      break
  }
}

// 计算总价
const totalPrice = computed(() => {
  return tableSelectedRowKeys.value.reduce((total: number, item: { productInfo: { attrInfo: { price: string } }; cart_num: string }) => {
    const price = parseFloat(item.productInfo.attrInfo.price)
    const quantity = parseFloat(item.cart_num)
    return total + price * quantity
  }, 0).toFixed(2)
})

// 获取颜色
const getColor = (suk: string) => {
  return suk.split(',')[0]
}

// 获取尺码
const getSize = (suk: string) => {
  return suk.split(',')[1]
}

// 结算
const handleJieSuan = () => {
  if (tableSelectedRowKeys.value.length == 0) {
    messageApi.open({
      type: 'warning',
      content: '请先选择要结算的商品'
    })
    return
  }

  goodsCartsTableStore.reGoodsCartsTable(tableSelectedRowKeys.value)  // 将选中的商品存到pinia中
  router.push({ // 跳转结算页面
    path: '/payorder',
    query: { type: 'gwcjs' }
  })
}

// 删除购物车
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '删除商品',
    content: '是否删除该商品？',
    maskClosable: true,
    cancelText: '取消',
    okText: '确认',
    onOk: () => {
      deleteCarts({ ids: record }).then((res: any) => {
        if (res.status == 200) {
          messageApi.open({
            type: 'success',
            content: '删除成功'
          })
          // 删除成功后重置选中状态和计数
          tableSelectedRowKeys.value = tableSelectedRowKeys.value.filter(
            (item: any) => item.id !== record
          )
          selectedTableRowKeys.value = selectedTableRowKeys.value.filter(
            (id: any) => id !== record
          )
          jieSuanNum.value = tableSelectedRowKeys.value.length
          getProductsList()
        } else {
          messageApi.open({
            type: 'error',
            content: res.msg
          })
        }
      })
    }
  })
}

// 批量删除
const handlePLDelete = () => {
  if (selectedTableRowKeys.value.length == 0) {
    return messageApi.open({
      type: 'warning',
      content: '请先选择要删除的商品'
    })
  }
  Modal.confirm({
    title: '批量删除',
    content: '是否删除选择的所有商品？',
    maskClosable: true,
    cancelText: '取消',
    okText: '确认',
    onOk: () => {
      deleteCarts({ ids: selectedTableRowKeys.value.join(',') }).then((res: any) => {
        if (res.status == 200) {
          messageApi.open({
            type: 'success',
            content: '删除成功'
          })
          // 删除成功后清空选中状态和计数
          tableSelectedRowKeys.value = []
          selectedTableRowKeys.value = []
          jieSuanNum.value = 0
          getProductsList()
        } else {
          messageApi.open({
            type: 'error',
            content: res.msg
          })
        }
      })
    }
  })
}

getProductsList()
</script>

<style scoped src="./ShoppingCart.scss"></style>
<style scoped lang="scss">
.detail_box {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 6px;

  img {
    width: 82px;
    height: 82px;
    object-fit: cover;
  }

  .detail_box_right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .store_name {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      text-align: left;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    .keyword {
      font-size: 14px;
      color: #ff5a02;
      text-align: left;
      margin-top: 10px;
    }
  }
}

.money_box {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  text-align: left;
}

// 修改表格列样式
:deep(.ant-table-cell) {
  vertical-align: middle;
}
</style>

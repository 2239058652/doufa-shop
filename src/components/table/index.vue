<template>
  <a-table
    :columns="columns"
    :data-source="tableData"
    :pagination="false"
    :row-key="(record) => record.orderNo"
    :expandable="{
      expandedRowRender,
      defaultExpandAllRows: true,
      expandIconColumnIndex: -1
    }"
  >
    <!-- 自定义单元格内容 -->
    <template #bodyCell="{ column, record }">
      <!-- 原订单商品 -->
      <template v-if="column.dataIndex === 'originalProduct'">
        <div class="product-info">
          <img :src="record.originalProduct.image" alt="商品图片" />
          <div class="product-detail">
            <p>颜色：{{ record.originalProduct.color }}</p>
            <p>尺码：{{ record.originalProduct.size }}</p>
            <p>数量：{{ record.originalProduct.quantity }}件</p>
          </div>
        </div>
      </template>

      <!-- 最终代发商品 -->
      <template v-if="column.dataIndex === 'finalProduct'">
        <div class="product-info">
          <img :src="record.finalProduct.image" alt="商品图片" />
          <div class="product-detail">
            <p>颜色：{{ record.finalProduct.color }}</p>
            <p>尺码：{{ record.finalProduct.size }}</p>
            <p>数量：{{ record.finalProduct.quantity }}件</p>
          </div>
        </div>
      </template>

      <!-- 收件人信息 -->
      <template v-if="column.dataIndex === 'recipient'">
        <div class="recipient-info">
          <p>{{ record.recipient.name }} {{ record.recipient.phone }}</p>
          <p>{{ record.recipient.address }}</p>
        </div>
      </template>

      <!-- 利润信息 -->
      <template v-if="column.dataIndex === 'profit'">
        <div class="profit-info">
          <p>{{ record.logistics.company }}: ¥{{ record.logistics.cost }}</p>
          <p>预估利润: {{ record.profit }}</p>
        </div>
      </template>

      <!-- 操作列 -->
      <template v-if="column.dataIndex === 'action'">
        <a-button type="primary" @click="handleOperation(record)"> 立即结算 </a-button>
      </template>
    </template>
  </a-table>
</template>

<script lang="tsx" setup>
import type { TableColumnsType } from 'ant-design-vue'

interface ProductInfo {
  image: string
  color: string
  size: string
  quantity: number
}

interface RecipientInfo {
  name: string
  phone: string
  address: string
}

interface LogisticsInfo {
  company: string
  cost: number
}

interface TableItem {
  orderNo: string
  orderTime: string
  originalProduct: ProductInfo
  finalProduct: ProductInfo
  recipient: RecipientInfo
  logistics: LogisticsInfo
  profit: number
  note?: string
}

// 定义表格列
const columns: TableColumnsType = [
  {
    title: '原订单商品',
    dataIndex: 'originalProduct',
    width: '20%'
  },
  {
    title: '最终代发商品',
    dataIndex: 'finalProduct',
    width: '20%'
  },
  {
    title: '收件人信息',
    dataIndex: 'recipient',
    width: '20%'
  },
  {
    title: '利润',
    dataIndex: 'profit',
    width: '15%'
  },
  {
    title: '订单备注',
    dataIndex: 'note',
    width: '15%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '10%',
    fixed: 'right'
  }
]

// 展开行渲染函数
const expandedRowRender = (record: TableItem) => {
  return (
    <div class="order-basic-info">
      订单编号：{record.orderNo} 下单时间：{record.orderTime}
    </div>
  )
}

const props = defineProps<{
  tableData: TableItem[]
}>()

const emit = defineEmits<{
  (e: 'operation', row: TableItem): void
}>()

const handleOperation = (row: TableItem) => {
  emit('operation', row)
}
</script>

<style scoped>
.order-basic-info {
  padding: 12px 8px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.product-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.product-info img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #f0f0f0;
}

.product-detail p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.recipient-info p,
.profit-info p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}
</style>

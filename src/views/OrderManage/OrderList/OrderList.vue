<template>
  <context-holder />
  <div class="order-list" ref="scrollContainer">
    <!-- 订单种类tabs -->
    <a-card class="list-card">
      <div class="tabs">
        <div
          v-for="(item, index) in listCardTabs"
          :key="item.value"
          class="tab"
          :class="{ active: activeTab === index }"
          @click="handleTabClick(item.value, index)"
        >
          <span>{{ item.name }}</span>
        </div>
      </div>

      <!-- 搜索部分 -->
      <a-form :colon="false" :model="formData" class="xiantiao">
        <a-row :gutter="16">
          <a-col :span="5">
            <a-form-item label="订单编号">
              <a-input v-model:value="formData.order_ids" allowClear placeholder="请输入订单编号" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="商品名称">
              <a-input v-model:value="formData.store_id" allowClear placeholder="请输入商品名称" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="货号">
              <a-input v-model:value="formData.store_id" allowClear placeholder="请输入货号" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="商家名称">
              <a-input v-model:value="formData.store_id" allowClear placeholder="请输入商家名称" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="所属站点">
              <a-input v-model:value="formData.store_id" allowClear placeholder="请输入商家名称" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="订单来源平台">
              <a-input-group compact>
                <a-select v-model:value="formData.store_id" style="width: 30%" placeholder="请选择">
                  <a-select-option value="1">抖店</a-select-option>
                </a-select>
                <a-input v-model:value="formData.store_id" style="width: 70%" placeholder="请输入订单来源订单编号" />
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="来源网店">
              <a-select v-model:value="formData.store_id" placeholder="请选择来源网店">
                <a-select-option value="1">抖店</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="订单备注">
              <a-input v-model:value="formData.store_id" allowClear placeholder="请输入订单备注" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="创建时间">
              <a-range-picker
                v-model:value="hackValue"
                :placeholder="['开始时间', '结束时间']"
                :format="dateFormat"
                @change="onChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="">
              <a-space :size="24">
                <a-button type="primary" danger @click="getOrderList">查询</a-button>
                <a-button type="primary" @click="handleClean">重置</a-button>
                <a-button type="primary" @click="handleExportcel">导出订单</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="table-btn">
        <a-space :size="24">
          <div class="btn" @click="handlePayMuch"><span>批量付款</span></div>
          <div class="btn btn-white"><span>批量删除</span></div>
          <div class="btn btn-yellow"><span>批量改款</span></div>
        </a-space>
      </div>
      <div class="table-box">
        <div class="header">
          <div class="column-title div-0">
            <span> <Checkbox v-model="checkedAll" label="" @change="handleCheckAll" /></span>
          </div>
          <div class="column-title div-1">
            <span>商品</span>
          </div>
          <div class="column-title div-2">
            <span>属性</span>
          </div>
          <div class="column-title div-3">
            <span>数量</span>
          </div>
          <div class="column-title div-4">
            <span>总价（元）</span>
          </div>
          <div class="column-title div-5">
            <span>交易状态</span>
          </div>
          <div class="column-title div-6">
            <span>收货地址</span>
          </div>
          <div class="column-title div-7">
            <span>备注</span>
          </div>
          <div class="column-title div-8">
            <span>操作</span>
          </div>
        </div>
        <div class="table-content">
          <div class="table-item" v-for="item in dataSource" :key="item.id">
            <div class="check">
              <Checkbox
                style="width: 18px; height: 18px; margin-left: 20px"
                v-model="item.checked"
                label=""
                @change="(val) => handleItemCheck(val, item)"
              />
              <div class="bianhao">
                <span>订单编号：{{ item.order_id }}</span>
                <img
                  class="copy-icon"
                  src="../../../assets/image/copy.png"
                  alt=""
                  @click="handleUseCopy(item.order_id)"
                />
              </div>
              <div class="">
                <span>交易创建时间：{{ moment(item.add_time * 1000).format('YYYY/MM/DD HH:mm:ss') }}</span>
              </div>
              <div class=""><span>订单来源：抖音【店铺名称】</span></div>
              <div class="bianhao">
                <span>订单来源订单编号：{{ item.dy_order_id }}</span>
                <img
                  class="copy-icon"
                  src="../../../assets/image/copy.png"
                  alt=""
                  @click="handleUseCopy(item.dy_order_id)"
                />
              </div>
            </div>
            <div class="item">
              <div class="good">
                <div class="goods" v-for="i in item.cartInfo" :key="i.id">
                  <img :src="i.productInfo.image" alt="" />
                  <div class="goods-info">
                    <div class="font">商家：{{ i.productInfo.mer_name }}</div>
                    <div class="font">货号：{{ i.productInfo.keyword }}</div>
                    <div class="font">站点：{{ i.productInfo.goods_address }}</div>
                    <div class="font" style="color: #ff5c02">¥{{ i.attrInfo.ot_price }}</div>
                  </div>
                </div>
              </div>
              <div class="shuxing">
                <div class="item" v-for="i in item.cartInfo" :key="i.id">
                  <div class="item-info">
                    <div class="font">{{ getColor(i.attrInfo.suk) }}</div>
                    <div class="font">{{ getSize(i.attrInfo.suk) }}</div>
                    <div class="btn">
                      <span>改款</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="num">
                <div class="item" v-for="i in item.cartInfo" :key="i.id">
                  <div class="item-info">
                    <div class="font">{{ i.cart_num }}件</div>
                  </div>
                </div>
              </div>
              <div class="price">
                <div class="item">
                  <div class="item-info">
                    <div class="font" style="color: #ff5c02">实付金额：¥{{ item.pay_price }}</div>
                    <div class="font">运费：¥{{ item.pay_postage }}</div>
                    <div class="font">服务：¥0</div>
                  </div>
                </div>
              </div>
              <div class="status">
                <div class="item">
                  <div class="item-info">
                    <span>{{ formatStatus(item) }}</span>
                  </div>
                </div>
              </div>
              <div class="address">
                <div class="item">
                  <div class="item-info">
                    <div class="font">{{ item.real_name }} {{ item.user_phone }}</div>
                    <div class="font">{{ item.user_address }}</div>
                    <div class="lanjie">
                      <span>拦截物流</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="beizhu">
                <div class="item">
                  <div class="item-info">
                    <span>{{ item.mark || '无' }}</span>
                  </div>
                </div>
              </div>
              <div class="operater">
                <div class="item">
                  <div class="item-info">
                    <div class="btn shouhou">
                      <span>申请售后</span>
                    </div>
                    <div class="btn paynow">
                      <span>立即付款</span>
                    </div>
                    <div class="btn">
                      <span>删除订单</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bom">
              <div>抖店面单：快递费（{{ item.pay_postage }}元）</div>
              <div class="bianhao">
                <span>物流单号：{{ item.delivery_id }}</span>
                <img
                  class="copy-icon"
                  src="../../../assets/image/copy.png"
                  alt=""
                  @click="handleUseCopy(item.delivery_id)"
                />
              </div>
              <div>假 发货时间：2024/09/19 10:28:21</div>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        style="display: flex; justify-content: center; margin: 20px 0"
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="total"
        @change="getOrderList"
        :pageSizeOptions="[10, 20, 30, 40, 50, 100]"
      />
    </a-card>
    <a-back-top :target="() => scrollContainer" />
  </div>
</template>

<script lang="ts" setup>
import Pagination from '@/components/pagination/index.vue'
import { message } from 'ant-design-vue'
import { ref, watch, computed } from 'vue'
import { aorderList } from '@/api/order'
import { Dayjs } from 'dayjs'
import moment from 'moment'

import Checkbox from '@/components/checkbox/index.vue'
import { useClipboard } from '@vueuse/core'

const scrollContainer = ref() // 滚动容器
const dateFormat = 'YYYY-MM-DD'
type RangeValue = [Dayjs, Dayjs] | [string, string]
const hackValue = ref<RangeValue>()

const [messageApi, contextHolder] = message.useMessage()
const checkedAll = ref<boolean>(false)

const formData = ref<any>({
  store_name: '',
  store_id: '',
  order_ids: '',
  time_start: '',
  time_end: '',
  type: null
})
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数
const dataSource = ref<any>([])
const originalData = ref([])
const activeTab = ref(0)
const listCardTabs = [
  {
    name: '全部',
    value: 9
  },
  {
    name: '待付款',
    value: 0
  },
  {
    name: '待发货',
    value: 1
  },
  {
    name: '已发货',
    value: 2
  },
  {
    name: '售后订单',
    value: 4
  },
  {
    name: '未拿到货',
    value: 5
  },
  {
    name: '待评价',
    value: 3
  }
]

// 计算已选中的项目
const checkedList = computed(() => dataSource.value.filter((item: { checked: any }) => item.checked))

// 监听全选按钮状态变化
const updateCheckedAll = () => {
  checkedAll.value = dataSource.value.length > 0 && dataSource.value.every((item: { checked: any }) => item.checked)
}

// 监听数据源变化自动更新全选状态
watch(dataSource, () => updateCheckedAll(), { deep: true })

// 全选/反选逻辑优化
const handleCheckAll = (checked: boolean) => {
  dataSource.value = dataSource.value.map((item: any) => ({
    ...item,
    checked
  }))
}
// 优化后的单个复选框变更处理
const handleItemCheck = (checked: boolean, item: any) => {
  const index = dataSource.value.findIndex((i: { id: any }) => i.id === item.id)
  if (index > -1) {
    dataSource.value[index].checked = checked
  }
  updateCheckedAll()
}

// 批量付款
const handlePayMuch = () => {
  if (checkedList.value.length == 0) {
    messageApi.warning('请选择订单')
    return
  }
  console.log(checkedList.value)
}

// 切换订单种类tab
const handleTabClick = (val: number, index: number) => {
  if (val == 4 || val == 5) {
    messageApi.warning('暂未开放')
    return
  }
  formData.value.type = val
  activeTab.value = index
  getOrderList()
}

// 获取颜色
const getColor = (suk: string) => {
  return suk.split(',')[0]
}

// 获取尺码
const getSize = (suk: string) => {
  return suk.split(',')[1]
}

// 获取订单状态
const formatStatus = (sts: any) => {
  const { refund, is_stock_up, status, pay_time, is_all_refund } = sts
  if (status == 0 && pay_time == 0 && is_stock_up == 0) {
    return '未支付'
  } else if (status == 0 && pay_time != 0 && is_stock_up == 5) {
    return '明天到货'
  } else if (status == 0 && pay_time != 0 && is_stock_up == 2) {
    return '不补货'
  } else if (status == 0 && pay_time != 0 && is_stock_up == 3) {
    return '后天到货'
  } else if (status == 0 && pay_time != 0 && is_stock_up == 0 && refund.length == 0) {
    return '待发货'
  } else if (status == 0 && pay_time != 0 && is_stock_up == 1) {
    return '缺货'
  } else if (refund && refund.length > 0) {
    if (refund[refund.length - 1].refund_type == 6) {
      return '已退款'
    } else {
      return '退款中'
    }
  } else if (status == 1) {
    return '已发货'
  }
}

// shijian
const onChange = (val: RangeValue | [string, string], dateStrings: [string, string]) => {
  if (val) {
    formData.value.time_start = dateStrings[0]
    formData.value.time_end = dateStrings[1]
  } else {
    formData.value.time_start = ''
    formData.value.time_end = ''
  }
}

// 复制
const handleUseCopy = (source: any) => {
  if (!source) {
    messageApi.warning('暂无内容无法复制')
    return
  }

  const { copy } = useClipboard({ source, legacy: true })
  copy(source)
  messageApi.success('复制成功')
}

// 重置
const handleClean = () => {
  formData.value = {
    store_name: '',
    store_id: '',
    order_ids: '',
    time_start: '',
    time_end: '',
    type: null
  }
  dataSource.value = originalData.value
  total.value = originalData.value.length
  hackValue.value = undefined
  getOrderList()
}

// 导出订单
const handleExportcel = () => {}

// 获取订单列表
const getOrderList = () => {
  aorderList({ page: currentPage.value, limit: pageSize.value, ...formData.value }).then((res: any) => {
    if (res.status == 200) {
      dataSource.value = res.data.list.map((item: any) => ({
        ...item,
        checked: false
      }))
      originalData.value = res.data.list.map((item: any) => ({
        ...item,
        checked: false
      }))
      total.value = res.data.count
    } else {
      messageApi.error(res.msg)
    }
  })
}

getOrderList()
</script>

<style scoped src="./OrderList.scss"></style>

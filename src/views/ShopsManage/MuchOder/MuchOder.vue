<template>
  <contextHolder />
  <div class="muchoder">
    <!-- 顶部同步订单选择器 -->
    <div class="top-fun">
      <div class="box">
        <div class="title">同步订单</div>
        <div class="select-box">
          <div class="tbdp">同步店铺</div>
          <a-select
            :showArrow="true"
            :showSearch="false"
            :bordered="false"
            v-model:value="multipleVal"
            mode="multiple"
            placeholder="请选择店铺"
            class="aselect"
            :options="multipleOptions"
            :field-names="{ label: 'store_name', value: 'store_id' }"
            @change="handleChange"
          >
          </a-select>
        </div>
        <div class="select-box">
          <div class="tbdp">同步时间</div>
          <a-range-picker
            class="aselect"
            :bordered="false"
            :value="hackValue"
            :format="dateFormat"
            @change="onChange"
            :placeholder="['开始时间', '结束时间']"
          />
        </div>
        <div class="tbdd-btn" @click="handleTBDD">
          <span>同步订单</span>
        </div>
        <div class="tjdp-btn" @click="handleTJDP">
          <span>添加店铺</span>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="muchoder-table">
      <!-- 切换店铺 -->
      <div class="store-tabs">
        <div
          class="tab"
          v-for="(item, index) in tabsList"
          :key="index"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          <span>{{ item.store_name }}</span>
        </div>
      </div>

      <!-- 未提交订单已提交订单 -->
      <div class="oder-card">
        <div :class="oderCardTab == 0 ? 'oder-card-item' : 'oder-card-item-active'" @click="oderCardTab = 0">
          <img src="../../../assets/image/dyoder.png" v-if="oderCardTab == 0" alt="" />
          <div class="item">
            <div class="title">未提交订单</div>
            <div class="content">2,890</div>
          </div>
        </div>
        <div :class="oderCardTab == 1 ? 'oder-card-item' : 'oder-card-item-active'" @click="oderCardTab = 1">
          <img src="../../../assets/image/dyoder.png" v-if="oderCardTab == 1" alt="" />
          <div class="item">
            <div class="title">已提交订单</div>
            <div class="content">2,890</div>
          </div>
        </div>
      </div>

      <!-- 搜索条件 -->
      <div class="search-box">
        <div class="antv-box">
          <div class="tbdp">订单号</div>
          <a-input :bordered="false" v-model:value="formData.product" placeholder="请输入订单号" class="aselect">
          </a-input>
        </div>
        <div class="antv-box">
          <div class="tbdp">标题</div>
          <a-input :bordered="false" v-model:value="formData.shop_name" placeholder="请输入订单号" class="aselect">
          </a-input>
        </div>
        <div class="antv-box">
          <div class="tbdp">关联档口</div>
          <a-input :bordered="false" v-model:value="formData.address" placeholder="请输入订单号" class="aselect">
          </a-input>
        </div>
        <div class="antv-box">
          <div class="tbdp">颜色</div>
          <a-input :bordered="false" v-model:value="formData.color" placeholder="请输入订单号" class="aselect">
          </a-input>
        </div>
        <div class="antv-box">
          <div class="tbdp">尺码</div>
          <a-input :bordered="false" v-model:value="formData.size" placeholder="请输入订单号" class="aselect">
          </a-input>
        </div>
        <div class="antv-box">
          <div class="tbdp">旗帜颜色</div>
          <a-input :bordered="false" v-model:value="formData.qizhi" placeholder="请输入订单号" class="aselect">
          </a-input>
        </div>
        <div class="antv-box">
          <div class="tbdp">备注内容</div>
          <a-input :bordered="false" v-model:value="formData.content" placeholder="请输入订单号" class="aselect">
          </a-input>
        </div>
        <div class="btn-search" @click="handleSearch">
          <span>查询</span>
        </div>
        <div class="btn-clean">
          <span>重置</span>
        </div>
      </div>

      <div class="order-table">
        <a-table
          :dataSource="dataSource"
          :columns="[
            {
              title: '原订单商品',
              align: 'center',
              dataIndex: 'title'
            },
            {
              title: '订单编号',
              dataIndex: 'order_id',
              align: 'center'
            },
            {
              title: '原金额',
              dataIndex: 'pm',
              align: 'center'
            },
            {
              title: '金额变动',
              dataIndex: 'number',
              align: 'center'
            },
            {
              title: '剩余金额',
              dataIndex: 'balance',
              align: 'center'
            },
            {
              title: '日期',
              dataIndex: 'add_time',
              align: 'center'
            },
            {
              title: '售后订单',
              dataIndex: 'add_time',
              align: 'center'
            },
            {
              title: '来源订单',
              dataIndex: 'add_time',
              align: 'center'
            },
            {
              title: '操作',
              key: 'operate',
              align: 'center'
            }
          ]"
          bordered
          :pagination="false"
          :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
          :row-selection="{
            onChange: hanldeTableRowChanged
          }"
          :defaultExpandAllRows="true"
          :expandable="{
            defaultExpandAllRows: true
          }"
        >
          <template #expandedRowRender="{ record }">
            <div class="custom-expanded-row">
              <div class="order-info">
                <div class="product-title">{{ record.title }}</div>
                <div class="product-specs">
                  <span>订单信息展示区域</span>
                </div>
              </div>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'pm'">
              <span
                >￥{{
                  record.pm == 1
                    ? (Number(record.balance) - Number(record.number)).toFixed(2)
                    : (Number(record.balance) + Number(record.number)).toFixed(2)
                }}</span
              >
            </template>
            <template v-if="column.dataIndex === 'balance'">
              <span>￥{{ record.balance }}</span>
            </template>
            <template v-if="column.dataIndex === 'number'">
              <a-tag color="success" v-if="record.pm == 1">
                <span>+￥{{ record.number }}</span>
              </a-tag>
              <a-tag color="error" v-else>
                <span>-￥{{ record.number }}</span>
              </a-tag>
            </template>
            <template v-if="column.key === 'operate'">
              <a-button v-if="record.type == 'pay_product'" type="link">查看订单</a-button>
            </template>
          </template>
        </a-table>
      </div>
      <Pagination
        style="display: flex; justify-content: center; margin: 20px 0"
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="total"
        @change="handleTBDD"
        :pageSizeOptions="[10, 20, 30, 40, 50, 100]"
      />
    </div>

    <!-- 底部结算 -->
    <a-affix :offset-bottom="10">
      <div class="bottom-summary">
        <span>底部内容</span>
      </div>
    </a-affix>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import { Dayjs } from 'dayjs'
import { message, Modal } from 'ant-design-vue'
import { userStoreList, authorizeGoods, syncDyOrder } from '@/api/shops'
import { useRouter } from 'vue-router'

const router = useRouter()
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

const dateFormat = 'YYYY-MM-DD'
type RangeValue = [Dayjs, Dayjs]
const hackValue = ref<RangeValue>()

const oderCardTab = ref(0)
const dataSource = ref<any>([])

const [messageApi, contextHolder] = message.useMessage()
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数
const formData = ref({
  startTime: '',
  endTime: '',
  store_id: '',
  user_id: '',
  product: '',
  shop_name: '',
  address: '',
  color: '',
  size: '',
  content: '',
  qizhi: ''
})

// 同步店铺
const handleChange = (value: string[], option: any) => {
  console.log(`selected ${value}`, option)
  multipleSelVal.value = option
}
const multipleVal = ref([])
const multipleSelVal = ref([])
const multipleOptions = ref<any[]>([])
const tabsList = ref<any[]>([])
const activeTab = ref(0)

// 时间日期
const onChange = (val: RangeValue) => {
  if (val) {
    formData.value.startTime = val[0].format(dateFormat)
    formData.value.endTime = val[1].format(dateFormat)
  } else {
    formData.value.startTime = ''
    formData.value.endTime = ''
  }
  hackValue.value = val
}

// 查询
const handleSearch = () => {
  syncDyOrder({
    store_id: multipleVal.value.join(','),
    user_id: userInfo.uid,
    page: currentPage.value - 1,
    limit: pageSize.value,
    time_start: new Date(formData.value.startTime).getTime() / 1000,
    time_end: new Date(formData.value.endTime).getTime() / 1000,
    product: formData.value.product
  }).then((res: any) => {
    if (res.status == 200) {
      dataSource.value = res.data.shop_order_list
      total.value = res.data.total
    } else {
      messageApi.error(res.msg)
    }
  })
}

// 同步订单
const handleTBDD = async () => {
  if (!multipleVal.value.length) {
    messageApi.warning('请选择要同步的店铺')
    return
  }

  if (!formData.value.startTime || !formData.value.endTime) {
    messageApi.warning('请选择同步时间范围')
    return
  }

  try {
    dataSource.value = []
    total.value = 0

    const baseParams = {
      user_id: userInfo.uid,
      page: 0,
      limit: 10,
      time_start: new Date(formData.value.startTime).getTime() / 1000,
      time_end: new Date(formData.value.endTime).getTime() / 1000,
      product: formData.value.product
    }

    // 记录每个店铺ID和名称的映射
    const storeMap = multipleSelVal.value.reduce((acc: any, curr: any) => {
      acc[curr.store_id] = curr.store_name
      return acc
    }, {})

    const results = await Promise.all(
      multipleVal.value.map((id) =>
        syncDyOrder({
          ...baseParams,
          store_id: id
        }).then((res: any) => ({
          ...res,
          store_id: id
        }))
      )
    )

    let successCount = 0
    let failCount = 0

    results.forEach((res) => {
      if (res.status === 200) {
        dataSource.value = [...dataSource.value, ...res.data.shop_order_list]
        total.value += res.data.total
        successCount++
      } else {
        messageApi.error(`店铺「${storeMap[res.store_id]}」同步失败: ${res.msg}`, 10)
        failCount++
      }
    })

    tabsList.value = [
      {
        store_id: '',
        store_name: '全部店铺'
      },
      ...multipleSelVal.value
    ]

    messageApi.success(`同步完成: ${successCount}个店铺成功, ${failCount}个店铺失败`)
  } catch (error) {
    messageApi.error('同步订单失败')
    console.error('同步订单错误:', error)
  }
}

// 添加店铺
const handleTJDP = () => {
  authorizeGoods({ path: window.location.href }).then(
    (res: { code: number; data: { url: string | URL | undefined } }) => {
      if (res.code == 100010) {
        window.open(res.data.url)
      }
    }
  )
}
// 表格选中
const hanldeTableRowChanged = (selectedRowKeys: any, selectedRows: any) => {}

const fetchUserStoreList = async () => {
  const res = await userStoreList({ page: 1, limit: 100 })
  if (res.status == 200) {
    multipleOptions.value = res.data.list
  }
}
fetchUserStoreList()
</script>

<style scoped src="./MuchOder.scss"></style>

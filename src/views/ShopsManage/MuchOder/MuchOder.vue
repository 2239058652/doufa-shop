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
          <span>{{ tbddtext }}</span>
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
          :columns="columns"
          bordered
          :pagination="false"
          :row-selection="{
            onChange: hanldeTableRowChanged
          }"
          :hover="false"
        >
          <template #bodyCell="{ column, record }">
            <!-- 原订单商品 -->
            <template v-if="column.dataIndex === 'original_product'">
              <div class="original-product">
                <div class="dy-info">
                  <div class="shop-name">
                    <img src="../../../assets/image/douyin.png" alt="" />
                    {{ record.shop_name }}
                  </div>
                  <div class="shop-name">订单编号：{{ record.order_id }}</div>
                  <div class="shop-name"
                    >下单时间：{{ dayjs(record.create_time * 1000).format('YYYY-MM-DD HH:mm:ss') }}</div
                  >
                  <div class="shop-name">订单金额：¥{{ record.pay_amount / 100 }}</div>
                </div>
                <div v-for="(item, index) in record.sku_order_list" :key="item.app_id" class="ydd-box-flex">
                  <div class="ydd-box">
                    <img :src="item.product_pic" alt="" />
                    <div>颜色: {{ Object(item.spec[0]).value }} 件</div>
                    <div>尺码: {{ Object(item.spec[1]).value }} 件</div>
                    <div> 单价:￥{{ record.sku_order_list[index].goods_price / 100 }}元 </div>
                    <div>数量: {{ item.item_num }} 件</div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 最终代发商品 -->
            <template v-if="column.dataIndex === 'final_product'">
              <div class="daifa-box">
                <div class="final-product"></div>
                <div class="glsp-btn">
                  <span>关联商品</span>
                </div>
              </div>
            </template>
            <!-- 收件人信息 -->
            <template v-if="column.dataIndex === 'recipient_info'">
              <div>
                <span>{{ record.mask_post_receiver }}</span
                >&emsp;&emsp;
                <span>{{ record.mask_post_tel }}</span>
              </div>
              <div>
                <span>{{ record.mask_post_addr.province.name }}</span>
                <span>{{ record.mask_post_addr.city.name }}</span>
                <span>{{ record.mask_post_addr.town.name }}</span>
              </div>
              <div>{{ record.mask_post_addr.detail }}</div>
            </template>
            <!-- 利润 -->
            <template v-if="column.dataIndex === 'profit'">
              <span> {{ record.balance }}</span>
            </template>
            <!-- 订单备注 -->
            <template v-if="column.dataIndex === 'buyer_words'">
              <span> {{ record.buyer_words ? record.buyer_words : '无' }}</span>
            </template>
            <template v-if="column.key === 'operate'">
              <a-space>
                <a-button type="primary" danger>立即结算</a-button>
                <a-button type="primary" danger ghost>稍后结算</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
        <Pagination
          style="display: flex; justify-content: center; margin: 20px 0"
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="total"
          @change="handleTBDD"
          :pageSizeOptions="[10, 20, 30, 40, 50, 100]"
        />
      </div>
    </div>
    <div class="zhanwei"></div>

    <!-- 底部结算 -->
    <a-affix :offset-bottom="10" style="width: 100%">
      <div class="bottom-summary">
        <div class="summary-left">
          <div class="left-btn" v-show="true">
            <span>关联商品管理</span>
          </div>
          <Checkbox v-model="lirunVal" label="利润计算：" class="lirun" />
          <div class="antv-box">
            <div class="tbdp">快递</div>
            <a-input :bordered="false" v-model:value="formData.product" placeholder="请输入订单号" class="aselect">
            </a-input>
          </div>
          <div class="antv-box">
            <div class="tbdp">无</div>
            <a-input :bordered="false" v-model:value="formData.product" placeholder="请输入订单号" class="aselect">
            </a-input>
          </div>
        </div>
        <div class="summary-right">
          <div class="right-1">已勾选成本：</div>
          <div class="right-2">0.00</div>
          <div class="right-3">利润：</div>
          <div class="right-4">0.00</div>
          <div class="right-5">批量下为礼品单</div>
          <div class="right-6">
            <div class="right-btn-1">
              <span>稍后结算</span>
            </div>
            <div class="right-btn-2">
              <span>批量结算</span>
            </div>
          </div>
        </div>
      </div>
    </a-affix>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { message, Modal } from 'ant-design-vue'
import { userStoreList, authorizeGoods, syncDyOrder } from '@/api/shops'
import { useRouter } from 'vue-router'
import Checkbox from '@/components/checkbox/index.vue'

const router = useRouter()
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

const dateFormat = 'YYYY-MM-DD'
type RangeValue = [Dayjs, Dayjs]
const hackValue = ref<RangeValue>()

const oderCardTab = ref(0)
const columns = [
  {
    title: '原订单商品',
    align: 'center',
    dataIndex: 'original_product',
    width: 260,
    minWidth: 200,
    maxWidth: 500
  },
  {
    title: '最终代发商品',
    dataIndex: 'final_product',
    align: 'center',
    width: 150,
    minWidth: 150,
    maxWidth: 330
  },
  {
    title: '收件人信息',
    dataIndex: 'recipient_info',
    align: 'center',
    width: 150,
    minWidth: 150,
    maxWidth: 270
  },
  {
    title: '利润',
    dataIndex: 'profit',
    align: 'center'
  },
  {
    title: '订单备注',
    dataIndex: 'buyer_words',
    align: 'center'
  },
  {
    title: '操作',
    key: 'operate',
    align: 'center'
  }
]
const dataSource = ref<any>([])
const lirunVal = ref(false)
const tbddtext = ref('同步订单')

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
    tbddtext.value = '同步中...'
    messageApi.destroy()
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
        messageApi.error({
          content: () => (
            <>
              <span>
                店铺「{storeMap[res.store_id]}」同步失败: {res.msg}(点击关闭或10秒后自动关闭)
              </span>
            </>
          ),
          duration: 10,
          onClick: () => {
            messageApi.destroy()
          }
        })
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
  } finally {
    tbddtext.value = '同步订单'
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

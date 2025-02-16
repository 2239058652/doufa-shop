<template>
  <context-holder />
  <div class="user-info">
    <!-- 个人信息 -->
    <a-flex gap="20" align="center" justify="center" vertical v-show="!showUserInfo">
      <a-card style="width: 100%">
        <a-flex align="center" justify="space-between">
          <div class="user_arr" @click="showUserInfo = true">
            <div class="arr_img">
              <img :src="formDatas.avatar" alt="" />
            </div>
            <div class="user_info">
              <div class="user_nich">{{ formDatas.nickname }}</div>
              <div class="user_uid">UID：{{ formDatas.uid }}</div>
            </div>
          </div>
          <div class="youhuiquan">
            <div class="yhq_title">
              <span>优惠券</span>
              <span>0</span>
              <span>张</span>
            </div>
            <div class="yhq_card">
              <div class="yhq_img">
                <img src="../../../assets/image/youhuiquan.png" alt="" />
                <div class="yhq_font">
                  <div>暂无可用优惠券</div>
                  <div>0张优惠券可用</div>
                </div>
              </div>
              <div class="yhq_btn">
                <span @click="$router.push('/usermanage/coupon')">去查看</span>
              </div>
            </div>
          </div>
        </a-flex>
      </a-card>

      <!-- 待处理 -->
      <a-card class="dcl_card">
        <div class="dcl">待处理</div>
        <div class="dcl_item">
          <div class="item">
            <div>1230</div>
            <div>待付款</div>
          </div>
          <div class="xiantiao"> </div>
          <div class="item">
            <div>1230</div>
            <div>未发出</div>
          </div>
          <div class="xiantiao"> </div>
          <div class="item">
            <div>1230</div>
            <div>已发货</div>
          </div>
          <div class="xiantiao"> </div>
          <div class="item">
            <div>1230</div>
            <div>仅退款</div>
          </div>
          <div class="xiantiao"> </div>
          <div class="item">
            <div>1230</div>
            <div>退货退款</div>
          </div>
        </div>
      </a-card>

      <!-- 销量统计 -->
      <a-card class="xltj">
        <div class="top">
          <div class="title">销量统计</div>
          <div class="custom-radio-group">
            <div
              v-for="option in options"
              :key="option.value"
              class="custom-radio"
              :class="{ selected: selectedValue === option.value }"
              @click="handleSelect(option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
        <div class="adaptive-radio-group">
          <div
            v-for="option in options1"
            :key="option.value"
            class="adaptive-radio"
            :class="{ selected: selectedValue1 === option.value }"
            @click="handleSelect(option.value)"
          >
            {{ option.label }}
          </div>
        </div>
        <div class="echarts_wh">
          <div id="main" style="width: 100%; height: 100%"></div>
        </div>
      </a-card>
      <!-- 类别销量 -->
      <a-card class="lbxl">
        <div class="top">
          <div class="title">类别销量</div>
          <div class="custom-radio-group">
            <div
              v-for="option in options"
              :key="option.value"
              class="custom-radio"
              :class="{ selected: selectedValue === option.value }"
              @click="handleSelect(option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
        <div class="adaptive-radio-group">
          <div
            v-for="option in options1"
            :key="option.value"
            class="adaptive-radio"
            :class="{ selected: selectedValue1 === option.value }"
            @click="handleSelect(option.value)"
          >
            {{ option.label }}
          </div>
        </div>
        <div class="chart-container">
          <div class="pie-chart">
            <div id="pie" style="width: 100%; height: 100%"></div>
          </div>
          <div class="data-table">
            <div class="table-header">
              <span>种类</span>
              <span>占比</span>
              <span>销量(件)</span>
              <span>利润(元)</span>
            </div>
            <div class="table-row" v-for="item in tableData" :key="item.type">
              <span>{{ item.type }}</span>
              <span>{{ item.percent }}</span>
              <span>{{ item.sales }}</span>
              <span>{{ item.profit }}</span>
            </div>
          </div>
        </div>
      </a-card>

      <!-- 我的足迹 -->
      <a-card style="width: 100%">
        <div class="wdzj">
          <div class="title">我的足迹</div>
          <a-empty v-if="productsList.length === 0" />
          <a-skeleton :loading="productsList.length === 0" v-else active>
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
                  <span>{{ item.ot_price }}</span>
                  <span>{{ item.sales }}人已购买</span>
                </div>
              </div>
            </div>
          </a-skeleton>
        </div>
      </a-card>
    </a-flex>

    <!-- 修改基本信息 -->
    <a-card v-show="showUserInfo">
      <div class="info_title">基本信息</div>
      <a-form
        :colon="false"
        labelAlign="right"
        :labelCol="{ span: 2 }"
        class="demo-form-inline"
        :rules="rules"
        autocomplete="off"
        :model="formDatas"
      >
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="头像">
              <a-flex gap="10px" vertical justify="center" align="center" style="width: 120px; height: auto">
                <div class="attr_img">
                  <img :src="formDatas.avatar" alt="头像" />
                </div>
                <div class="arr_calss">
                  <a-upload
                    accept=".png,.jpg,.jpeg,.pneg"
                    :max-count="1"
                    :beforeUpload="handleUpload"
                    :showUploadList="false"
                  >
                    <span>更换头像</span>
                  </a-upload>
                </div>
              </a-flex>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用户名" name="nickname">
              <a-input v-model:value="formDatas.nickname" placeholder="用户名" style="width: 30%" autocomplete="off" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="UID">
              <a-input v-model:value="formDatas.uid" placeholder="uid" style="width: 30%" autocomplete="off" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用户组">
              <a-input
                v-model:value="formDatas.user_type"
                placeholder="用户组"
                style="width: 30%"
                autocomplete="off"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="密码" name="code">
              <a-input-password
                v-model:value="formDatas.code"
                placeholder="密码"
                :visibility-toggle="false"
                autocomplete="current-password"
                style="width: 30%"
              />
              <span class="code_cls" @click="handleEditCode">更改密码</span>
            </a-form-item>
          </a-col>
          <a-form-item noStyle>
            <span class="submit_btn" @click="handleEditUserInfo">
              <span>提交</span>
            </span>
            <span class="cancel_btn" @click="showUserInfo = false">
              <span>取消</span>
            </span>
          </a-form-item>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { fetchUploadFile } from '@/api/index'
import { getProducts } from '@/api/store'
import { getUserInfo, editUser } from '@/api/user'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type { ComposeOption } from 'echarts/core'
import type { LineSeriesOption, PieSeriesOption } from 'echarts/charts'
import { debounce } from '@/utils/util'

type ECOption = ComposeOption<LineSeriesOption | PieSeriesOption>
// 注册必需的组件
echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition
])

const router = useRouter()
const topMenuRef = inject('topMenuRef') as any // 获取退出登录弹窗

let chartDom: HTMLElement | null = null
let chartPieDom: HTMLElement | null = null
let myChart: echarts.ECharts
let myPieChart: echarts.ECharts
let option: ECOption | any
let pieOption: ECOption | any

pieOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    top: 'center',
    right: '40%', // 调整右侧距离
    itemGap: 40, // 图例项之间的间距
    itemWidth: 10, // 图例标记的宽度
    itemHeight: 10, // 图例标记的高度
    textStyle: {
      fontSize: 14,
      color: '#666666'
    }
  },
  series: [
    {
      type: 'pie',
      radius: '70%',
      center: ['25%', '50%'],
      data: [
        { value: 1048, name: '男装', itemStyle: { color: '#FFD168' } },
        { value: 735, name: '女装', itemStyle: { color: '#FD5474' } },
        { value: 580, name: '童装', itemStyle: { color: '#6198FC' } }
      ],
      label: {
        show: false
      }
    }
  ]
}

option = {
  tooltip: {
    trigger: 'axis',
    formatter: function (params: any) {
      return `<div style="color: #666666">${params[0].value}件</div>
              <div style="color: #F23025">￥998</div>`
    },
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [
        '10/2',
        '10/4',
        '10/6',
        '10/8',
        '10/10',
        '10/12',
        '10/14',
        '10/16',
        '10/18',
        '10/20',
        '10/22',
        '10/24',
        '10/26',
        '10/28',
        '10/30'
      ]
    }
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      max: 100
    }
  ],
  series: [
    {
      name: '销量',
      type: 'line',
      stack: 'Total',

      smooth: true,
      showSymbol: false,
      areaStyle: {
        color: '#F23025',
        opacity: 0.1
      },
      lineStyle: {
        color: '#F23025'
      },
      itemStyle: {
        color: '#F23025'
      },
      emphasis: {
        focus: 'series'
      },
      data: [45, 32, 65, 78, 24, 56, 89, 43, 67, 45, 90, 23, 45, 78, 56]
    }
  ]
}
const chartData: any = {
  a: [45, 32, 65, 78, 24, 56, 89, 43, 67, 45, 90, 23, 45, 78, 56],
  b: [23, 45, 67, 89, 34, 67, 45, 78, 90, 12, 34, 56, 78, 89, 67],
  c: [78, 56, 34, 12, 45, 78, 90, 23, 45, 67, 89, 34, 56, 78, 90],
  d: [34, 56, 78, 90, 23, 45, 67, 89, 12, 34, 56, 78, 90, 23, 45]
}

const tableData = ref([
  {
    type: '男装',
    percent: '44.3%',
    sales: '1048',
    profit: '52400'
  },
  {
    type: '女装',
    percent: '31.1%',
    sales: '735',
    profit: '36750'
  },
  {
    type: '童装',
    percent: '24.6%',
    sales: '580',
    profit: '29000'
  }
])

const productsList = ref<any>([]) // 商品列表

// 获取商品列表
const getProductsList = async () => {
  const res = await getProducts({
    page: 1,
    limit: 18
  })

  if (res.status === 200) {
    productsList.value = res.data.list || []
  } else {
    messageApi.error(res.msg)
  }
}

// 跳转商品详情
const routerToDetail = (item: any) => {
  router.push({
    path: `/merchandis/${item.id}`
  })
}

// echarts 自适应
const handleResize = debounce(() => {
  myChart?.resize()
  myPieChart?.resize()
}, 100)

const initCharts = () => {
  try {
    chartDom = document.getElementById('main')
    chartPieDom = document.getElementById('pie')

    if (chartDom) {
      myChart = echarts.init(chartDom)
      option && myChart.setOption(option)
    }

    if (chartPieDom) {
      myPieChart = echarts.init(chartPieDom)
      pieOption && myPieChart.setOption(pieOption)
    }

    window.addEventListener('resize', handleResize, { passive: true })
  } catch (error) {
    console.error('Error initializing charts:', error)
  }
}

let originalAddEventListener: typeof EventTarget.prototype.addEventListener | null = null

onMounted(() => {
  initCharts()

  originalAddEventListener = EventTarget.prototype.addEventListener

  EventTarget.prototype.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    if (type === 'wheel') {
      const opts = typeof options === 'object' ? { ...options, passive: true } : { passive: true }
      return originalAddEventListener!.call(this, type, listener, opts)
    }
    return originalAddEventListener!.call(this, type, listener, options)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (originalAddEventListener) {
    EventTarget.prototype.addEventListener = originalAddEventListener
  }
})

const [messageApi, contextHolder] = message.useMessage()

const showUserInfo = ref(false)
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Please input Activity name', trigger: 'change' }],
  code: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }]
}
const formDatas = ref<any>(JSON.parse(localStorage.getItem('userInfo') || '{}'))

const options = [
  { value: 'a', label: '日' },
  { value: 'b', label: '月' },
  { value: 'c', label: '年' }
]
const options1 = [
  { value: 'a', label: '全部' },
  { value: 'b', label: '菲菲不是菲菲' },
  { value: 'c', label: '哈喽克缇' },
  { value: 'd', label: '沉香的男装店' }
]

const selectedValue = ref('a')
const selectedValue1 = ref('a')

const fileList = ref([])

const handleSelect = (value: string) => {
  selectedValue.value = value
  selectedValue1.value = value
  option.series[0].data = chartData[value]
  myChart.setOption(option)
}

// 更换头像上传
const handleUpload = async (file: any) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetchUploadFile(formData)
    if (res.status === 200) {
      formDatas.value.avatar = res.data.url
      fileList.value = []
      return false
    } else {
      messageApi.error(res.msg)
      return false // 上传失败，阻止上传
    }
  } catch (e) {
    messageApi.error('上传失败')
    return false
  }
}

// 更改密码
const handleEditCode = async () => {
  topMenuRef.value.handleRegister('chognzhi')
}

// 用户信息
const fetchUserInfo = () => {
  getUserInfo().then((res: any) => {
    if (res.status == 200) {
      formDatas.value = res.data
      localStorage.setItem('userInfo', JSON.stringify(res.data))
    }
  })
}

// 修改个人信息
const handleEditUserInfo = () => {
  editUser({ nickname: formDatas.value.nickname, avatar: formDatas.value.avatar, alipay: formDatas.value.alipay }).then(
    (res: any) => {
      if (res.status == 200) {
        messageApi.success('修改个人信息成功')
        showUserInfo.value = false
        fetchUserInfo()
      } else {
        messageApi.error(res.msg)
      }
    }
  )
}

getProductsList() // 获取商品列表
</script>

<style scoped src="./UserInfo.scss"></style>
<style scoped lang="scss">
.custom-radio-group {
  display: flex;
}

.custom-radio {
  width: 42px;
  height: 24px;
  line-height: 19px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  /* 未选中时文字颜色 */
  border: 1px solid #e1e1e1;
  /* 默认边框颜色 */
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 文字靠左对齐 */
}

.custom-radio.selected {
  border-color: f83126;
  /* 选中时边框颜色 */
  color: $red-color;
  /* 选中时文字颜色 */
}

.custom-radio.selected {
  color: $red-color;
  /* 选中时颜色 */
}

.adaptive-radio-group {
  margin-top: 30px;
  display: flex;
  gap: 14px;
}

.adaptive-radio {
  padding: 0 12px;
  /* 左右内边距，确保文字周围有空间 */
  height: 34px;
  border-radius: 6px;
  background-color: #f7f8fa;
  display: inline-flex;
  /* 自适应宽度 */
  align-items: center;
  justify-content: center;
  /* 文字居中 */
  font-family: MicrosoftYaHei, sans-serif;
  font-size: 16px;
  line-height: 21px;
  color: #666666;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-style: normal;
  border: 1px solid #e1e1e1;
  /* 默认边框 */
}

.adaptive-radio.selected {
  background-color: #ffebe9;
  color: $red-color;
  border-color: $red-color;
}
</style>

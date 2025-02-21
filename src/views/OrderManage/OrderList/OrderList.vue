<template>
  <context-holder />
  <div class="order-list">
    <!-- 订单种类tabs -->
    <a-card class="list-card">
      <div class="tabs">
        <div
          v-for="(item, index) in listCardTabs"
          :key="index"
          class="tab"
          :class="{ active: activeTab === index }"
          @click="handleTabClick(index)"
        >
          <span>{{ item }}</span>
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
                <a-button type="primary" danger @click="handleSearch">查询</a-button>
                <a-button type="primary" @click="handleClean">重置</a-button>
                <a-button type="primary" @click="handleExportcel">导出订单</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="table-btn">
        <a-space :size="24">
          <div class="btn"><span>批量付款</span></div>
          <div class="btn btn-white"><span>批量删除</span></div>
          <div class="btn btn-yellow"><span>批量改款</span></div>
        </a-space>
      </div>
      <div class="table-box">
        <div class="header">
          <div class="column-title div-0">
            <span> <Checkbox v-model="checkedAll" label="" /></span>
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
              <Checkbox style="width: 18px; height: 18px; margin-left: 20px" v-model="item.checked" label="" />
              <div class="bianhao">
                <span>订单编号：1234567654322356</span>
                <img
                  class="copy-icon"
                  src="../../../assets/image/copy.png"
                  alt=""
                  @click="handleUseCopy(1234567654322356)"
                />
              </div>
              <div class=""><span>交易创建时间：2024/09/19 10:28:21</span></div>
              <div class=""><span>订单来源：抖音【店铺名称】</span></div>
              <div class="bianhao">
                <span>订单来源订单编号：1234567654322356</span>
                <img
                  class="copy-icon"
                  src="../../../assets/image/copy.png"
                  alt=""
                  @click="handleUseCopy(1234567654322356)"
                />
              </div>
            </div>
            <div class="item">
              <div class="good">
                <div class="goods" v-for="i in item.cartInfo" :key="i.id">
                  <img :src="i.productInfo.image" alt="" />
                  <div class="goods-info">
                    <div class="font">商家：超级男装</div>
                    <div class="font">货号：21324</div>
                    <div class="font">站点：常熟</div>
                    <div class="font" style="color: #ff5c02">¥21.42</div>
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
              <div class="status">1</div>
              <div class="address">1</div>
              <div class="beizhu">1</div>
              <div class="operater">1</div>
            </div>
            <div class="bom">
              <div>抖店面单：顺丰快递（10.00元）</div>
              <div class="bianhao">
                <span>物流单号：1234567654322356</span>
                <img
                  class="copy-icon"
                  src="../../../assets/image/copy.png"
                  alt=""
                  @click="handleUseCopy(1234567654322356)"
                />
              </div>
              <div>发货时间：2024/09/19 10:28:21</div>
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
  </div>
</template>

<script lang="ts" setup>
import Pagination from '@/components/pagination/index.vue'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { aorderList } from '@/api/order'
import dayjs from 'dayjs'
import { Dayjs } from 'dayjs'

import Checkbox from '@/components/checkbox/index.vue'
import { useClipboard } from '@vueuse/core'

const dateFormat = 'YYYY-MM-DD'
type RangeValue = [Dayjs, Dayjs] | [string, string]
const hackValue = ref<RangeValue>()

const [messageApi, contextHolder] = message.useMessage()
const nowtime = dayjs().unix()
const checkedAll = ref<boolean>(false)

const formData = ref({
  store_name: '',
  store_id: '',
  order_ids: '',
  time_start: '',
  time_end: ''
})
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数
const dataSource = ref<any>([])
const originalData = ref([])
const activeTab = ref(0)
const listCardTabs = ['全部', '待付款', '待发货', '已发货', '售后订单', '未拿到货']

// 切换tab
const handleTabClick = (index: number) => {
  activeTab.value = index
}

// 获取颜色
const getColor = (suk: string) => {
  return suk.split(',')[0]
}

// 获取尺码
const getSize = (suk: string) => {
  return suk.split(',')[1]
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
  const { copy } = useClipboard({ source, legacy: true })
  copy(source)
  messageApi.success('复制成功')
}

// 本地搜索方法
const handleSearch = () => {
  let result = [...originalData.value]

  if (formData.value.store_name) {
    result = result.filter((item: any) =>
      item.store_name.toLowerCase().includes(formData.value.store_name.toLowerCase())
    )
  }

  if (formData.value.store_id) {
    result = result.filter((item: any) => item.store_id.toString().includes(formData.value.store_id))
  }

  dataSource.value = result
  total.value = result.length
} // 重置
const handleClean = () => {
  formData.value = {
    store_name: '',
    store_id: '',
    order_ids: '',
    time_start: '',
    time_end: ''
  }
  dataSource.value = originalData.value
  total.value = originalData.value.length
}

// 导出订单
const handleExportcel = () => {}

// 获取订单列表
const getOrderList = () => {
  aorderList({ page: currentPage.value, limit: pageSize.value, ...formData.value }).then((res: any) => {
    if (res.status == 200) {
      dataSource.value = res.data.list
      originalData.value = res.data.list
      total.value = res.data.count
    } else {
      messageApi.error(res.msg)
    }
  })
}

getOrderList()
</script>

<style scoped src="./OrderList.scss"></style>

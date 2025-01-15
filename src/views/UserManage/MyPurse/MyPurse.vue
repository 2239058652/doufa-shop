<template>
  <context-holder />
  <div class="my-purse">
    <a-flex vertical :gap="20">
      <!-- 个人信息 -->
      <a-card class="avatar-card">
        <div class="avatar-space">
          <a-space :size="9" class="avatar">
            <img :src="userInfo.avatar" alt="" />
            <a-flex vertical :gap="8">
              <div class="nickname">HI, {{ userInfo.nickname }}</div>
              <div class="uid"> UID：{{ userInfo.uid }}</div>
            </a-flex>
          </a-space>
          <a-space :size="24" class="btn-group">
            <div class="btn">
              <span>绑定管理</span>
            </div>
            <div class="btn">
              <span>设置支付密码</span>
            </div>
          </a-space>
        </div>
      </a-card>

      <!-- 账户余额 -->
      <a-card class="zhye">
        <a-flex justify="space-between" align="center" style="padding: 0 30px">
          <a-space :size="100">
            <div class="a-flex">
              <div class="yue">{{ userInfo.now_money }}</div>
              <div class="jine">账户余额(元)</div>
            </div>
            <div class="xiantiao"> </div>
            <div class="a-flex">
              <div class="yuan">1001</div>
              <div class="jine">申请退款中(元)</div>
            </div>
            <div class="xiantiao"> </div>
            <div class="a-flex">
              <div class="yuan">1001</div>
              <div class="jine">提现在途(元)</div>
            </div>
          </a-space>
          <a-space>
            <a-space :size="24">
              <div class="btn" style="background: #f7f8fa">
                <span>充值</span>
              </div>
              <div class="btn">
                <span>提现</span>
              </div>
            </a-space>
          </a-space>
        </a-flex>
      </a-card>
      <!-- 今日利润（元） -->
      <a-card class="jrlr">
        <a-flex justify="space-around" align="center" style="padding: 0 30px">
          <div class="kuai">
            <img src="../../../assets/image/jrlr.png" alt="jrlr" />
            <div class="a-flex">
              <div class="jrlr">688,642.00</div>
              <div class="jine">今日利润(元)</div>
            </div>
          </div>
          <div class="xiantiao"> </div>
          <div class="kuai">
            <img src="../../../assets/image/ljlr.png" alt="ljlr" />
            <div class="a-flex">
              <div class="ljlr">688,642.00</div>
              <div class="jine">累计利润(元)</div>
            </div>
          </div>
          <div class="xiantiao"> </div>
          <div class="kuai">
            <img src="../../../assets/image/ljtx.png" alt="ljtx" />
            <div class="a-flex">
              <div class="ljtx">688,642.00</div>
              <div class="jine">累计提现(元)</div>
            </div>
          </div>
        </a-flex>
      </a-card>

      <!-- 列表记录 -->
      <a-card class="lbjl">
        <a-form :colon="false" :model="formData">
          <a-row :gutter="16">
            <a-col :span="4">
              <a-form-item label="订单编号">
                <a-input v-model:value="formData.keyWord" allowClear placeholder="请输入订单编号" />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="类型">
                <a-select v-model:value="formData.BalanceType">
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option :value="1">支出</a-select-option>
                  <a-select-option :value="2">收入</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="时间">
                <a-range-picker
                  :value="hackValue"
                  :format="dateFormat"
                  @change="onChange"
                  :placeholder="['开始时间', '结束时间']"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="">
                <a-space :size="24">
                  <a-button type="primary" @click="getProductsList">查找</a-button>
                  <a-button type="primary" @click="handleExport">导出明细</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination="false"
          :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
        >
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
                <ArrowUpOutlined />
              </a-tag>
              <a-tag color="error" v-else>
                <span>-￥{{ record.number }}</span>
                <ArrowDownOutlined />
              </a-tag>
            </template>
            <template v-if="column.key === 'operate'">
              <a-button type="link">查看订单</a-button>
            </template>
          </template>
        </a-table>
        <Pagination
          style="display: flex; justify-content: center; margin: 20px 0"
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="total"
          @change="getProductsList"
          :pageSizeOptions="[10, 20, 30, 40, 50, 100]"
        />
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import { getUserBalance } from '@/api/user'
import type { BalanceType } from '@/api/user'
import { message } from 'ant-design-vue'
import { Dayjs } from 'dayjs'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons-vue'
import * as XLSX from 'xlsx'

const dateFormat = 'YYYY-MM-DD'
type RangeValue = [Dayjs, Dayjs]
const hackValue = ref<RangeValue>()

const [messageApi, contextHolder] = message.useMessage()
const formData = ref<{
  startTime: string
  endTime: string
  keyWord: string
  BalanceType: BalanceType
}>({
  startTime: '',
  endTime: '',
  keyWord: '',
  BalanceType: 0
})
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

const dataSource = ref([])
const columns = ref([
  {
    title: '类型',
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
    title: '操作',
    key: 'operate',
    align: 'center'
  }
])

const getProductsList = () => {
  getUserBalance({
    page: currentPage.value,
    limit: pageSize.value,
    BalanceType: formData.value.BalanceType,
    keyWord: formData.value.keyWord,
    startTime: formData.value.startTime,
    endTime: formData.value.endTime,
    keyWordType: 'order'
  }).then((res: any) => {
    if (res.status == 200) {
      dataSource.value = res.data.list
      total.value = res.data.count
    } else {
      messageApi.error(res.msg)
    }
  })
}
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
const handleExport = () => {
  // 准备导出数据
  const exportData = dataSource.value.map((item: any) => ({
    类型: item.type === 1 ? '支出' : '收入',
    订单编号: item.order_id,
    原金额: item.pm == 1 ? '+' + item.balance : '-' + item.balance,
    金额变动: item.number,
    剩余金额: item.balance,
    日期: item.add_time
  }))

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(exportData)
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '余额明细')
  // 导出文件
  XLSX.writeFile(wb, `余额明细${new Date().getTime()}.xlsx`)
}

getProductsList()
</script>

<style scoped src="./MyPurse.scss"></style>

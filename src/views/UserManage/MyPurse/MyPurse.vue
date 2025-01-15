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
              <div class="jine">账户余额（元）</div>
            </div>
            <div class="xiantiao"> </div>
            <div class="a-flex">
              <div class="yuan">10010.010</div>
              <div class="jine">申请退款中（元）</div>
            </div>
            <div class="xiantiao"> </div>
            <div class="a-flex">
              <div class="yuan">111000.00</div>
              <div class="jine">提现在途（元）</div>
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
              <div class="jine">今日利润（元）</div>
            </div>
          </div>
          <div class="xiantiao"> </div>
          <div class="kuai">
            <img src="../../../assets/image/ljlr.png" alt="ljlr" />
            <div class="a-flex">
              <div class="ljlr">688,642.00</div>
              <div class="jine">累计利润（元）</div>
            </div>
          </div>
          <div class="xiantiao"> </div>
          <div class="kuai">
            <img src="../../../assets/image/ljtx.png" alt="ljtx" />
            <div class="a-flex">
              <div class="ljtx">688,642.00</div>
              <div class="jine">累计提现（元）</div>
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
                <a-input></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="类型">
                <a-select></a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="时间">
                <a-range-picker v-model:value="formData.time" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="">
                <a-space :size="24">
                  <a-button type="primary">查找</a-button>
                  <a-button type="primary">导出明细</a-button>
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
          <template #bodyCell="{ column }">
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
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'
import { getUserBalance } from '@/api/user'
import { message } from 'ant-design-vue'

const [messageApi, contextHolder] = message.useMessage()
const formData = ref({
  tiem: ''
})
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

const dataSource = ref([
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
])
const columns = ref([
  {
    title: '类型',
    dataIndex: 'name',
    align: 'center',
    key: 'name'
  },
  {
    title: '订单编号',
    dataIndex: 'age',
    align: 'center',
    key: 'age'
  },
  {
    title: '原金额',
    dataIndex: 'address',
    align: 'center',
    key: 'address'
  },
  {
    title: '金额变动',
    dataIndex: 'name',
    align: 'center',
    key: 'name'
  },
  {
    title: '剩余金额',
    dataIndex: 'age',
    align: 'center',
    key: 'age'
  },
  {
    title: '日期',
    dataIndex: 'address',
    align: 'center',
    key: 'address'
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
    BalanceType: 0,
    keyWord: '',
    startTime: '',
    endTime: ''
  }).then((res: any) => {
    console.log(res)
    if (res.status == 200) {
      dataSource.value = res.data.list
      total.value = res.data.count
    } else {
      messageApi.error(res.msg)
    }
  })
}
getProductsList()
</script>

<style scoped src="./MyPurse.scss"></style>

<template>
  <context-holder />
  <div class="contain">
    <a-flex gap="20" align="center" justify="center" vertical>
      <!-- 登录记录 -->
      <a-card class="lbjl">
        <div class="title">登录记录</div>
        <a-form :colon="false" :modal="formData">
          <a-row :gutter="16" style="display: flex; justify-content: space-between; padding: 0 20px">
            <a-form-item label="时间">
              <a-range-picker
                :value="hackValue"
                :format="dateFormat"
                @change="onChange"
                :placeholder="['开始时间', '结束时间']"
              />
            </a-form-item>
            <a-form-item label="">
              <a-input
                placeholder="请输入登录IP"
                style="width: 244px"
                v-model:value="formData.keyWord"
                @pressEnter="getRecordsList"
              >
                <template #suffix>
                  <div style="cursor: pointer" @click="getRecordsList">
                    <SearchOutlined />
                  </div>
                </template>
              </a-input>
            </a-form-item>
          </a-row>
        </a-form>
        <a-skeleton :loading="loading" active>
          <a-table
            :dataSource="dataSource"
            :columns="[
              {
                title: '登录IP',
                align: 'center',
                dataIndex: 'ip'
              },
              {
                title: '登录时间',
                dataIndex: 'time',
                align: 'center'
              }
            ]"
            bordered
            :pagination="false"
            :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'time'"
                >{{ dayjs(record.time * 1000).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </template>
          </a-table>
          <Pagination
            style="display: flex; justify-content: center; margin: 20px 0"
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="total"
            @change="getRecordsList"
            :pageSizeOptions="[10, 20, 30, 40, 50, 100]"
          />
        </a-skeleton>
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import Pagination from '@/components/pagination/index.vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { ref } from 'vue'
import { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { getLoginHistory } from '@/api/user'

const [messageApi, contextHolder] = message.useMessage()
const dateFormat = 'YYYY-MM-DD'
type RangeValue = [Dayjs, Dayjs]
const hackValue = ref<RangeValue>()

const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数
const loading = ref(false) // 加载状态

const formData = ref({
  startTime: '',
  endTime: '',
  keyWord: ''
})
const dataSource = ref([])

const getRecordsList = () => {
  loading.value = true
  getLoginHistory({
    page: currentPage.value,
    limit: pageSize.value
  }).then((res: any) => {
    if (res.status == 200) {
      dataSource.value = res.data.list
      total.value = res.data.count
      loading.value = false
    } else {
      messageApi.error(res.msg)
      loading.value = false
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

getRecordsList()
</script>

<style scoped src="./LoginRecord.scss"></style>

<template>
  <context-holder />
  <div class="order-store">
    <div class="warning-card">
      <span>注意：</span>
      <span>如授权已过期或失效，请删除后，重新添加店铺。</span>
    </div>
    <!-- 列表记录 -->
    <a-card class="store-card">
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 0 }" @click="handleTabClick(0)">
          <span>全部平台</span>
        </div>
        <div class="tab" :class="{ active: activeTab === 1 }" @click="handleTabClick(1)">
          <span>抖店</span>
        </div>
        <div class="tab" :class="{ active: activeTab === 2 }" @click="handleTabClick(2)">
          <span>快手</span>
        </div>
        <div class="tab" :class="{ active: activeTab === 3 }" @click="handleTabClick(3)">
          <span>淘宝</span>
        </div>
      </div>
      <a-form :colon="false" :model="formData">
        <a-row :gutter="16">
          <a-col :span="5">
            <a-form-item label="店铺名称">
              <a-input v-model:value="formData.store_name" allowClear placeholder="请输入店铺名称" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="店铺ID">
              <a-input v-model:value="formData.store_id" allowClear placeholder="请输入店铺ID" />
            </a-form-item>
          </a-col>
          <a-col :span="8" style="margin-left: 60px">
            <a-form-item label="">
              <a-space :size="24">
                <a-button type="primary" danger @click="handleSearch">查询</a-button>
                <a-button type="primary" @click="handleClean">重置</a-button>
                <a-button type="primary" danger ghost @click="handleAdd">添加店铺</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        :dataSource="dataSource"
        :columns="[
          {
            title: '店铺名称',
            dataIndex: 'store_name',
            align: 'center'
          },
          {
            title: '店铺ID',
            align: 'center',
            dataIndex: 'store_id'
          },
          {
            title: '类型',
            dataIndex: 'store_type_label',
            align: 'center'
          },
          {
            title: '店铺状态',
            dataIndex: 'expire_time',
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
        :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : '')"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'store_type_label'">
            <div class="store-type">
              <img src="../../../assets/image/douyin.png" alt="" />
              <span>{{ '抖店' }}</span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'expire_time'">
            <a-tag color="success" v-if="record.expire_time > nowtime">{{ '正常' }}</a-tag>
            <a-tag color="error" v-else>{{ '授权已过期' }}</a-tag>
          </template>
          <template v-if="column.key === 'operate'">
            <a-popconfirm
              v-if="record.expire_time > nowtime"
              title=" 确定解绑此店铺吗? "
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleUnBind(record.store_id)"
            >
              <div class="jb-btn">解绑</div>
            </a-popconfirm>

            <a-space v-else>
              <a-button type="link">购买</a-button>
              <a-button type="link" style="color: #999999">移除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
      <Pagination
        style="display: flex; justify-content: center; margin: 20px 0"
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="total"
        @change="getStoreList"
        :pageSizeOptions="[10, 20, 30, 40, 50, 100]"
      />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import Pagination from '@/components/pagination/index.vue'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { userStoreList, authorizeGoods, unbindStore } from '@/api/shops'
import dayjs from 'dayjs'

const [messageApi, contextHolder] = message.useMessage()
const nowtime = dayjs().unix()

const formData = ref<{
  store_name: string
  store_id: string
}>({
  store_name: '',
  store_id: ''
})
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数
const dataSource = ref([])
const originalData = ref([])
const activeTab = ref(0)

// 切换tab
const handleTabClick = (index: number) => {
  if (index == 2 || index == 3) {
    messageApi.warning('暂未开放')
    return
  }
  activeTab.value = index
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
    store_id: ''
  }
  dataSource.value = originalData.value
  total.value = originalData.value.length
}

// 解绑店铺
const handleUnBind = (id: string) => {
  unbindStore(id).then((res: any) => {
    if (res.status == 200) {
      messageApi.success(res.msg)
      getStoreList()
    } else {
      messageApi.error(res.msg)
    }
  })
}

// 添加店铺
const handleAdd = () => {
  authorizeGoods({ path: window.location.href }).then(
    (res: { code: number; data: { url: string | URL | undefined }; msg: string }) => {
      if (res.code == 100010) {
        window.open(res.data.url)
      } else {
        messageApi.error(res.msg)
      }
    }
  )
}

// 获取店铺列表
const getStoreList = () => {
  userStoreList({ page: currentPage.value, limit: pageSize.value }).then((res: any) => {
    if (res.status == 200) {
      dataSource.value = res.data.list
      originalData.value = res.data.list
      total.value = res.data.count
    } else {
      messageApi.error(res.msg)
    }
  })
}

getStoreList()
</script>

<style scoped src="./OrderStore.scss"></style>

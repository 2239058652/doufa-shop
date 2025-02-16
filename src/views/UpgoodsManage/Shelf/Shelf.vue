<template>
  <div class="order_list">
    <div class="topBox">
      <div class="top_item">
        <el-button :color="'var(--red-color)'" @click="handleUploadShops">批量上传</el-button>
        <el-button type="info" plain>批量删除</el-button>
      </div>
    </div>
    <div class="table_title"></div>
    <el-table
      :data="tableDataList"
      border
      height="550px"
      :highlight-current-row="false"
      @selection-change="handleSelectionChange"
      style="width: 1560px; margin-left: 38px; margin-top: 10px"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="store_id" label="商品详情">
        <template #default="scope">
          <img src="../../../assets/fonts/winter_img2.png" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="store_name" label="商品单价(元)" align="center"></el-table-column>
      <el-table-column prop="store_intr" label="上架时间"></el-table-column>
      <el-table-column prop="store_type_label" label="添加时间"></el-table-column>
      <el-table-column prop="name" fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button link type="primary" @click="uploadToShop(scope.row)">上传</el-button>
          <el-button link type="info">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      style="display: flex; justify-content: center; margin: 20px 0"
      v-model:current="pager.page"
      v-model:pageSize="pager.limit"
      :total="pagerTotal"
      @change="getStoreList"
      :pageSizeOptions="[10, 20, 30, 40, 50, 100]"
    />

    <!-- 批量上传modal -->
    <UploadModel ref="uploadModelRef" />

    <!-- 上传店铺 -->
    <div class="upload_mask" v-if="uploadState">
      <div class="upload_con">
        <div class="top">
          <div></div>
          <div class="title">上传店铺</div>
          <img @click="uploadState = false" src="../../../assets/image/close.png" alt="" />
        </div>
        <div class="center">
          <div style="margin-left: 42px; display: flex; justify-content: space-between; align-items: center">
            <el-button type="danger" plain @click="toAddShopList">添加店铺</el-button>
          </div>
          <el-table
            border
            :highlight-current-row="false"
            style="width: 95%; height: 80%; margin-left: 38px; margin-top: 10px"
            :data="storeTableData"
            tooltip-effect="dark"
          >
            <el-table-column prop="store_id" label="ID" align="center">
              <template #default="scope">
                <div style="display: flex; align-items: center; justify-content: center; margin-top: 0">
                  <span style="width: 18px; height: 18px">
                    <img style="width: 18px; height: 18px" src="../../../assets/fonts/douyin_upload.png" alt="" />
                  </span>
                  <span style="margin-left: 10px">{{ scope.row.store_id }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="store_name" label="店铺" align="center">
              <template #default="scope">
                {{ scope.row.store_name }}
              </template>
            </el-table-column>
            <el-table-column prop="store_name" label="操作" align="center">
              <template #default="scope">
                <el-button type="danger" @click="confirmUpload(scope.row)">确认上传</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { AuthShopList, getSellsUpload, AuthStoreGoodsList } from '@/api/upstore'
import UploadModel from './components/ShopsModal.vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/pagination/index.vue'

// 订单列表分页
const pager = reactive({
  limit: 10,
  page: 1
})

// 表格店铺列表
const storeTableData = ref([])

// 批量上传ref
const uploadModelRef = ref()

// 表格数据
const tableDataList = ref([])

// 分页总数
const pagerTotal = ref(0)

// 商品上货选择
const selecteData = ref([])

// 批量上传选择店铺隐藏显示
const uploadState = ref(false)

// 上传参数
const toAddShopsDetailList = ref<any>([])

// 批量上传
const handleUploadShops = async () => {
  handleUpShop(selecteData.value)
}
// 上传按钮
const uploadToShop = (row: any) => {
  handleUpShop([row])
}
// 打开店铺选择列表，处理单传或者批量
const handleUpShop = (row: any[]) => {
  toAddShopsDetailList.value = row
  uploadState.value = true
}

// 选择店铺确认上传按钮
const confirmUpload = (row: any) => {
  uploadState.value = false
  uploadModelRef.value.handleInit(toAddShopsDetailList.value, row)
}

// 表格选择项
const handleSelectionChange = async (val: any) => {
  selecteData.value = val
}

// 获取选货列表
const getStoreList = async () => {
  AuthShopList(pager).then((res: { status?: any; data?: any }) => {
    if (res.status === 200) {
      const {
        data: { list, count }
      } = res
      tableDataList.value = list
      pagerTotal.value = Number(count)
    }
  })
}

// 添加店铺/跳转授权
const toAddShopList = () => {
  getSellsUpload({
    path: window.location.href
  }).then((res) => {
    if (res.code == 100010) {
      window.open(res.data.url)
    }
  })
}
// 获取店铺列表
const fetchStoreList = () => {
  AuthStoreGoodsList().then((res) => {
    storeTableData.value = res.data.list
    if (res.data.list.length == 0) {
      ElMessage.error('请先添加店铺')
      return
    }
  })
}

fetchStoreList()
getStoreList()
</script>

<style src="./Shelf.scss" scoped></style>
<style scoped>
.upload_mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 111;
  z-index: 1299;

  .upload_con {
    width: 832px;
    height: 578px;
    border-radius: 24px;
    background: #f7f7f7;
    left: 50%;
    top: 50%;
    position: fixed;
    transform: translate(-50%, -50%);

    .top {
      width: 754px;
      height: 31px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 31px;
      margin-left: 32px;

      img {
        width: 24px;
        height: 24px;
        cursor: pointer;
      }

      .title {
        font-size: 24px;
        color: #333;
        font-weight: bold;
      }
    }

    .center {
      width: 754px;
      height: 450px;
    }

    .bottom {
      margin: 0 45%;
    }

    .bot {
      margin-left: 35px;
      margin-top: 37px;
      display: flex;
      flex-wrap: wrap;

      .douyin {
        width: 162px;
        height: 162px;
        display: flex;
        flex-direction: column;
        background: #ccc;
        border-radius: 6px;
        margin: 15px;

        img {
          width: 53px;
          height: 53px;
          margin-left: 54px;
          margin-top: 26px;
        }

        .title {
          color: #333;
          font-size: 12px;
          margin-top: 6px;
          margin-left: 69px;
        }

        .clicks {
          width: 104px;
          height: 26px;
          margin-top: 7px;
          margin-left: 29px;
          display: flex;
          justify-content: space-between;

          div {
            width: 50px;
            height: 26px;
            background: #000;
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 26px;
            border-radius: 3px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

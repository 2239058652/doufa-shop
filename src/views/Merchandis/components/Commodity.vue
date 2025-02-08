<template>
  <context-holder />
  <a-modal
    v-model:open="dialogVisible"
    :title="dialogTitle"
    width="95%"
    :style="{ top: '1vh' }"
    @cancel="handleDialogClosed"
    destroyOnClose
  >
    <div class="content">
      <!-- 左侧ssasahsahg商品名称价格 设置 -->
      <div class="left_content">
        <div class="left_name">商品名称</div>
        <div class="left_radio">
          <a-col :span="24">
            <span style="font-size: 12px; font-weight: bold">价格设置:</span>
          </a-col>
          <a-radio-group v-model:value="formData.cgorlrRio" @change="handleRadioChange">
            <a-radio :style="radioStyle" :value="1" class="radio-item">
              来源价+
              <a-input-number
                :disabled="formData.cgorlrRio == 2"
                v-model:value="formData.cgval"
                style="width: 146px; margin-left: 8px"
                @change="handleCgChange"
              >
                <template #addonAfter>
                  <span>元</span>
                </template>
              </a-input-number>
            </a-radio>
            <a-radio :style="radioStyle" :value="2" class="radio-item">
              来源价×
              <a-input-number
                :disabled="formData.cgorlrRio == 1"
                v-model:value="formData.lrval"
                style="width: 146px; margin-left: 8px"
                @change="handleLrChange"
                :min="0"
              >
                <template #addonAfter>
                  <span>倍</span>
                </template>
              </a-input-number>
            </a-radio>
          </a-radio-group>
        </div>
        <div v-for="(item, index) in picList" :key="item.id" class="left_items">
          <div class="left_item">
            <div class="number">{{ index + 1 }}</div>
            <img
              style="width: 30%; height: 100%; padding: 10px 10px 10px 10px; box-sizing: border-box"
              :src="item.image"
              alt="商品图片"
            />
            <div class="text_center">
              <div class="content">{{ item.store_name }}</div>
              <div class="price">¥{{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧商品信息 必填项 -->
      <div class="right_content">
        <a-card class="box-card" style="width: 95%; max-height: 750px; overflow-y: auto">
          <div>
            <a-form
              ref="ruleFormRef"
              layout="vertical"
              :model="formData"
              name="commodityForm"
              autocomplete="off"
              :rules="rules"
            >
              <a-row>
                <a-col :span="24">
                  <div class="bt-title">必填项</div>
                  <div class="bt-dash"></div>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="商品标题" name="store_name" has-feedback>
                    <a-input v-model:value="formData.store_name" placeholder="请输入15-60个字符（8-30个汉字）" />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="订单库存计数" name="reduce_type" has-feedback>
                    <a-radio-group v-model:value="formData.reduce_type" name="reduce_typeGroup">
                      <a-radio value="1">拍下减库存</a-radio>
                      <a-radio value="2">付款减库存</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="运费模板" name="freight_id">
                    <a-select v-model:value="formData.freight_id" placeholder="请选择运费模板" style="width: 50%">
                      <a-select-option v-for="item in templateList" :key="item.template.id" :value="item.template.id">
                        {{ item.template.template_name }}
                      </a-select-option>
                    </a-select>
                    <span class="moban" @click="refreshList">刷新</span>
                    <div style="font-size: 12px; color: #999">
                      如需创建新的运费模板，请自行去抖店新建运费模板。完成新建后，请返回当前页面并点击页面右侧的”刷新“按钮以完成模板更新。
                    </div>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="类目" name="category_id">
                    <a-cascader
                      style="width: 60%"
                      :options="prdCateList"
                      :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                      v-model:value="formData.category_id"
                      placeholder="请选择类目"
                      :load-data="loadData"
                      change-on-select
                      @change="handleCascaderChange"
                    >
                    </a-cascader>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="商品状态" name="start_sale_type" has-feedback>
                    <a-radio-group v-model:value="formData.start_sale_type" name="start_sale_type">
                      <a-radio value="0">直接上传</a-radio>
                      <a-radio value="1">放置仓库</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="七天无理由" name="after_sale_service" has-feedback>
                    <a-radio-group v-model:value="formData.after_sale_service" name="after_sale_service">
                      <a-radio value="7-1">支持</a-radio>
                      <a-radio value="7-0">不支持</a-radio>
                      <a-radio value="7-2">支持(拆封后不支持)</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="客服电话" name="mobile" has-feedback>
                    <a-input v-model:value="formData.mobile" placeholder="请输入客服电话" />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="颜色">
                    <a-space>
                      <a-tag :key="tag.attr" v-for="tag in formData.color" :bordered="false">
                        <span style="color: #909399">{{ tag.attr }}</span>
                      </a-tag>
                    </a-space>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="尺码">
                    <a-space>
                      <a-tag :key="tag.attr" v-for="tag in formData.size" :bordered="false">
                        <span style="color: #909399">{{ tag.attr }}</span>
                      </a-tag>
                    </a-space>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="SKU信息" required>
                    <a-table
                      :columns="columns"
                      :data-source="formData.tableData"
                      :pagination="false"
                      style="width: 100%"
                      :scroll="{ y: 400 }"
                      bordered
                      size="small"
                    >
                      <template #headerCell="{ column }">
                        <template v-if="column.dataIndex === 'price'">
                          <a-button size="small" v-if="plgj == true" @click="handlePlgj">批量改价</a-button>
                          <a-input
                            ref="plgjInput"
                            v-else
                            size="small"
                            v-model:value="plgjVal"
                            placeholder="请输入"
                            @pressEnter="plgjChange"
                            @blur="plgjChange"
                          />
                        </template>
                        <template v-if="column.dataIndex === 'stock'">
                          <a-button size="small" v-if="plgkc == true" @click="handlePlgkc">批量改库存</a-button>
                          <a-input
                            v-else
                            ref="plgkcInput"
                            size="small"
                            v-model:value="plgkcVal"
                            placeholder="请输入"
                            @pressEnter="plgkcChange"
                            @blur="plgkcChange"
                          />
                        </template>
                      </template>
                      <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'image'">
                          <img :src="record.image" style="width: 72px; height: 72px; object-fit: cover" />
                        </template>
                        <template v-if="column.dataIndex === 'price'">
                          <a-input size="small" v-model:value="record.price" />
                        </template>
                        <template v-if="column.dataIndex === 'stock'">
                          <a-input size="small" v-model:value="record.stock" />
                        </template>
                      </template>
                    </a-table>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="售卖价">
                    <a-input style="width: 50%" v-model:value="smj" disabled>
                      <template #suffix>
                        <span>元</span>
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="尺码信息" required>
                    <a-card style="width: 100%" :bodyStyle="{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }">
                      <div style="margin-top: 10px">
                        <a-button size="small" type="primary" @click="addSizeModel" ghost class="add-btn">
                          添加尺码表
                        </a-button>
                        <span class="priceFont" style="margin-left: 20px">
                          请先在抖店添加尺码模板后，点击左侧“添加尺码表”按钮选择要添加的尺码模板
                        </span>
                      </div>
                      <div style="margin-top: 10px" v-if="sizeModelVal?.template_id">
                        <a-button
                          type="primary"
                          size="small"
                          @click="sizeModelRef.previewImage(sizeModelVal.image.url)"
                          :icon="h(CheckOutlined)"
                          ghost
                          class="added-btn"
                        >
                          已添加尺码表
                        </a-button>
                        <span class="priceFont" style="margin-left: 20px">
                          {{ sizeModelVal.template_name }}
                        </span>
                      </div>
                    </a-card>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="商品属性" required>
                    <a-card style="width: 100%" :bodyStyle="{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }">
                      <a-row>
                        <a-col :span="24">
                          <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
                            <div>重要属性</div>
                            <div style="cursor: pointer">
                              <a-popover>
                                <img style="" src="../../../assets/image/question.png" alt="" />
                                <template #content>
                                  <div style="display: flex; gap: 16px; flex-direction: column; width: 200px">
                                    <p style="margin: 0">
                                      商品参数属性可以使用“模板锁”功能辅助，可
                                      锁定属性，更快捷上传商品（多平台同时上传请 选择好各平台的属性）
                                    </p>
                                  </div>
                                </template>
                              </a-popover>
                            </div>
                          </div>
                        </a-col>
                        <a-col :span="24">
                          <a-row>
                            <a-col
                              :span="item.type == 'multi_value_measure' ? 24 : 8"
                              v-for="item in formList"
                              :key="item.property_id"
                            >
                              <a-form-item :label="item.property_name" :required="item.required == 0 ? false : true">
                                <a-input
                                  v-if="item.type == 'text'"
                                  style="width: 90%"
                                  v-model:value="formData.shuxing[item.property_id]"
                                  @change="handleSelectChange(item)"
                                />
                                <a-select
                                  @change="handleSelectChange(item)"
                                  v-if="item.property_name == '品牌' && item.type !== 'text'"
                                  style="width: 90%"
                                  v-model:value="formData.shuxing[item.property_id]"
                                  :mode="item.type == 'multi_select' ? 'multiple' : '-'"
                                  :maxTagCount="5"
                                >
                                  <a-select-option v-for="item in ppList" :key="item.brand_id" :value="item.brand_id">
                                    {{ item.name_cn }}
                                  </a-select-option>
                                </a-select>
                                <a-select
                                  @change="handleSelectChange(item)"
                                  v-if="
                                    (item.type == 'multi_select' || item.type == 'select') &&
                                    item.property_name !== '品牌'
                                  "
                                  style="width: 90%"
                                  v-model:value="formData.shuxing[item.property_id]"
                                  :mode="item.type == 'multi_select' ? 'multiple' : '-'"
                                  :maxTagCount="4"
                                  allowClear
                                  showArrow
                                  :showSearch="false"
                                >
                                  <a-select-option
                                    v-for="sel in item.options"
                                    :key="sel.value_id"
                                    :value="sel.value_id"
                                  >
                                    {{ sel.name }}
                                  </a-select-option>
                                </a-select>
                                <a-select
                                  v-model:value="formData.shuxing[item.property_id]"
                                  v-if="item.type == 'multi_value_measure'"
                                  :options="item.options"
                                  mode="multiple"
                                  style="width: 100%"
                                  :fieldNames="{ value: 'value_id', label: 'name' }"
                                  @change="handleFabricChange(item)"
                                  allowClear
                                  showArrow
                                  :filter-option="filterOption"
                                >
                                </a-select>
                                <a-col
                                  :span="24"
                                  v-if="item.type == 'multi_value_measure' && fabriTableList.length > 0"
                                >
                                  <a-table
                                    :data-source="fabriTableList"
                                    :columns="[
                                      { title: '名称', dataIndex: 'name', align: 'center' },
                                      { title: '百分比', dataIndex: 'percent', align: 'center' }
                                    ]"
                                    style="width: 100%; margin-top: 10px"
                                    max-height="450"
                                    bordered
                                    size="small"
                                    :pagination="false"
                                  >
                                    <template #bodyCell="{ column, record }">
                                      <template v-if="column.dataIndex === 'percent'">
                                        <a-input-number :min="0" :max="100" size="small" v-model:value="record.percent">
                                          <template #addonAfter>
                                            <span>%</span>
                                          </template>
                                        </a-input-number>
                                      </template>
                                    </template>
                                  </a-table>
                                </a-col>
                              </a-form-item>
                            </a-col>
                          </a-row>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-card>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <div>
          <a-button type="primary" danger @click="handleAdd(true)" :loading="loading">发布商品</a-button>
          <a-button @click="handleAdd(false)">保存草稿</a-button>
        </div>
        <div class="footer-notice">
          部分信息为平台同步信息，
          <span style="color: #ff4d4f">您应仔细检查每项信息，如信息有误，应修改后发布</span>， 避免虚假宣传等风险
        </div>
      </div>
    </template>
    <SizeModel ref="sizeModelRef" @handleSelectSize="handleSelectSize" />
  </a-modal>
</template>

<script setup lang="tsx">
import { reactive, ref, nextTick, watch, h } from 'vue'
import { message } from 'ant-design-vue'
import {
  getTemplateList,
  upAddProduct,
  getPrdCateList,
  getCatePropertyList,
  fetchProUpRule,
  fetchBrandList,
  getProductList
} from '@/api/upstore'
import type { Rule } from 'ant-design-vue/es/form'
import type { CascaderProps, TableColumnsType, FormInstance } from 'ant-design-vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import SizeModel from './SizeModel.vue'

const loading = ref(false)

const [messageApi, contextHolder] = message.useMessage()

// 已添加尺码表
const sizeModelVal = ref()
const sizeModelRef = ref()
const sizeModelList = ref<any>([])
const sizeTotal = ref(0)

// 添加尺码表
const addSizeModel = () => {
  sizeModelRef.value.handleInit(sizeModelList.value, formData.value.token, sizeTotal.value, formData.value.type)
}
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formData = ref<IFormData>({
  info: {},
  type: '',
  token: '',
  cgorlrRio: 1,
  cgval: null,
  lrval: null,
  store_name: '',
  reduce_type: '',
  freight_id: '',
  category_id: [],
  start_sale_type: '',
  after_sale_service: '',
  mobile: null,
  color: [],
  size: [],
  tableData: [],
  shuxing: {},
  after_sale_service_v2: {
    service_type: '',
    duration: ''
  },
  is_evaluate_opened: '',
  limit_per_buyer: '',
  maximum_per_order: '',
  minimum_per_order: '',
  reference_price: '',
  certificate_type: ''
})
const smj = ref('') //售卖价
const priceValues = formData.value.tableData.map((item: { price: any }) => item.price)
const maxPrice = Math.max(...priceValues)
const minPrice = Math.min(...priceValues)
if (maxPrice >= minPrice * 2.3) {
  messageApi.error('商品最高价不能超过最低价的2.3倍,请修改价格')
}
smj.value = String(minPrice) + '~' + String(maxPrice)
// 监听table的变化，可能要为售卖价做一下处理
watch(
  () => formData.value.tableData,
  (newVal) => {
    const priceValues = newVal.map((item: { price: any }) => item.price)
    const maxPrice = Math.max(...priceValues)
    const minPrice = Math.min(...priceValues)
    smj.value = String(minPrice) + '~' + String(maxPrice)
    if (maxPrice >= minPrice * 2.3) {
      messageApi.error('商品最高价不能超过最低价的2.3倍,请修改价格')
    }
  },
  { deep: true }
)
// 定义表格列
const columns: TableColumnsType = [
  {
    title: '图片',
    dataIndex: 'image',
    align: 'center'
  },
  {
    title: '颜色',
    dataIndex: 'color',
    align: 'center'
  },
  {
    title: '尺码',
    dataIndex: 'size',
    align: 'center'
  },
  {
    title: '批量改价',
    dataIndex: 'price',
    align: 'center',
    width: '15%'
  },
  {
    title: '批量改库存',
    dataIndex: 'stock',
    align: 'center',
    width: '15%'
  },
  {
    title: 'SKU编码',
    dataIndex: 'bar_code',
    align: 'center'
  }
]

// 属性列表
const formList = ref<any>([])

// 批量改价
const plgj = ref(true)
const plgjVal = ref('')
const plgjInput = ref()
const handlePlgj = () => {
  plgj.value = false
  plgjVal.value = ''
  nextTick(() => {
    plgjInput.value?.focus()
  })
}
const plgjChange = () => {
  plgj.value = true
  if (plgjVal.value !== '') {
    formData.value.tableData.map((x: any) => {
      x.price = plgjVal.value
    })
  }
}
// 批量改库存
const plgkc = ref(true)
const plgkcVal = ref('')
const plgkcInput = ref()
const handlePlgkc = () => {
  plgkc.value = false
  plgkcVal.value = ''
  nextTick(() => {
    plgkcInput.value?.focus()
  })
}
const plgkcChange = () => {
  plgkc.value = true
  if (plgkcVal.value !== '') {
    formData.value.tableData.map((x: any) => {
      x.stock = plgkcVal.value
    })
  }
}

const mustFormRef = ref()
const emits = defineEmits(['closeStateUpload', 'uploadList'])

const rules: Record<string, Rule[]> = {
  store_name: [{ required: true, message: '请输入15-60个字符（8-30个汉字）', trigger: ['change', 'blur'] }],
  reduce_type: [{ required: true, message: '请选择订单库存计数', trigger: ['change', 'blur'] }],
  freight_id: [{ required: true, message: '请选择运费模板', trigger: ['change', 'blur'] }],
  category_id: [{ required: true, message: '请选择类目', trigger: ['change', 'blur'] }],
  start_sale_type: [{ required: true, message: '请选择商品状态', trigger: ['change', 'blur'] }],
  after_sale_service: [{ required: true, message: '请选择七天无理由', trigger: ['change', 'blur'] }],
  mobile: [{ required: true, message: '请输入客服电话', trigger: ['change', 'blur'] }]
}
const radioStyle = reactive({
  display: 'flex',
  height: '32px',
  lineHeight: '32px'
})

// 采购输入框变化
const handleCgChange = (val: number) => {
  if (val) {
    changePlgjByParent(Number(formData.value.info.price) + Number(val))
  } else {
    changePlgjByParent(Number(formData.value.info.price))
  }
}
// 利润率变化
const handleLrChange = (val: number) => {
  if (val) {
    changePlgjByParent(Number(formData.value.info.price) * Number(val))
  } else {
    changePlgjByParent(Number(formData.value.info.price))
  }
}

// 批量改价
const changePlgjByParent = (value: string | number) => {
  if (value !== '') {
    formData.value.tableData.map((x: any) => {
      x.price = value
    })
  }
}
// 利润采购单选变化
const handleRadioChange = (e: Record<string, any>) => {
  const val = e.target.value
  switch (val) {
    case 1:
      handleCgChange(Number(formData.value.cgval))
      break
    case 2:
      handleLrChange(Number(formData.value.lrval))
      break
  }
}

// 左侧图片列表
const picList = ref<any>([])

const templateList = ref<any>([])

const prdCateList = ref<any>([])

// 弹窗控制
function dialogControl(_sts: string, edits: any) {
  console.log(edits, 'aaaaaa')
  // 获取运费模板
  getTemplateList({ token: edits.selectionList[0].access_token }).then((res: any) => {
    if (res.status == 200) {
      // 关闭掉店铺表格选择列表
      emits('closeStateUpload')
      picList.value = []
      nextTick(() => {
        picList.value.push(edits.info)
        formData.value = {
          ...formData.value,
          store_name: edits.info.store_name,
          tableData: JSON.parse(JSON.stringify(edits.skuList)),
          size: edits.size,
          color: edits.color,
          token: edits.selectionList[0].access_token,
          type: edits.type,
          info: edits.info
        }

        templateList.value = res.data.List
        fetchPrdCateList()
        dialogVisible.value = true
        console.log(formData, 'formData')
      })
    } else {
      messageApi.error('当前店铺尚未设置运费模板，请先去抖店设置运费模板设置！')
    }
  })
  // 获取尺码表模板列表
  getProductList({
    data: {
      token: edits.selectionList[0].access_token,
      page_size: 10,
      page_num: 0,
      template_sub_type: edits.type.includes('67') ? '' : ''
    }
  }).then((res: any) => {
    if (res.status == 200) {
      nextTick(() => {
        sizeModelList.value = res.data.component_template_info_list
        sizeTotal.value = res.data.total_num
      })
    }
  })
}

// 调用获取类目列表接口  懒加载
const loadData: CascaderProps['loadData'] = (selectedOptions) => {
  const targetOption = selectedOptions[selectedOptions.length - 1]
  targetOption.loading = true
  getPrdCateList({ token: formData.value.token, cid: targetOption.id }).then((res: any) => {
    if (res.status === 200) {
      targetOption.loading = false
      targetOption.children = res.data.map((item: any) => ({
        isLeaf: item.is_leaf, // 是否为叶子节点
        ...item
      }))
    }
  })
}

// 获取类目列表
const fetchPrdCateList = () => {
  getPrdCateList({ token: formData.value.token, cid: '' }).then((res: any) => {
    if (res.status == 200) {
      prdCateList.value = []
      nextTick(() => {
        res.data.forEach((element: any) => {
          prdCateList.value.push({
            isLeaf: element.is_leaf,
            children: [],
            ...element
          })
        })
      })
    }
  })
}

const shuxingList = ref<any>([])
const certificateTypeList = ref<any>([]) // 参考价类型
const three_guarantees = ref<any>([]) // 售后有效期
const ppList = ref<any>([])

// 选择类目model变化,请求属性接口列表
const handleCascaderChange = (value: any, selectedOptions: any) => {
  // 只有选择到最后一级(叶子节点)时才执行后续操作  或删除change-on-select属性
  const lastOption = selectedOptions[selectedOptions.length - 1]

  if (!lastOption?.isLeaf) {
    return
  }
  const leafCategoryId = value[value.length - 1]

  formList.value = []
  shuxingList.value = []
  getCatePropertyList({ data: { token: formData.value.token, category_leaf_id: leafCategoryId } }).then((res: any) => {
    if (res.status == 200) {
      nextTick(() => {
        // 先过滤掉不是必传的商品属性
        res.data.data.forEach((element: any) => {
          if (element.required == 1) {
            formList.value.push(element)
          }
        })
      })
    }
  })

  // 根据文档无品牌id为596120136
  ppList.value = [{ brand_id: '596120136', name_cn: '无品牌', name_en: '0' }]
  fetchBrandList({ token: formData.value.token, category_id: leafCategoryId }).then((res: any) => {
    if (res.status == 200) {
      nextTick(() => {
        if (res.data.auth_brand_list) {
          // 如果是品牌授权，则列表必须选择品牌授权列表 否则加入无品牌选项
          if (res.data.auth_required) {
            ppList.value = res.data.auth_brand_list
          } else {
            ppList.value = [...ppList.value, ...res.data.auth_brand_list]
          }
        } else {
          ppList.value = [...ppList.value, ...res.data.brand_list]
        }
      })
    }
  })

  fetchProUpRule({ data: { token: formData.value.token, category_id: leafCategoryId } }).then((res: any) => {
    if (res.status == 200) {
      nextTick(() => {
        const result = []
        for (const key in res.data.reference_price_rule.certificate_types) {
          if (res.data.reference_price_rule.certificate_types.hasOwnProperty(key)) {
            result.push({
              id: key,
              name: res.data.reference_price_rule.certificate_types[key]
            })
          }
        }
        certificateTypeList.value = result
        three_guarantees.value = res.data.after_sale_rule.three_guarantees.options[0].options // 售后有效期
      })
    }
  })
}

// 关闭清空
const handleDialogClosed = () => {
  nextTick(() => {
    mustFormRef.value?.handleDialogClosed()
    dialogTitle.value = ''
    picList.value = []
    formData.value = initFormData()
    templateList.value = []
    sizeModelVal.value = {}
  })
}
function refreshList() {
  // 刷新运费模板
  getTemplateList({ token: formData.value.token }).then((res: any) => {
    if (res.status == 200) {
      nextTick(() => {
        templateList.value = res.data.List
      })
    }
  })
}
const ruleFormRef = ref<FormInstance>()
// 发布商品
const handleAdd = async (commit: any) => {
  try {
    await ruleFormRef.value?.validate()
    loading.value = true
    const priceValues: any = formData.value.tableData?.map((item: { price: any }) => item.price)
    if (Math.max(...priceValues) >= Math.min(...priceValues) * 2.3) {
      messageApi.error('商品最高价不能超过最低价的2.3倍,请修改价格', 3000)
      loading.value = false
      return
    }
    const form = formData.value
    const { shuxing } = formData.value.shuxing

    let specs = '颜色分类|'
    form.color.forEach((element: any, index: number) => {
      if (index == form.color.length - 1) {
        specs = specs + element.attr + '^尺码大小|'
      } else {
        specs = specs + element.attr + ','
      }
    })
    form.size.forEach((element: any, index: number) => {
      if (index == form.size.length - 1) {
        specs = specs + element.attr
      } else {
        specs = specs + element.attr + ','
      }
    })

    let picList = ''
    let descriptionList = ''
    let size_info_template_id = ''
    if (sizeModelVal.value?.template_id) {
      size_info_template_id = sizeModelVal.value?.template_id
    } else {
      messageApi.error('请添加尺码表')
      loading.value = false
      return
    }
    if (!form.category_id) {
      messageApi.error('请选择类目')
      loading.value = false
      return
    }
    let after_sale_service_v2 = {
      duration: formData.value.after_sale_service_v2.duration,
      service_type: formData.value.after_sale_service_v2.service_type
    }
    mustFormRef.value?.goodsMainPic.forEach((element, index) => {
      if (index == mustFormRef.value.goodsMainPic.length - 1) {
        picList = picList + element
      } else {
        picList = picList + element + '|'
      }
    })
    mustFormRef.value?.goodsXqPic.forEach((element, index) => {
      if (index == mustFormRef.value.goodsXqPic.length - 1) {
        descriptionList = descriptionList + element
      } else {
        descriptionList = descriptionList + element + '|'
      }
    })
    // if (descriptionList.length == 0) {
    //     return messageApi.error('此商品无详情图，请先去编辑商品详情图')
    // }

    let spec_prices: any = []
    let spec_pic = ''
    form.tableData.forEach((element: any) => {
      spec_prices.push({
        spec_detail_name1: element.color,
        spec_detail_name2: element.size,
        spec_detail_name3: '',
        stock_num: element.stock,
        price: element.price,
        // price: Math.trunc(element.price),
        code: element.bar_code,
        step_stock_num: 0,
        supplier_id: '',
        outer_sku_id: '',
        delivery_infos: [
          {
            info_type: 'weight',
            info_value: '100',
            info_unit: 'mg'
          }
        ]
      })
      spec_pic = spec_pic + element.image + ','
    })
    let product_format_new: any = {}

    // 商品属性
    mustFormRef.value.shuxingList.forEach((item, index) => {
      for (const key in item) {
        console.log(item[key], 'itemmmmmmmmmmm')
        product_format_new[key] = []
        if (item[key].type !== 'multi_value_measure') {
          if (item[key].type == 'multi_select') {
            if (item[key].value.length <= 1) {
              product_format_new[key] = [
                {
                  value: item[key].value[0],
                  name: item[key].property_name,
                  diy_type: item[key].diy_type,
                  measure_info: null
                }
              ]
            } else {
              item[key].value.forEach((i: any, index: number) => {
                product_format_new[key].push({
                  value: i,
                  name: item[key].property_name,
                  diy_type: item[key].diy_type,
                  measure_info: null
                })
              })
            }
          } else if (item[key].type == 'text') {
            // 自定义输入的时候，value填0，name填自定义内容
            product_format_new[key] = [
              {
                value: 0,
                name: item[key].value,
                diy_type: item[key].diy_type,
                measure_info: null
              }
            ]
          } else {
            product_format_new[key] = [
              {
                value: 0,
                name: item[key].property_name,
                diy_type: item[key].diy_type,
                measure_info: null
              }
            ]
          }
        } else {
          // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', mustFormRef.value.fabriTableList);
          mustFormRef.value.fabriTableList.forEach((element: any) => {
            console.log(
              'item[key].measure_templates[0].value_modules[1].units',
              item[key].measure_templates[0].value_modules[1].units[0].unit_name
            )

            product_format_new[key].push({
              value: 0,
              name: element.name + element.percent + item[key].measure_templates[0].value_modules[1].units[0].unit_name,
              diy_type: item[key].diy_type,
              measure_info: {
                template_id: item[key].measure_templates[0].template_id,
                value_name:
                  element.name + element.percent + item[key].measure_templates[0].value_modules[1].units[0].unit_name,
                values: [
                  {
                    module_id: item[key].measure_templates[0].value_modules[0].module_id,
                    value: element.name,
                    unit_id:
                      item[key].measure_templates[0].value_modules[0].units.length > 0
                        ? item[key].measure_templates[0].value_modules[0].units[0].unit_id
                        : 0
                  },
                  {
                    module_id: item[key].measure_templates[0].value_modules[1].module_id,
                    unit_name: item[key].measure_templates[0].value_modules[1].units[0].unit_name,
                    unit_id: item[key].measure_templates[0].value_modules[1].units[0].unit_id,
                    value: element.percent
                  }
                ]
              }
            })
          })
        }
      }
    })

    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', product_format_new)
    console.log('shuxing', shuxing)
    // mustFormRef.value.ruleFormRef.validate((valid: any) => {
    //     if (valid) {
    //         console.log('ruleFormRef', mustFormRef.value)
    //     } else {
    //         console.log('error submit!!')
    //         return false
    //     }
    // })

    console.log('descriptionList', descriptionList)

    upAddProduct({
      data: {
        token: form.selectionList[0].access_token,
        category_id: form.category_id[form.category_id.length - 1],
        name: form.info.store_name,
        pic: picList,
        description: descriptionList,
        freight_id: form.freight_id,
        // specs: '颜色分类|红色,黑色^尺码大小|S,M',
        specs: specs,
        spec_prices: JSON.stringify(spec_prices),
        spec_pic: spec_pic,
        commit: commit,
        reduce_type: form.reduce_type,
        start_sale_type: form.start_sale_type,
        after_sale_service: JSON.stringify({ supply_day_return_selector: form.after_sale_service }),
        reference_price: form.reference_price,
        reference_price_certificate: {
          certificate_type: form.certificate_type,
          certificate_urls: form.certificate_urls
        },
        // size_info_template_id: '7438823136822411556',
        size_info_template_id: size_info_template_id,
        product_format_new: JSON.stringify(product_format_new),
        is_evaluate_opened: form.is_evaluate_opened == 1 ? true : false,
        maximum_per_order: form.maximum_per_order,
        limit_per_buyer: form.limit_per_buyer,
        minimum_per_order: form.minimum_per_order,
        white_back_ground_pic_url: form.white_back_ground_pic_url,
        after_sale_service_v2: JSON.stringify(after_sale_service_v2),
        mobile: form.mobile
      }
    })
      .then((res: any) => {
        if (res.status == 200 && res.data.code == 10000) {
          console.log(res, '上传结果=======================================')
          messageApi.success('上传成功！')
          dialogVisible.value = false
          loading.value = false
          emits('uploadList')
        } else {
          messageApi.error(res.data.sub_msg)
          loading.value = false
        }
      })
      .finally(() => {
        loading.value = false
      })
  } catch (e) {
    return false
  }
}

// 选择确认属性
const handleSelectChange = (item: any) => {
  let newObj: any = {}
  newObj[item.property_id] = {
    ...item,
    value: formData.value.shuxing[item.property_id]
  }
  let existingIndex = false
  shuxingList.value.forEach((element: any) => {
    if (Object.keys(element)[0] == item.property_id) {
      existingIndex = true
      element[item.property_id] = {
        ...item,
        value: formData.value.shuxing[item.property_id]
      }
    }
  })

  if (existingIndex) {
    return
  } else {
    shuxingList.value.push(newObj)
  }
}

const fabriTableList = ref<any>([])
// 面料材质选择变化
const handleFabricChange = (item: any) => {
  const selectedValues = formData.value.shuxing[item.property_id]
  const selectedOptions = item.options.filter((option: any) => selectedValues.includes(option.value_id))
  fabriTableList.value = selectedOptions
  handleSelectChange(item)
}

// 选择确认尺码表
const handleSelectSize = (sizeCode: string) => {
  console.log(sizeCode, '选择确认尺码表')

  sizeModelVal.value = sizeCode
}

// 面料材质搜索
const filterOption = (input: string, option: any) => {
  return option.name.includes(input)
}

// 重置表单数据
const initFormData = () => {
  return {
    info: {},
    type: '',
    token: '',
    cgorlrRio: 1,
    cgval: null,
    lrval: null,
    store_name: '',
    reduce_type: '',
    freight_id: '',
    category_id: [],
    start_sale_type: '',
    after_sale_service: '',
    mobile: null,
    color: [],
    size: [],
    tableData: [],
    shuxing: {},
    after_sale_service_v2: {
      service_type: '',
      duration: ''
    },
    is_evaluate_opened: '',
    limit_per_buyer: '',
    maximum_per_order: '',
    minimum_per_order: '',
    reference_price: '',
    certificate_type: ''
  }
}
defineExpose({
  dialogControl
})
</script>

<style src="./Commodity.scss" scoped></style>
<style scoped lang="scss">
.radio-item {
  margin-bottom: 8px;
  width: 100%;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-notice {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-top: 12px;
}

.add-btn {
  background: #ecf5ff;
  color: #409eff;
  border-color: #409eff;
  &:hover {
    background: #409eff !important;
    color: #ffffff !important;
  }
}
.added-btn {
  background: #f0f9eb;
  color: #79c75c;
  border-color: #79c75c;
  &:hover {
    background: #67c23a !important;
    color: #ffffff !important;
  }
}
</style>

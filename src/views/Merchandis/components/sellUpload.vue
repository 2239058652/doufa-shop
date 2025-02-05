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
      <div class="left_content">
        <div class="left_name">商品名称</div>
        <div class="left_radio">
          <a-typography-text strong style="font-size: 12px">价格设置:</a-typography-text>
          <a-radio-group v-model:value="cgorlrRio" @change="handleRadioChange">
            <a-row style="margin-left: 30px">
              <a-col :span="24" class="radio-item">
                <a-radio value="1">来源价+</a-radio>
                <a-input
                  :disabled="cgorlrRio !== '1'"
                  v-model:value="cgval"
                  style="width: 100px; margin-left: 8px"
                  type="number"
                  @change="handleCgChange"
                >
                  <template #suffix>
                    <span>元</span>
                  </template>
                </a-input>
              </a-col>
              <a-col :span="24" class="radio-item" style="margin-top: 10px">
                <a-radio value="2">来源价×</a-radio>
                <a-input
                  :disabled="cgorlrRio !== '2'"
                  v-model:value="lrval"
                  style="width: 100px; margin-left: 8px"
                  type="number"
                  @change="handleLrChange"
                >
                  <template #suffix>
                    <span>倍</span>
                  </template>
                </a-input>
              </a-col>
            </a-row>
          </a-radio-group>
        </div>
        <div v-for="(item, index) in picList" :key="item.id" class="left_items">
          <div class="left_item">
            <div class="number">{{ index + 1 }}</div>
            <img class="product-image" :src="item.image" alt="商品图片" />
            <div class="text_center">
              <div class="content">{{ item.store_name }}</div>
              <div class="price">¥{{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right_content">
        <a-card class="box-card" style="width: 95%; max-height: 750px; overflow-y: auto">
          <MustForm ref="mustFormRef" :formData="formData" :templateList="templateList" />
        </a-card>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <a-button type="primary" danger @click="handleAdd(true)" :loading="loading">发布商品</a-button>
        <a-button @click="handleAdd(false)">保存草稿</a-button>
        <div class="footer-notice">
          部分信息为平台同步信息，
          <span style="color: #ff4d4f">您应仔细检查每项信息，如信息有误，应修改后发布</span>， 避免虚假宣传等风险
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { getTemplateList, upAddProduct } from '@/api/upstore'
// import MustForm from './mustForm.vue'

// 组件逻辑部分保持基本不变，主要修改消息提示和部分组件API调用方式
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formData = reactive<any>({ data: {} })

const mustFormRef = ref<InstanceType<typeof MustForm>>()
const emits = defineEmits(['closeStateUpload', 'uploadList'])

const loading = ref(false)
// 采购价或者利润率
const cgorlrRio = ref('1')
// 采购价
const cgval = ref('')
// 利润率
const lrval = ref('')

const [messageApi, contextHolder] = message.useMessage()

// 采购输入框变化
const handleCgChange = (val: number) => {
  if (val) {
    mustFormRef.value?.changePlgjByParent(Number(formData.data.info.price) + Number(val))
  } else {
    mustFormRef.value?.changePlgjByParent(Number(formData.data.info.price))
  }
}
// 利润率变化
const handleLrChange = (val: number) => {
  if (val) {
    mustFormRef.value?.changePlgjByParent(Number(formData.data.info.price) * Number(val))
  } else {
    mustFormRef.value?.changePlgjByParent(Number(formData.data.info.price))
  }
}

// 利润采购单选变化
const handleRadioChange = (val: string | number | boolean) => {
  switch (val) {
    case '1':
      handleCgChange(Number(cgval.value))
      break
    case '2':
      handleLrChange(Number(lrval.value))
      break
  }
}

// 左侧图片列表
const picList = ref<any>([])

const templateList = ref<any>([])

// 关闭清空
const handleDialogClosed = () => {
  nextTick(() => {
    mustFormRef.value?.handleDialogClosed()
    dialogTitle.value = ''
    picList.value = []
    formData.data = {}
    templateList.value = []
    cgorlrRio.value = '1'
    cgval.value = ''
    lrval.value = ''
  })
}
// 弹窗控制
function dialogControl(sts, edits) {
  // 获取运费模板
  getTemplateList({ token: edits.selectionList[0].access_token }).then((res: any) => {
    if (res.status == 200) {
      // 关闭掉店铺表格选择列表
      emits('closeStateUpload')
      picList.value = []
      nextTick(() => {
        picList.value.push(edits.info)
        formData.data = edits
        templateList.value = res.data.List
        dialogTitle.value = ''
        dialogVisible.value = true
      })
    } else {
      messageApi.error('当前店铺尚未设置运费模板，请先去抖店设置运费模板设置！')
    }
  })
}

const handleAdd = (commit: any) => {
  loading.value = true
  console.log('mustFormRef', mustFormRef.value)
  const priceValues: any = mustFormRef?.value?.tableData?.map((item: { price: any }) => item.price)
  if (Math.max(...priceValues) >= Math.min(...priceValues) * 2.3) {
    messageApi.error('商品最高价不能超过最低价的2.3倍,请修改价格', 3000)
    loading.value = false
    return
  }
  const form = mustFormRef.value?.formData.data
  const { shuxing } = mustFormRef.value?.formData

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
  if (mustFormRef.value?.sizeModelVal?.template_id) {
    size_info_template_id = mustFormRef.value?.sizeModelVal.template_id
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
    duration: mustFormRef.value?.after_sale_service_v2.duration,
    service_type: mustFormRef.value?.after_sale_service_v2.service_type
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
  form.skuList.forEach((element: any) => {
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
      reference_price_certificate: { certificate_type: form.certificate_type, certificate_urls: form.certificate_urls },
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
        messageApi({
          type: 'success',
          message: '上传成功！'
        })
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
}

defineExpose({
  dialogControl
})
</script>

<style src="./sellUpload.scss" scoped></style>

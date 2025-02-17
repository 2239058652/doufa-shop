<template>
  <div>
    <a-upload
      v-model:file-list="innerFileList"
      list-type="picture-card"
      :max-count="maxCount"
      :custom-request="handleCustomUpload"
      :before-upload="beforeCertificateUpload"
      @preview="handlePreview"
      @remove="handleRemove"
    >
      <div v-if="innerFileList.length < maxCount">
        <plus-outlined />
        <div class="ant-upload-text">{{ uploadText }}</div>
      </div>
    </a-upload>

    <a-modal :open="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img style="width: 100%" :src="previewImage" alt="预览" />
    </a-modal>
  </div>
</template>

<script setup lang="tsx">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { fetchUploadFile } from '@/api/index'

const props = defineProps({
  maxCount: {
    type: Number,
    default: 1
  },
  uploadText: {
    type: String,
    default: '上传凭证'
  },
  fileList: {
    type: Array,
    default: () => []
  },
  customRequest: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:fileList', 'change'])

const innerFileList = ref<any[]>([])
const previewVisible = ref(false)
const previewImage = ref('')

// 同步外部fileList变化
watch(
  () => props.fileList,
  (val) => {
    innerFileList.value = [...val]
  },
  { immediate: true }
)

const handleCustomUpload: UploadProps['customRequest'] = async (options) => {
  const { file, onSuccess, onError } = options
  const formDataFile = new FormData()
  formDataFile.append('file', file)

  try {
    const result = await fetchUploadFile(formDataFile)
    if (result.status == 200) {
      message.success('上传成功')
      onSuccess(
        {
          url: result.data.url,
          name: file.name,
          status: 'done'
        },
        file
      )
      // 同步到表单数据（只需要保存URL）
    } else {
      onError(new Error(result.msg))
    }
  } catch (error) {
    onError(error)
    message.error('上传失败')
  }
}

// 上传前校验
const beforeCertificateUpload: UploadProps['beforeUpload'] = (file) => {
  console.log(file, 'fileeeeeeeeeee')

  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  previewImage.value = file.url || file.thumbUrl
  previewVisible.value = true
}

const handleRemove: UploadProps['onRemove'] = (file) => {
  innerFileList.value = innerFileList.value.filter((item) => item.uid !== file.uid)
  emit('update:fileList', innerFileList.value)
  emit('change', innerFileList.value)
  return true
}
</script>

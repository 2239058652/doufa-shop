<template>
  <a-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    :max-count="maxCount"
    :custom-request="handleCustomUpload"
    :before-upload="beforeUpload"
    @preview="handlePreview"
    @remove="handleRemove"
  >
    <div v-if="fileList.length < maxCount">
      <plus-outlined />
      <div class="ant-upload-text">{{ uploadText }}</div>
    </div>
  </a-upload>
  <a-modal :open="previewVisible" :footer="null" @cancel="previewVisible = false">
    <img style="width: 100%" :src="previewImage" alt="预览" />
  </a-modal>
</template>

<script setup lang="tsx">
import { ref, defineProps, defineEmits } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, type UploadProps } from 'ant-design-vue'
import { fetchUploadFile } from '@/api/index'

const props = defineProps({
  fileList: {
    type: Array as any,
    default: () => []
  },
  maxCount: {
    type: Number,
    default: 1
  },
  uploadText: {
    type: String,
    default: '上传凭证'
  },
  listType: {
    type: String,
    default: 'picture-card'
  }
})

const emits = defineEmits(['update:fileList', 'preview', 'remove'])

const previewVisible = ref(false)
const previewImage = ref('')

// 自定义上传实现
const handleCustomUpload = async (options: any) => {
  const { file, onSuccess, onError } = options
  const formDataFile = new FormData()
  formDataFile.append('file', file)

  try {
    const result = await fetchUploadFile(formDataFile)
    if (result.status === 200) {
      message.success(' 上传成功')
      onSuccess(
        {
          url: result.data.url,
          name: file.name,
          status: 'done'
        },
        file
      )
      // 同步到表单数据（只需要保存URL）
      const newFileList = [...props.fileList, { url: result.data.url, name: file.name, status: 'done' }]
      emits('update:fileList', newFileList)
    } else {
      onError(new Error(result.msg))
    }
  } catch (error) {
    onError(error)
    message.error(' 上传失败')
  }
}

// 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error(' 只能上传 JPG/PNG 格式的图片!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error(' 图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 文件预览处理
const handlePreview: UploadProps['onPreview'] = (file: Record<string, any>) => {
  previewImage.value = file.response.url || file.thumbUrl
  previewVisible.value = true
  emits('preview', file)
}

// 文件删除处理
const handleRemove: UploadProps['onRemove'] = (file) => {
  const newFileList = props.fileList.filter((f: { name: string }) => f.name !== file.name)
  emits('update:fileList', newFileList)
  emits('remove', file)
  return true
}
</script>

<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card.ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

<template>
  <context-holder />
  <a-popover
    trigger="click"
    v-model:open="photoPopoverVisible"
    placement="bottom"
    :overlayStyle="{ paddingTop: '10px' }"
    destroyTooltipOnHide
    @openChange="handleOpenChange"
  >
    <template #title>
      <div class="title">
        <div>以图搜款</div>
        <img src="../../assets/image/close.png" alt="" @click="handleClose" />
      </div>
    </template>
    <template #content>
      <div class="content">
        <div class="upload">
          <a-upload-dragger
            v-model:fileList="fileList"
            accept=".png,.jpg,.jpeg,.pneg"
            :max-count="1"
            :beforeUpload="handleUpload"
            :showUploadList="false"
          >
            <div class="drag">
              <img src="../../assets/image/uploadBg.png" alt="" />
              <div>拖拽所需图片至选框内</div>
              <div>或点击我后ctrl+v黏贴图片、图片链接</div>
            </div>
          </a-upload-dragger>
        </div>
        <div class="btn">
          <a-upload
            v-model:fileList="fileList"
            accept=".png,.jpg,.jpeg,.pneg"
            :max-count="1"
            :beforeUpload="handleUpload"
            :showUploadList="false"
          >
            <span>选择文件</span>
          </a-upload>
        </div>
      </div>
    </template>

    <img class="photo-img" src="../../assets/image/photo.png" alt="识图" />
  </a-popover>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { fetchUploadFile } from '@/api/index'
import { message } from 'ant-design-vue'

const [messageApi, contextHolder] = message.useMessage()
const emit = defineEmits(['beforeUpload', 'update:open', 'update:fileList'])
const props = defineProps({
  fileList: {
    type: Array,
    default: () => []
  },
  open: {
    type: Boolean,
    default: false
  }
})

const fileList = computed({
  get: () => props.fileList,
  set: (val) => emit('update:fileList', val)
})

const photoPopoverVisible = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const handleClose = () => {
  photoPopoverVisible.value = false
}

const handleUpload = async (file: any) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetchUploadFile(formData)
    if (res.status === 200) {
      photoPopoverVisible.value = false
      fileList.value = []
      emit('beforeUpload', res) // 将返回的data传递给父组件
      return false
    } else {
      messageApi.error(res.msg)
      return false // 上传失败，阻止上传
    }
  } catch (e) {
    messageApi.error('上传失败')
    return false
  }
}

const handleOpenChange = (visible: any) => {
  // 隐藏气泡时，清空fileList，避免重复上传
  if (!visible) {
    fileList.value = []
  }
}
</script>

<style scoped lang="scss">
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 320px;

  div {
    width: 64px;
    height: 21px;
    font-size: 16px;
    color: #333333;
    line-height: 21px;
  }

  img {
    width: 22px;
    height: 22px;
    object-fit: cover;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}

.content {
  width: 446px;
  height: 316px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  .upload {
    width: 406px;
    height: 260px;
    border: 1px dashed #e3e3e3;
    border-radius: 6px;

    &:hover {
      border: 1px dashed $red-color;
    }

    .drag {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-top: 32px;

      img {
        width: 90px;
        height: 74px;
        object-fit: cover;
      }

      div:nth-child(2) {
        width: 160px;
        height: 21px;
        font-size: 16px;
        color: #333333;
        line-height: 21px;
      }

      div:nth-child(3) {
        width: 236px;
        height: 19px;
        font-size: 14px;
        color: $red-color;
        line-height: 19px;
      }
    }
  }

  .btn {
    width: 90px;
    height: 40px;
    background: $red-color;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-top: 20px;

    &:hover {
      opacity: 0.9;
    }

    span {
      width: 60px;
      height: 19px;
      font-size: 14px;
      color: #ffffff;
      line-height: 19px;
    }
  }
}

.photo-img {
  width: 22px;
  height: 20px;
  object-fit: cover;
}

:deep(.css-dev-only-do-not-override-1p3hq3p) {
  border: none;
  background: inherit;

  .ant-upload-list-item-error {
    display: none;
  }
}
</style>

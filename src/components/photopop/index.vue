<template>
  <a-popover trigger="click" v-model:open="photoPopoverVisible" placement="bottom"
    :overlayStyle="{ paddingTop: '10px' }">
    <template #title>
      <div class="title">
        <div>以图搜款</div>
        <img src="../../assets/image/close.png" alt="" @click="photoPopoverVisible = false" />
      </div>
    </template>
    <template #content>
      <div class="content">
        <div class="upload">
          <a-upload-dragger v-model:fileList="fileList" accept=".png,.jpg,.jpeg,.pneg" :max-count="1"
            @change="handleChange" @drop="handleDrop">
            <div class="drag">
              <img src="../../assets/image/uploadBg.png" alt="" />
              <div>拖拽所需图片至选框内</div>
              <div>或点击我后ctrl+v黏贴图片、图片链接</div>
            </div>
          </a-upload-dragger>
        </div>
        <div class="btn">
          <a-upload v-model:file-list="fileList" @change="handleChange">
            <span>选择文件</span>
          </a-upload>
        </div>
      </div>
    </template>
    <img src="../../assets/image/photo.png" alt="识图" />
  </a-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadChangeParam } from 'ant-design-vue'
const fileList = ref([])
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status
  if (status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`)
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}

function handleDrop(e: DragEvent) {
  console.log(e, 'DragEvent')
}


const photoPopoverVisible = ref<boolean>(false)   // 以图搜索的popover控制

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
      border: 1px dashed #F83126;
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
        color: #F83126;
        line-height: 19px;
      }
    }
  }

  .btn {
    width: 90px;
    height: 40px;
    background: #F83126;
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
      width: 56px;
      height: 19px;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 19px;
    }
  }
}


// 上传边框消除
:deep(.css-dev-only-do-not-override-1p3hq3p) {
  border: none;
  background: inherit;

  // 消除上传失败报错
  .ant-upload-list-item-error {
    display: none;
  }
}
</style>
<!-- :where(.css-dev-only-do-not-override-1p3hq3p).ant-upload-wrapper .ant-upload-list .ant-upload-list-item-error -->

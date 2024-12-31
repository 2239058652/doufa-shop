<template>
  <a-pagination v-model:current="currentPage" :total="total" :pageSizeOptions="pageSizeOptions" :pageSize="pageSize"
    show-quick-jumper show-size-changer @change="handleChange" @showSizeChange="handleSizeChange" />
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  current: {
    type: Number,
    default: 1
  },
  defaultPageSize: {
    type: Number,
    default: 24
  }
})

const emit = defineEmits(['update:current', 'update:pageSize', 'change'])

const currentPage = ref(props.current)
const pageSize = ref(props.defaultPageSize)
const pageSizeOptions = [24, 48, 72, 96, 120]

const handleChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  emit('update:current', page)
  emit('update:pageSize', size)
  emit('change')
}

const handleSizeChange = (current: number, size: number) => {
  // pageSize.value = size
  // emit('update:pageSize', size)
  // emit('change', { page: current, size })
}
</script>
<style scoped>
:deep(.ant-select-show-arrow) {
  min-width: 70px;
  width: auto;
}

/* 确保下拉选项也能自适应宽度 */
:deep(.ant-select-dropdown) {
  min-width: 100px !important;
  width: auto !important;
}

/* 让选择框内容完整显示 */
:deep(.ant-select-selection-item) {
  white-space: nowrap;
  overflow: visible;
}

:deep(.ant-pagination-item-active) {
  border-color: #F83126;
  background: #F83126;

  &:hover {
    border-color: #F83126;
    background: #F83126;
  }

  a {
    color: #ffffff;

    &:hover {
      color: #ffffff;
    }
  }
}
</style>

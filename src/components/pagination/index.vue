<template>
  <a-pagination
    v-model:current="currentPage"
    :total="total"
    :pageSizeOptions="pageSizeOptions"
    :pageSize="pageSize"
    show-quick-jumper
    show-size-changer
    @change="handleChange"
    @showSizeChange="handleSizeChange"
    :show-total="showTotal"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

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
  },
  pageSizeOptions: {
    type: Array,
    default: () => [24, 48, 72, 96, 120]
  }
})

const emit = defineEmits(['update:current', 'update:pageSize', 'change'])

const pageSizeOptions = computed(() => props.pageSizeOptions)

// 使用computed替代ref
const currentPage = computed({
  get: () => props.current,
  set: (val) => emit('update:current', val)
})

const pageSize = computed({
  get: () => props.defaultPageSize,
  set: (val) => emit('update:pageSize', val)
})

const showTotal = computed(() => {
  if (props.total) {
    return (total: any) => `共 ${total} 条`
  } else {
    return (_total: any) => ` `
  }
})

const handleChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  emit('change')
}

const handleSizeChange = (current: number, size: number) => {
  // pageSize.value = size
  // emit('update:pageSize', size)
  // emit('change', { page: current, size })
}
</script>
<style scoped lang="scss">
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
  border-color: $red-color;
  background: $red-color;

  &:hover {
    border-color: $red-color;
    background: $red-color;
  }

  a {
    color: #ffffff;

    &:hover {
      color: #ffffff;
    }
  }
}
</style>

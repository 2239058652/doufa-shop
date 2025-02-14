<template>
  <div class="custom-checkbox" @click="toggleCheck">
    <div class="checkbox-inner" :class="{ 'is-checked': modelValue, 'is-round': round }">
      <span v-if="modelValue" class="checkmark">
        <template v-if="!round">✓</template>
        <template v-else>
          <div class="dot"></div>
        </template>
      </span>
    </div>
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  label?: string
  round?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const toggleCheck = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped lang="scss">
.custom-checkbox {
  display: inline-flex;
  cursor: pointer;
  vertical-align: middle;
  align-items: center;

  .checkbox-inner {
    width: 18px;
    height: 18px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    background: white;
    position: relative;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    &.is-round {
      border-radius: 50%;
      display: flex; // 添加flex布局
      align-items: center;
      justify-content: center;

      &.is-checked {
        border-color: $red-color;
        background-color: white;

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: $red-color;
          flex-shrink: 0; // 防止缩放
          position: relative; // 相对定位
          display: block; // 确保显示为块级元素
        }
      }
    }

    &.is-checked:not(.is-round) {
      background-color: $red-color;
      border-color: $red-color;
    }

    .checkmark {
      color: white;
      font-size: 12px;
      line-height: 1;
      user-select: none;
    }
  }

  .checkbox-label {
    margin-left: 4px;
    height: 18px;
    font-size: 14px;
    color: #333333;
    line-height: 18px;
    display: flex;
    align-items: center;
  }
}
</style>

<template>
  <div class="custom-checkbox" @click="handleClick">
    <div class="checkbox-inner" :class="{ 'is-checked': modelValue, 'is-round': round }">
      <!-- 保持原有图标逻辑 -->
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
  (e: 'change', payload: boolean | any): void // 灵活接受任意类型参数
}>()

const handleClick = () => {
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue) // 默认传递选中状态
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
      display: flex;
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
          flex-shrink: 0;
          position: relative;
          display: block;
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

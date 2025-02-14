<template>
  <div class="radio-group">
    <div v-for="item in options" :key="item.value" class="radio-item" @click="() => handleClick(item.value)">
      <div class="radio-inner" :class="{ 'is-checked': modelValue === item.value, 'is-round': round }">
        <template v-if="modelValue === item.value">
          <template v-if="!round">✓</template>
          <template v-else>
            <div class="dot"></div>
          </template>
        </template>
      </div>
      <span v-if="item.label" class="radio-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: string | number
  options: Option[]
  round?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const handleClick = (value: string | number) => {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.radio-group {
  display: flex;

  .radio-item {
    display: inline-flex;
    cursor: pointer;
    vertical-align: middle;
    align-items: center;
    margin-right: 20px;

    .radio-inner {
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
        color: white;
      }
    }

    .radio-label {
      margin-left: 4px;
      height: 18px;
      font-size: 14px;
      color: #333333;
      line-height: 18px;
      display: flex;
      align-items: center;
    }
  }
}
</style>

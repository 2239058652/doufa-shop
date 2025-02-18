<template>
  <div class="radio-group" role="radiogroup">
    <div
      v-for="item in options"
      :key="item.value"
      class="radio-item"
      role="radio"
      :tabindex="0"
      :aria-checked="modelValue === item.value"
      :aria-labelledby="`radio-label-${item.value}`"
      @click="handleClick(item.value)"
      @keydown.enter.space.prevent="handleClick(item.value)"
    >
      <div
        class="radio-inner"
        :class="{
          'is-checked': modelValue === item.value,
          'is-round': round
        }"
      >
        <template v-if="modelValue === item.value">
          <template v-if="!round">✓</template>
          <div v-else-if="round" class="dot"></div>
        </template>
      </div>
      <span v-if="item.label" :id="`radio-label-${item.value}`" class="radio-label">
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: string | number | null
  options: Option[]
  round?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const handleClick = (value: string | number) => {
  if (value === props.modelValue) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.radio-group {
  display: flex;
  gap: 20px;

  .radio-item {
    display: inline-flex;
    cursor: pointer;
    align-items: center;
    transition: all 0.2s ease;
    outline: none;

    &:focus-visible {
      box-shadow: 0 0 0 2px rgba(#409eff, 0.3);
    }

    .radio-inner {
      --radio-size: 18px;
      --radio-color: #{$red-color};

      width: var(--radio-size);
      height: var(--radio-size);
      border: 1px solid #d9d9d9;
      background: white;
      position: relative;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;

      &.is-round {
        border-radius: 50%;

        .dot {
          width: calc(var(--radio-size) - 8px);
          height: calc(var(--radio-size) - 8px);
          border-radius: 50%;
          background-color: var(--radio-color);
        }
      }

      &:not(.is-round) {
        border-radius: 3px;

        &.is-checked {
          background-color: var(--radio-color);
          border-color: var(--radio-color);
          color: white;
        }
      }

      &.is-checked:is(.is-round) {
        border-color: var(--radio-color);
      }
    }

    .radio-label {
      padding: 0 8px;
      margin: 0;
      font-size: 14px;
      line-height: 14px;
      color: #000;
      user-select: none;
    }
  }
}
</style>

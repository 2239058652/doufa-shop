<template>
  <div>
    <a-float-button type="primary" :style="{
      right: '24px',
    }">
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>

    <a-float-button type="default" :style="{
      right: '94px',
    }">
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>
  </div>
</template>

<script lang="ts" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

</script>

<style scoped></style>

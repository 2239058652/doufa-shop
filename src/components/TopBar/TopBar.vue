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
    <a-button @click="handleclick">aaa</a-button>
  </div>
</template>

<script lang="ts" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
const handleclick = () => {
  message.success({
    content: () => 'This is a prompt message with custom className and style',
    class: 'custom-class',
    style: {
      marginTop: '20vh',
    },
  });
}

</script>

<style scoped></style>

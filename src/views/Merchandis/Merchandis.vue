<template>
  <div class="merchandis">
    <div class="logo-search"></div>
    <div class="user-store"></div>
    <div class="goods-order"></div>
    <div class="goods-detail"></div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route)

</script>

<style scoped src="./Merchandis.scss"></style>

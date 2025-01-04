import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGoodsCartsTableStore = defineStore('goodsCartsTable', () => {
  const goodsCartsTable = ref([])

  const reGoodsCartsTable = (data: []) => {
    goodsCartsTable.value = data
  }

  return { goodsCartsTable, reGoodsCartsTable }
}, {
  persist: true,
})

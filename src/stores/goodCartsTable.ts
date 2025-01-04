import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGoodsCartsTableStore = defineStore('goodsCartsTable', () => {
  const goodsCartsTable = ref<any>([])

  const reGoodsCartsTable = (data: any[]) => {
    goodsCartsTable.value = data
  }
  const clearGoodsCartsTable = () => {
    goodsCartsTable.value = []
  }

  return { goodsCartsTable, reGoodsCartsTable, clearGoodsCartsTable }
}, {
  persist: true,
})

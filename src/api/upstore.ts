import request from '@/axios'

// 用户授权抖店商品列表
export const AuthStoreGoodsList = (params?: { page?: string | number, pageSize?: string | number }) => {
  return request.get({
    url: '/api/getStoreGoodsList',
    params
  })
}

import request from '@/axios'

interface IDYOder {
  page: number | string;
  limit: number | string;
  time_start: string | number;
  time_end: string | number;
  store_id: string;
  user_id: string;
  product: string;
}

// 用户授权店铺列表
export const userStoreList = (data: { page: number | string; limit: number | string }) => {
  return request.get({
    url: '/api/user/storeList',
    params: data
  })
}

// 授权店铺订单权限
export const authorizeGoods = (params: { path: string }) => {
  return request.get({
    url: '/api/authorize/order',
    params
  })
}

// 同步抖店订单
export const syncDyOrder = (data: IDYOder) => {
  return request.post({
    url: '/api/test/test',
    data
  })
}

// 解除店铺绑定
export const unbindStore = (params: any) => {
  return request.get({
    url: '/api/unbindStore',
    params
  })
}

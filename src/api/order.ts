import request from '@/axios'

// 订单列表
export const aorderList = (params: IOrderList) => {
  return request.get({
    url: `/api/order/list`,
    params
  })
}

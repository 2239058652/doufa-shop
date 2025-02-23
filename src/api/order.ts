import request from '@/axios'

// 订单列表
export const aorderList = (params: IOrderList) => {
  return request.get({
    url: `/api/order/list`,
    params
  })
}

// 批量删除订单 订单ID，多个用逗号分开
export const deleteMuchOrder = (data: { ids: string }) => {
  return request.post({
    url: `/api/order/delOrder`,
    data
  })
}

// 删除订单
export const deleteOneOrder = (data: { id: string | number }) => {
  return request.post({
    url: `/api/order/cancel`,
    data
  })
}

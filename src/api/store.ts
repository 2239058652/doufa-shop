import request from '@/axios'

// 退货地址列表
export const returnAddressList = (data: { page: number; limit: number }) => {
  return request.get({
    url: '/api/address/list',
    params: data
  })
}

// 首页分类接口 不传则全是站点分类：常熟：7 新塘：8：新塘 67：童装
type CategoryType = '7' | '8' | '67' | ''
export const getCategory = (params?: { id?: CategoryType }) => {
  return request.get({
    url: "/api/category",
    params,
  })
}

// 首页轮播接口
export const getBanner = (id: string | number) => {
  return request.get({
    url: `/api/article/list/${id}`,
  })
}

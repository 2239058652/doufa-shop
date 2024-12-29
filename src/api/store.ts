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

// 商品列表接口
interface IProductParams {
  page: number
  limit: number
  goods_address?: string
  mer_id?: string
}
export const getProducts = (params: IProductParams) => {
  return request.get({
    url: `/api/products`,
    method: "get",
    params,
  })
}

// 商品详情
export const getProductDetail = (id: string | number) => {
  return request.get({
    url: `/api/product/detail/${id}`,
  })
}

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
export const getCategory = (params?: { id?: CategoryType; city_name?: string }) => {
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
  sid?: string
  keyword?: string
  url?: string
  salesOrder?: string
  priceOrder?: string
  star_price?: number | string
  end_price?: number | string
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

// 购物车列表
interface ICartsParams {
  status: string | number;
  page: number;
  limit: number
}
export const getShoppingCart = (params: ICartsParams = {
  status: 1,
  page: 0,
  limit: 10
}) => {
  return request.get({
    url: `/api/cart/list`,
    method: "get",
    params
  })
}

// 删除购物车商品
export const deleteCarts = (data: { ids: string }) => {
  return request.post({
    url: `/api/cart/del`,
    data
  })
}

// 商品详情
export const getAddressRegion = () => {
  return request.get({
    url: `/api/region`
  })
}

// 购物车数量
export const getCartCount = (params: { numType?: boolean } = { numType: true }) => {
  return request.get({
    url: `/api/cart/count`,
    params
  })
}

// 供应商列表
export const getSystemAdmin = (params: { page: string | number; limit: string | number; name: string } = { page: 0, limit: 10, name: '' }) => {
  return request.get({
    url: `/api/systemAdminList`,
    params
  })
}

// 加入购物车
export const addGoodsToCart = (data: { productId: string | number; cartNum: string | number; uniqueId: string | number; new?: string | number; }) => {
  return request.post({
    url: `/api/cart/add`,
    data
  })
}

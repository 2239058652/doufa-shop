import request from '@/axios'

// 用户授权抖店商品列表
export const AuthStoreGoodsList = (params?: { page?: string | number; limit?: string | number }) => {
  return request.get({
    url: '/api/getStoreGoodsList',
    params
  })
}

// 授权店铺上传商品权限
export const getSellsUpload = (params: { path: string }) => {
  return request.get({
    url: '/api/authorize/goods',
    params
  })
}

// 获取店铺运费模板
export const getTemplateList = (params: { token: string }) => {
  return request.get({
    url: 'api/product/templateList',
    params
  })
}

// 上货
export const upAddProduct = (data: any) => {
  return request.post({
    url: '/api/product/addProduct',
    data
  })
}

// 获取分类列表
export const getPrdCateList = (params: { token: string; cid?: string }) => {
  return request.get({
    url: 'api/product/categoryList',
    params
  })
}

// 获取商品属性列表
export const getCatePropertyList = (params: { data: { token: string; category_leaf_id: string } }) => {
  return request.get({
    url: '/api/product/getCateProperty',
    params
  })
}

// 获取品牌列表
export const fetchBrandList = (params: { token: string; category_id: string }) => {
  return request.get({
    url: '/api/product/getBrandList',
    params
  })
}

// 查询商品发布规则
export const fetchProUpRule = (params: {
  data: {
    token: string
    category_id: string
  }
}) => {
  return request.get({
    url: '/api/product/getProductUpdateRule',
    params
  })
}

// 获取尺码表模板列表
export const getProductList = (params: ISize) => {
  return request.get({
    url: '/api/product/getComponentTemplate',
    params
  })
}

import request from '@/axios'

// 用户授权抖店商品列表
export const AuthStoreGoodsList = (params?: { page?: string | number, pageSize?: string | number }) => {
  return request.get({
    url: '/api/getStoreGoodsList',
    params
  })
}

// 授权店铺上传商品权限
export const getSellsUpload = (params: { path: string }) => {
  return request.get({
    url: '/api/authorize/goods',
    params,
  });
};

// 获取店铺运费模板
export const getTemplateList = (params: { token: string }) => {
  return request.get({
    url: "api/product/templateList",
    params,
  });
};

// 上货
export const upAddProduct = (data: any) => {
  return request.post({
    url: "/api/product/addProduct",
    data
  });
};

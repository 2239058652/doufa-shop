import request from '@/axios'

export const returnAddressList = (data: { page: number; limit: number }) => {
  return request.get({
    url: '/api/address/list',
    params: data
  })
}


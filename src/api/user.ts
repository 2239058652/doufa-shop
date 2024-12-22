import request from '@/axios'

// 登录
export const doLogin = (data: { account: number; password: number }) => {
  return request.post({
    url: '/api/login',
    data,
  })
}

// 注册
export const doRegister = (data: { account: number; password: number }) => {
  return request.post({
    url: '/api/register',
    data,
  })
}

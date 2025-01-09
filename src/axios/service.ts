import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
  AxiosError
} from 'axios'

import qs from 'qs'

import { config } from './config'

const { base_url } = config

export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH as keyof typeof base_url]

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 如果开启 token 认证
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token') // 请求头携带 token
    if (config.method === 'post' && (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded') {
      config.data = qs.stringify(config.data)
    }
    if (
      config.method === 'post' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
      'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.config.responseType === 'blob') {
      // 如果是文件流，直接过
      return response
    } else return response.data
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export { service }

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
export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH as keyof typeof base_url] || '/api'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL,
  timeout: config.request_timeout,
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

// 处理嵌套参数的辅助函数
const processNestedParams = (params: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (key === 'data' && typeof value === 'object') {
      // 处理 data 嵌套参数
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        result[`data[${nestedKey}]`] = nestedValue
      })
    } else {
      // 其他参数保持原样
      result[key] = value
    }
  })

  return result
}

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 统一添加认证头
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`

    // 处理 POST 请求参数
    if (config.method === 'post') {
      const contentType = (config.headers as AxiosRequestHeaders)['Content-Type']

      if (contentType === 'application/x-www-form-urlencoded') {
        config.data = qs.stringify(config.data)
      }
    }

    // 处理 GET 请求嵌套参数
    if (config.method === 'get' && config.params) {
      // 处理嵌套参数转换
      const processedParams = processNestedParams(config.params)

      // 构建 URL 查询字符串
      const queryString = Object.entries(processedParams)
        .map(([key, value]) => {
          if (value === undefined || value === null) return ''
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        })
        .filter(Boolean)
        .join('&')

      // 更新 URL 和 params
      config.url = queryString ? `${config.url}?${queryString}` : config.url
      config.params = undefined  // 清空 params 避免重复
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.config.responseType === 'blob' ? response : response.data
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export { service }

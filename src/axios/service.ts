import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios'
import qs from 'qs'
import { config } from './config'

const { base_url } = config
export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH as keyof typeof base_url] || '/api'

// 处理请求参数格式
const formatParams = (data: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {}

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'data' && typeof value === 'object') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        result[`data[${dataKey}]`] = dataValue
      })
    } else {
      result[key] = value
    }
  })

  return result
}

const service: AxiosInstance = axios.create({
  baseURL: PATH_URL,
  timeout: config.request_timeout
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`

    // 处理文件上传
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      return config
    }

    // 处理 POST 请求
    if (config.method?.toLowerCase() === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

      if (config.data && typeof config.data === 'object') {
        config.data = qs.stringify(formatParams(config.data))
      }
    }

    // 处理 GET 请求
    if (config.method?.toLowerCase() === 'get' && config.params) {
      config.params = formatParams(config.params)
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.config.responseType === 'blob' ? response : response.data
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export { service }

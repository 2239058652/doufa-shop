import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError
} from 'axios'
import qs from 'qs'
import { config } from './config'

const { base_url } = config
export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH as keyof typeof base_url] || '/api'

const service: AxiosInstance = axios.create({
  baseURL: PATH_URL,
  timeout: config.request_timeout,
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

// Enhanced parameter processing
const processParams = (params: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (key === 'data' && typeof value === 'object') {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        result[`data[${nestedKey}]`] = nestedValue
      })
    } else {
      result[key] = value
    }
  })

  return result
}

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`

    if (config.method?.toLowerCase() === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      // Handle nested data format for POST
      if (config.data && typeof config.data === 'object') {
        config.data = qs.stringify(processParams(config.data))
      }
    }

    if (config.method?.toLowerCase() === 'get' && config.params) {
      const processedParams = processParams(config.params)
      const queryString = Object.entries(processedParams)
        .map(([key, value]) => {
          if (value === undefined || value === null) return ''
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        })
        .filter(Boolean)
        .join('&')

      config.url = queryString ? `${config.url}?${queryString}` : config.url
      config.params = undefined
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

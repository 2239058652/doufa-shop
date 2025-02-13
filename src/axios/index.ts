import { service } from './service'
import { config } from './config'
import type { AxiosRequestConfig, ResponseType } from 'axios'

const { default_headers } = config

interface RequestOption extends Partial<AxiosRequestConfig> {
  url: string
  method?: string
  params?: any
  data?: any
  headersType?: string
  responseType?: ResponseType
  timeout?: number
}

const request = (option: RequestOption) => {
  const { url, method, params, data, headersType, responseType, timeout } = option

  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    params,
    data,
    responseType,
    headers: {
      'Content-Type': headersType || default_headers
    },
    timeout: timeout || config.request_timeout
  }

  return service(axiosConfig)
}

export default {
  get: <T = any>(option: RequestOption) => {
    return request({ method: 'get', ...option }) as Promise<T>
  },
  post: <T = any>(option: RequestOption) => {
    return request({ method: 'post', ...option }) as Promise<T>
  },
  delete: <T = any>(option: RequestOption) => {
    return request({ method: 'delete', ...option }) as Promise<T>
  },
  put: <T = any>(option: RequestOption) => {
    return request({ method: 'put', ...option }) as Promise<T>
  }
}

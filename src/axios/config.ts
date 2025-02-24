const config: IConfig = {
  /**
   * api请求基础路径
   */
  base_url: {
    // 开发环境接口前缀
    base: 'https://ceshi.doufapt.com',

    // 打包开发环境接口前缀
    dev: 'https://test.doufapt.com',

    // 打包生产环境接口前缀
    pro: 'https://ceshi.doufapt.com',

    // 打包测试环境接口前缀
    test: 'https://test.doufapt.com'
  },

  /**
   * 接口成功返回状态码
   */
  result_code: 1000,

  /**
   * 接口请求超时时间
   */
  request_timeout: 60000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: 'application/json'
}

export { config }

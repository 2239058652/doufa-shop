import request from '@/axios'
export default {
  // 获取指定时间段机组处理情况
  findAllOutPut(data) {
    return request.post({
      url: '/pmspbe/output/findAllOutPut',
      data
    })
  },

  // 上传中长期曲线
  uploadLongLine(data) {
    return request.post({
      url: '/pmspbe/gensetquote/uploadMediumAndLongTerm',
      data,
      headersType: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // 下载机组报价
  downloadGensetQuote(data) {
    return request.post({
      url: '/pmspbe/gensetquoteHuadian/download',
      params: data,
      responseType: 'blob'
    })
  },
  // 报价策略
  getQuote() {
    return request.post({
      url: '/pmspbe/gensetquoteHuadian/quotelistRule',
      timeout: 3600000
    })
  }
}

import request from '@/axios'

// 文件上传接口
export const fetchUploadFile = (data: FormData) => {
  return request.post({
    url: '/api/upload/image',
    data,
    headersType: 'multipart/form-data',
    // headersType: {
    //   'Content-Type': 'multipart/form-data'
    // }
  })
}



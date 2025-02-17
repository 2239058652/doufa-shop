import type { Rule } from 'ant-design-vue/es/form'

const phoneReg =
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[\d]))\d{8}$/
// 校验手机号
export const validatePhone = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('请输入客服电话')
  if (phoneReg.test(value)) {
    return Promise.resolve()
  } else {
    return Promise.reject('请输入正确的手机号')
  }
}

export const phoneRegTest = (value: string) => {
  if (phoneReg.test(value)) {
    return true
  } else {
    return false
  }
}

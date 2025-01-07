import { message } from 'ant-design-vue'
import router from './router'

const whiteList = ['/'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  // 检查是否在白名单中
  // if (whiteList.includes(to.path)) {
  //   next()
  //   return
  // }
  // 设置页面标题
  document.title = to.meta.title || '默认标题'
  // 权限检查
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    message.warning('请登录后再访问！')
    next(from.fullPath)
    return
  }
  next()
})
// 全局后置钩子
router.afterEach((to, from) => {
  // 可以添加路由跳转后的逻辑，如埋点统计等
})


// 错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  message.error('页面加载失败，请刷新重试')
})

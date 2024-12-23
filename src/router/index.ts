import { createRouter, createWebHistory } from 'vue-router'
import TopLayoutBar from '../layout/TopBar/TopBar.vue'
import SiderMenuBar from '../layout/SideMenu/SideMenu.vue'
import { message } from 'ant-design-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: TopLayoutBar,
      meta: {
        title: '首页',
        hidden: true
      },
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/index.vue'),
          meta: {
            title: '首页',  // 标题必须设置
            requireSidebar: false,  // 是否需要侧边栏菜单
            hidden: true  // 不需要侧边栏设置为true
          }
        }
      ]
    },
    {
      path: '/usermanage',
      name: 'UserManage',
      redirect: '/usermanage/userinfo',
      meta: {
        title: '用户中心',
        hidden: false
      },
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (token) {
          next()
        } else {
          message.warning('请登录后再访问！')
          next(from.fullPath)
        }
      },
      component: SiderMenuBar,
      children: [
        {
          path: 'userinfo',
          name: 'UserInfo',
          component: () => import('@/views/UserManage/UserInfo/UserInfo.vue'),
          meta: {
            title: '用户信息',
            requireSidebar: true
          }
        },
        {
          path: 'saveshop',
          name: 'SaveShop',
          component: () => import('@/views/UserManage/SaveShop/SaveShop.vue'),
          meta: {
            title: '收藏商品',
            requireSidebar: true
          }
        },
        {
          path: 'savemaster',
          name: 'SaveMaster',
          component: () => import('@/views/UserManage/SaveMaster/SaveMaster.vue'),
          meta: {
            title: '收藏商家',
            requireSidebar: true
          }
        },
        {
          path: 'mypurse',
          name: 'MyPurse',
          component: () => import('@/views/UserManage/MyPurse/MyPurse.vue'),
          meta: {
            title: '我的钱包',
            requireSidebar: true
          }
        },
        {
          path: 'coupon',
          name: 'MyCoupon',
          component: () => import('@/views/UserManage/MyCoupon/MyCoupon.vue'),
          meta: {
            title: '优惠券',
            requireSidebar: true
          }
        },
        {
          path: 'loginrecord',
          name: 'LoginRecord',
          component: () => import('@/views/UserManage/LoginRecord/LoginRecord.vue'),
          meta: {
            title: '登录记录',
            requireSidebar: true
          }
        }
      ]
    },
    {
      path: '/ordermanage',
      name: 'OrderManage',
      redirect: '/ordermanage/ordelist',
      meta: {
        title: '订单管理',
        hidden: false
      },
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (token) {
          next()
        } else {
          message.warning('请登录后再访问！')
          next(from.fullPath)
        }
      },
      component: SiderMenuBar,
      children: [
        {
          path: 'ordelist',
          name: 'OrderList',
          component: () => import('@/views/OrderManage/OrderList/OrderList.vue'),
          meta: {
            title: '订单列表',
            requireSidebar: true
          }
        },
        {
          path: 'selleds',
          name: 'Selleds',
          component: () => import('@/views/OrderManage/Selleds/Selleds.vue'),
          meta: {
            title: '售后商品',
            requireSidebar: true
          }
        },
        {
          path: 'nosend',
          name: 'NoSend',
          component: () => import('@/views/OrderManage/NoSend/NoSend.vue'),
          meta: {
            title: '未发货商品',
            requireSidebar: true
          }
        },
        {
          path: 'abnormal',
          name: 'Abnormal',
          component: () => import('@/views/OrderManage/Abnormal/Abnormal.vue'),
          meta: {
            title: '异常订单',
            requireSidebar: true
          }
        }
      ]
    },
    {
      path: '/shopsmanage',
      name: 'ShopsManage',
      redirect: '/shopsmanage/ordestore',
      meta: {
        title: '下单管理',
        hidden: false
      },
      beforeEnter: (to, from, next) => {
        console.log(from)

        const token = localStorage.getItem('token')
        if (token) {
          next()
        } else {
          message.warning('请登录后再访问！')
          next(from.fullPath)
        }
      },
      component: SiderMenuBar,
      children: [
        {
          path: 'ordestore',
          name: 'OerderStore',
          component: () => import('@/views/ShopsManage/OerderStore/OerderStore.vue'),
          meta: {
            title: '下单店铺管理',
            requireSidebar: true
          }
        },
        {
          path: 'shopcart',
          name: 'ShopCart',
          component: () => import('@/views/ShopsManage/ShopCart/ShopCart.vue'),
          meta: {
            title: '购物车',
            requireSidebar: true
          }
        },
        {
          path: 'muchoder',
          name: 'MuchOder',
          component: () => import('@/views/ShopsManage/MuchOder/MuchOder.vue'),
          meta: {
            title: '批量下单',
            requireSidebar: true
          }
        }
      ]
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import TopLayoutBar from '../layout/TopBar/TopBar.vue'
import SiderMenuBar from '../layout/SideMenu/SideMenu.vue'
import { message } from 'ant-design-vue'


// meta:
//   keepAlive: true,  // 是否需要缓存
//   title: '购物车页面',  // 标题必须设置
//   requireSidebar: false,  // 是否需要侧边栏菜单
//   hidden: true,
//   requireFooter: false  // 不需要底部设置为 false,默认为true
const asyncRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: TopLayoutBar,
    meta: {
      title: '顶部菜单',
      hidden: true
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home.vue'),
        meta: {
          title: '首页',
          requireSidebar: false,
          hidden: true
        }
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/Search/Search.vue'),
        meta: {
          title: '商品搜索页',
          requireSidebar: false,
          hidden: true
        }
      },
      {
        path: 'merhome',
        name: 'MerHome',
        component: () => import('@/views/MerHome/MerHome.vue'),
        meta: {
          title: '商品首页',
          requireSidebar: false,
          hidden: true,
          requireFooter: false
        }
      },
      {
        path: 'merchandis/:id',
        name: 'Merchandis',
        component: () => import('@/views/Merchandis/Merchandis.vue'),
        meta: {
          title: '商品详情页',
          requireSidebar: false,
          hidden: true
        }
      },
      {
        path: 'shoppingcart',
        name: 'ShoppingCart',
        component: () => import('@/views/ShoppingCart/ShoppingCart.vue'),
        meta: {
          title: '购物车页面',
          requireSidebar: false,
          hidden: true,
          requireFooter: false
        }
      },
      {
        path: 'payorder',
        name: 'PayOrder',
        component: () => import('@/views/PayOrder/PayOrder.vue'),
        meta: {
          title: '支付订单',
          requireSidebar: false,
          hidden: true,
          requireFooter: false
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
      },
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
        redirect: '/shoppingcart',
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
  },
  {
    path: '/404',
    name: '404page',
    component: () => import('@/views/Errors/404.vue'),
    meta: {
      title: '404页面',
      hidden: true
    },
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    meta: {
      title: '错误处理页面',
      hidden: true
    },
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: asyncRoutes,
  scrollBehavior() {
    // 回到顶部
    const appElement = document.getElementById('router-view')
    if (appElement) {
      appElement.scrollTo({
        top: 0,
      })
    }
  }
})



export default router

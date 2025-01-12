<template>
  <div class="main">
    <TopMenu ref="topMenuRef" />
    <div class="side-menu">
      <a-menu
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        class="menu"
        mode="inline"
        :items="items"
        @click="handleClick"
      />
      <div class="router-view">
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" v-if="getFirstLevelRoute(route).meta.keepAlive" />
          </keep-alive>
          <component :is="Component" v-if="!getFirstLevelRoute(route).meta.keepAlive" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TopMenu from '../TopBar/TopBar.vue'
import { inject, onMounted, provide, reactive, ref, watch } from 'vue'
import type { MenuProps, ItemType } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const routes = router.options.routes
const currentRoute = router.currentRoute
const topMenuRef = ref<any>(null)

// 根据当前路由路径初始化选中的菜单项
const selectedKeys = ref<string[]>([currentRoute.value.fullPath])

// 处理二级路由加载俩次问题，二级就返回第二个就不加载俩次
function getFirstLevelRoute(route: { matched: string | any[] }) {
  if (!Array.isArray(route.matched) || route.matched.length === 0) {
    return route
  }
  return route.matched[route.matched.length - 1]
}

// 获取父级路径用于展开菜单
// const getCurrentParentPath = () => {
//   const matched = currentRoute.value.matched
//   return matched.length > 1 ? `/${matched[0].path}` : ''
// }

// 添加一个获取所有父级路径的函数
const getAllParentPaths = (routes: any[]): string[] => {
  const paths: string[] = []

  const traverse = (route: any, parentPath: string = '') => {
    const fullPath = (parentPath + '/' + route.path).replace('//', '/')
    if (!route.meta?.hidden && route.path !== '/') {
      paths.push(fullPath)
    }
    route.children?.forEach((child: any) => traverse(child, fullPath))
  }

  routes.forEach((route) => traverse(route))
  return paths
}

// const openKeys = ref<string[]>([getCurrentParentPath()])  // 初始化展开的菜单项，只展开选中的菜单项
const openKeys = ref<string[]>(getAllParentPaths(routes as any[])) // 展开所有菜单项
// 初始化展开的菜单项
// 获取所有需要默认展开的一级菜单路径
const getParentPaths = () => {
  const paths: string[] = []
  currentRoute.value.matched.forEach((route) => {
    if (route.path && !route.meta?.hidden) {
      paths.push(route.path)
    }
  })
  return paths
}

// 修改 getItem 函数来处理路由
function getItem(route: any, parentPath: string = ''): ItemType {
  const fullPath = parentPath + '/' + route.path
  return {
    key: fullPath.replace('//', '/'),
    icon: null,
    children: route.children?.map((child: any) => getItem(child, fullPath)),
    label: route.meta?.title || route.name
  } as unknown as ItemType
}

// 根据路由生成菜单项
const items: ItemType[] = reactive(
  routes.filter((route: any) => !route.meta?.hidden && route.path !== '/').map((route: any) => getItem(route))
)

// 修改点击处理函数以支持路由跳转
const handleClick: MenuProps['onClick'] = (e) => {
  selectedKeys.value = [e.key.toString()]
  router.push(e.key.toString())
}

watch(openKeys, (val) => {
  // console.log('openKeys', val)
})
// 监听路由变化来更新菜单状态
watch(
  () => currentRoute.value.fullPath,
  () => {
    const currentPath = currentRoute.value.fullPath
    selectedKeys.value = [currentPath]
    // 不再覆盖 openKeys，而是添加新的展开项
    const parentPaths = getParentPaths()
    if (parentPaths.length) {
      openKeys.value = [...new Set([...openKeys.value, ...parentPaths])]
      // openKeys.value = parentPaths  // 覆盖 openKeys
    }
  },
  { immediate: true }
)

provide('topMenuRef', topMenuRef) // 注入重置密码弹窗
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  // overflow-x: hidden;
}
.side-menu {
  display: flex;
  width: 100%;
  height: calc(100% - 40px);
}
.menu {
  width: 206px;
}
.router-view {
  flex-grow: 1;
  overflow-y: auto;
  height: auto;
}

/* 添加父级菜单样式 */
:deep(.ant-menu-submenu-title) {
  font-weight: bold;
  font-size: 16px;
  color: #333333;
  line-height: 21px;
}

:deep(.ant-menu-submenu-selected > .ant-menu-submenu-title) {
  color: #f83126;
}

/* 二级菜单颜色修改 */

:deep(.ant-menu-item) {
  font-size: 14px;
  color: #666666;
  line-height: 19px;
}
:deep(.ant-menu-item-selected) {
  background-color: #ffebe9;
  color: #f83126;
}
</style>

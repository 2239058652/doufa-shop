declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-draggable-plus' {
  import { DefineComponent } from 'vue'
  const VueDraggable: DefineComponent<{}, {}, any>
  export { VueDraggable }
}

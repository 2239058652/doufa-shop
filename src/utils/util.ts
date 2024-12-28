export const getIconPath = (svg: string): string => {
  return 'image://data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
export const datetimeFormat = 'YYYY-MM-DD HH:mm:ss'
export const dateFormat = 'YYYY-MM-DD'
export const px = (n: number) => (n / 1920) * (window as any).pageWidth
export const mock = true

// 防抖函数
export const debounce = (fn: Function, delay: number) => {
  let timer: any | null = null
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export const getIconPath = (svg: string): string => {
  return 'image://data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
export const datetimeFormat = 'YYYY-MM-DD HH:mm:ss'
export const dateFormat = 'YYYY-MM-DD'
export const px = (n: number) => (n / 1920) * (window as any).pageWidth
export const mock = true

// 防抖函数
export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 节流函数
export const throttle = (fn: (...args: any[]) => void, delay: number) => {
  let lastTime = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: any[]) => {
    const now = Date.now()

    // 清除现有的定时器
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    // 如果达到延迟时间,立即执行
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    } else {
      // 否则设置一个定时器在剩余时间后执行
      timer = setTimeout(() => {
        fn.apply(this, args)
        lastTime = Date.now()
      }, delay)
    }
  }
}

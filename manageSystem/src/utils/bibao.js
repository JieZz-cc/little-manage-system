// 节流
const throttle = (fn, delay) => {
  let timer = null
  return (...args) => {
    if (timer) return
    fn.call(undefined, ...args)
    timer = setTimeout(() => {
      timer = null
    }, delay)
  }
}

// 防抖
const debounce = (fn, delay) => {
  let timer = null
  return (...args) => {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.call(undefined, ...args)
      timer = null
    }, delay)
  }
}



console.log(typeof debounce);

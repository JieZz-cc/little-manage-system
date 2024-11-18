// Vue3.0 中通过 Proxy 来替换原本的 Object.defineProperty 来实现数据响应式
// Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作
// let p = new Proxy(target, handler)
let onWatch = (obj, setBind, getLoger) => {
  let handler = {
    get(target, property,receiver) {
      getLoger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}
let obj = {a:1}
let p = onWatch(
  obj,
  (val, property) => {
    console.log(`监听到属性${property}改变为${val}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)
p.a = 2   // a为2
p.a       // 'a' = 2



// ...rest运算符
// 
let f1 = (...args) => {
  console.log(args) // [1,2,3]
  let res = 0
  for(let val of args) {
    res += val
  }
  console.log(res);
}
f1(1,2,3)   // 6



let obj1 = {'a': 1, 'b': 2}
console.log(Object.keys(obj1)); // ['a', 'b']

console.log(Object.prototype._proto_);

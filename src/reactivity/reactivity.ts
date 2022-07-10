import { track, trigger } from "./effect"
export function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const res = Reflect.get(target, key)
      // TODO依赖收集
      track(target, key)
      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      //  TODO 触发依赖
      trigger(target, key, value)
      return res
    },
  })
}

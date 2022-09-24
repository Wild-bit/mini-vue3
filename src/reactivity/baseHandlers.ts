import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

export const mutabHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
    return true
  },
}

export function createGetter(isReadOnly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)
    if (!isReadOnly) {
      // TODO依赖收集
      track(target, key)
    }
    return res
  }
}

export function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    //  TODO 触发依赖
    trigger(target, key, value)
    return res
  }
}

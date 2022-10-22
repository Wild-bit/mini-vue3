import { isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"
import { isRef, unRef, unref } from "./ref"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

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

export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
    return true
  },
}

export const proxyRefsHandlers = {
  get(target, key) {
    // 如果属性为ref 访问时不需要.value获取值
    return unRef(Reflect.get(target, key))
  },
  set(target, key, value) {
    if (isRef(target[key]) && !isRef(value)) {
      return (target[key].value = value)
    } else {
      return Reflect.set(target, key, value)
    }
  },
}

export function createGetter(isReadOnly = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadOnly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadOnly
    }
    const res = Reflect.get(target, key)
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      return isReadOnly ? readonly(res) : reactive(res)
    }
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

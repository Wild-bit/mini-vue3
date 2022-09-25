import {
  mutabHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers"

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

export function reactive(obj) {
  return createReactiveObject(obj, mutabHandlers)
}

export function readonly(obj) {
  return createReactiveObject(obj, readonlyHandlers)
}

export function isReactive(obj) {
  return !!obj[ReactiveFlags.IS_REACTIVE]
}

export function isReadOnly(obj) {
  return !!obj[ReactiveFlags.IS_READONLY]
}

export function shallowReadonly(obj) {
  return createReactiveObject(obj, shallowReadonlyHandlers)
}

function createReactiveObject(target, baseHandlers) {
  const proxy = new Proxy(target, baseHandlers)
  return proxy
}

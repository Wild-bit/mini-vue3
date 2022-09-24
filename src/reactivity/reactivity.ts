import { mutabHandlers, readonlyHandlers } from "./baseHandlers"

export function reactive(obj) {
  return createReactiveObject(obj, mutabHandlers)
}

export function readonly(obj) {
  return createReactiveObject(obj, readonlyHandlers)
}

function createReactiveObject(target, baseHandlers) {
  const proxy = new Proxy(target, baseHandlers)
  return proxy
}

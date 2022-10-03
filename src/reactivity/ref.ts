import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffects, triggertEffects } from "./effect"
import { reactive } from "./reactive"

export interface Ref<T = any> {
  value: T
}
class RefImpl {
  private _value: any
  private _rawValue: any
  public dep
  public _v_isRef = true

  constructor(value) {
    // 如果是一个引用值类型，就创建reactive对象，从而实现响应式的依赖的收集和触发
    this._value = isObject(value) ? reactive(value) : value
    this.dep = new Set()
  }
  get value() {
    this._rawValue = this._value
    // 当访问value值时收集依赖
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._value = isObject(newValue) ? reactive(newValue) : newValue
      this._rawValue = newValue
      //  触发依赖
      triggertRefValue(this)
    }
  }
}

export function ref(value) {
  return new RefImpl(value)
}

export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}
export function triggertRefValue(ref) {
  triggertEffects(ref.dep)
}

export function unRef<T>(ref: Ref<T> | T) {
  return isRef(ref) ? (ref as any).value : ref
}

export function convert(value) {
  return isObject(value) ? reactive(value) : value
}

export function isRef(value) {
  return !!value._v_isRef
}

// 这个函数的目的是
// 帮助解构 ref
// 比如在 template 中使用 ref 的时候，直接使用就可以了
// 例如： const count = ref(0) -> 在 template 中使用的话 可以直接 count
// 解决方案就是通过 proxy 来对 ref 做处理

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
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
  })
}

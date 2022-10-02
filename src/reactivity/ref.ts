import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffects, triggertEffects } from "./effect"
import { reactive } from "./reactive"

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

export function convert(value) {
  return isObject(value) ? reactive(value) : value
}

export function isRef(value) {
  return !!value._v_isRef
}

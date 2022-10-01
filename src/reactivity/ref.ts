import { isTracking, trackEffects, triggertEffects } from "./effect"

class RefImpl {
  private _value: any
  private _rawValue: any
  public dep

  constructor(value) {
    this._value = value
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
      this._value = newValue
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

export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue)
}

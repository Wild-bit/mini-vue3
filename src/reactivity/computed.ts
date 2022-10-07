import { ReactiveEffect } from "./effect"

class ComputedRefImpl {
  private _dirty: boolean = true // 控制是否需要缓存
  private _value: any //记录第一次getter返回值，实现缓存相关
  private _effect: ReactiveEffect
  constructor(getter) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }
  get value() {
    if (this._dirty) {
      this._dirty = false
      // 当访问computed的值时，会触发get逻辑
      // target - key - track
      // 当执行effect的run方法时会触发响应式对应的get方法，从而初始化响应式对象的映射关系，收集到相关依赖
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}

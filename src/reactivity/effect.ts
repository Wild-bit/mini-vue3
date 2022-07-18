import { Dep } from "./dep"

export class ReactiveEffect {
  private _fn: any
  deps: Dep[] = []
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    return this._fn()
  }
  stop() {
    this.deps.forEach((dep) => {
      dep.delete(this)
    })
  }
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

const targetMap = new WeakMap() //存储每个响应式对象的Map
let activeEffect //当前effect实例
// 追踪依赖
export function track(target, key) {
  // target -> key -> effect
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key) // 存储着响应式属性的依赖
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  if (!activeEffect) return
  dep.add(activeEffect) // 添加依赖 effect
  activeEffect.deps.push(dep) // 反向收集dep、用于stop功能找到对应的dep
}
// 触发依赖
export function trigger(target, key, value) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
      return
    } else {
      effect.run()
    }
  }
}

export function effect(fn, options: any = {}): ReactiveEffectRunner {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}
export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}

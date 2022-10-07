import { Dep } from "./dep"

export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: Function
  // scope?: EffectScope
  allowRecurse?: boolean
  onStop?: () => void
}

let activeEffect //当前effect实例
let shouldTrack = false // 控制是否执行fn

export class ReactiveEffect {
  private _fn: any
  deps: Dep[] = []
  active = true
  onStop?: () => void
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    // 执行 fn  但是不收集依赖
    if (!this.active) {
      return this._fn()
    }
    // 执行 fn  收集依赖
    // 可以开始收集依赖了
    shouldTrack = true
    // 执行的时候给全局的 activeEffect 赋值
    // 利用全局属性来获取当前的 effect
    activeEffect = this
    const result = this._fn()
    // 重置
    shouldTrack = false
    activeEffect = undefined
    return result
  }
  stop() {
    if (this.active) {
      // 如果第一次执行 stop 后 active 就 false 了
      // 这是为了防止重复的调用，执行 stop 逻辑
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

// 清除effect
function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

const targetMap = new WeakMap() //存储每个响应式对象的Map
// 追踪依赖
export function track(target, key) {
  // 判断是否应该收集依赖
  if (!isTracking()) return
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
  trackEffects(dep)
}
export function trackEffects(dep) {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect) // 添加依赖 effect
  ;(activeEffect as any).deps.push(dep) //反向收集dep、用于stop功能找到对应的dep
}

export function triggertEffects(dep: Dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
      return
    } else {
      effect.run()
    }
  }
}

// 触发依赖
export function trigger(target, key, value) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggertEffects(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function effect(
  fn,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  const _effect = new ReactiveEffect(fn, options)
  Object.assign(_effect, options)
  _effect.run()
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}
export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}

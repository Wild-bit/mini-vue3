import { effect, stop } from "../effect"
import { reactive } from "../reactivity"

describe("effect", () => {
  it("happly path", () => {
    const user = reactive({ age: 10 })
    let newAge
    effect(() => {
      newAge = user.age + 1
    })
    expect(newAge).toBe(11)
    user.age++
    expect(newAge).toBe(12)
  })

  it("should return runner when call effect", () => {
    let foo = 10
    let runner = effect(() => {
      foo++
      return "foo"
    })
    expect(foo).toBe(11)
    const run = runner()
    expect(foo).toBe(12)
    expect(run).toBe("foo")
  })

  it("scheduler", () => {
    // 1. 通过effec的第二个参数scheduler
    // 2. effect第一次执行的时候执行对应的fn
    // 3. 当响应式对象更新时，执行scheduler，trigger不会执行effect的fn
    // 4. 当执行runner的时候会再次执行fn,更新对应的值
    let run: any, dummy
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

  it("stop", () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    // obj.prop++
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })
})

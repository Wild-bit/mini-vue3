import { readonly } from "../reactivity"

describe("readonly", () => {
  it("happy path", () => {
    // readonly 不可设置值，只可读，就是不会触发依赖收集
    const original = { age: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.age).toBe(1)
  })

  it("warn then call set", () => {
    const spy = jest.spyOn(console, "warn")
    const user = readonly({
      age: 1,
    })
    user.age = 18
    expect(spy).toBeCalled()
  })
})

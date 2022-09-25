import { isProxy, isReactive, reactive } from "../reactive"

describe("reactive", () => {
  it("happy path", () => {
    const originObj = { foo: 1 }
    const reactiveObj = reactive(originObj)
    expect(reactiveObj).not.toBe(originObj)
    expect(reactiveObj.foo).toBe(1)
    expect(isReactive(reactiveObj)).toBe(true)
    expect(isReactive(originObj)).toBe(false)
    expect(isProxy(reactiveObj)).toBe(true)
  })
  //支持嵌套的reactive
  it("nested reactive", () => {
    const original = {
      nested: {
        foo: 1,
      },
      arr: [{ bar: 2 }],
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.arr)).toBe(true)
    expect(isReactive(observed.arr[0])).toBe(true)
  })
})

import { isReactive, reactive } from "../reactive"

describe("reactive", () => {
  it("happy path", () => {
    const originObj = { foo: 1 }
    const reactiveObj = reactive(originObj)

    expect(reactiveObj).not.toBe(originObj)
    expect(reactiveObj.foo).toBe(1)
    expect(isReactive(reactiveObj)).toBe(true)
    expect(isReactive(originObj)).toBe(false)
  })
})

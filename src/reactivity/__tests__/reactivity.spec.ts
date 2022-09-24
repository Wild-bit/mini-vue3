import { reactive } from "../reactivity"

describe("reactive", () => {
  it("happy path", () => {
    const originObj = { foo: 1 }
    const reactiveObj = reactive(originObj)
    expect(reactiveObj).not.toBe(originObj)
    expect(reactiveObj.foo).toBe(1)
  })
})

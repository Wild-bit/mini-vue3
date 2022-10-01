import { isObject } from "../../shared"
import { effect } from "../effect"
import { ref } from "../ref"

describe("ref", () => {
  it("ref return a object that have key of value", () => {
    const a = ref(1)
    expect(isObject(a)).toBe(true)
    expect(a.value === 1).toBe(true)
  })

  it("should be reactive", () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })
})

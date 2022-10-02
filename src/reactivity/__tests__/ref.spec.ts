import { isObject } from "../../shared"
import { effect } from "../effect"
import { reactive } from "../reactive"
import { isRef, ref, unref } from "../ref"

describe("ref", () => {
  it("ref return a object that have property of value", () => {
    // ref 需要返回一个对象并且属性value作为传入的值
    const a = ref(1)
    expect(isObject(a)).toBe(true)
    expect(a.value === 1).toBe(true)
  })

  it("should be reactive", () => {
    /**
     * 1. ref 是响应式的
     * 2. ref对传入的值没有类型要求，可以使引用值（数组、对象）,可以使原始值
     * 3、传值的响应式值位原始值时，需要利用对象的getter和setter来对值进行收集依赖和触发依赖
     */
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

  it("should make nested properties reactive", () => {
    /**
     * nested properties reactive
     */
    const a = ref({
      count: 1,
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it("isRef", () => {
    const a = ref(1)
    const user = reactive({
      age: 1,
    })
    expect(isRef(a)).toBe(true)
    expect(isRef(user)).toBe(false)
    expect(isRef(1)).toBe(false)
  })

  it("unRef", () => {
    // 如果参数是 ref，则返回内部值，否则返回参数本身。
    // 这是 val = isRef(val) ? val.value : val 计算的一个语法糖。
    const a = ref(1)
    expect(unref(a)).toBe(1)
    expect(unref(1)).toBe(1)
  })
})

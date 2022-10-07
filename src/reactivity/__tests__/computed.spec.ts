import { computed } from "../computed"
import { reactive } from "../reactive"

describe("computed", () => {
  it("happly path", () => {
    // 1、响应式 收集依赖、触发依赖
    // 2、有缓存
    // 3、返回.value属性
    const value = reactive({
      foo: 1,
    })

    const getter = computed(() => {
      return value.foo
    })

    expect(getter.value).toBe(1)
  })

  it("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    })
    const getter = jest.fn(() => {
      // 收集依赖
      return value.foo
    })
    const cValue = computed(getter)
    // lazy
    expect(getter).not.toHaveBeenCalled()
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // 当再次访问cValue getter时，不在重新计算getter
    // 而是直接读取缓存
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    // 当设置响应式的值时，触发trigger
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(2)

    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})

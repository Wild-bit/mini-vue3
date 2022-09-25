import { isReactive, isReadOnly, shallowReadonly } from "../reactive"

describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    // 外层是个响应式对象，内层n是个普通对象
    const props = shallowReadonly({ n: { foo: 1 } })
    const spy = jest.spyOn(console, "warn")
    props.n = { foo: 2 }
    expect(spy).toHaveBeenCalled()
    expect(isReadOnly(props)).toBe(true)
    expect(isReadOnly(props.n)).toBe(false)
  })
  //   test("should differentiate from normal readonly calls", async () => {
  //     const original = { foo: {} };
  //     const shallowProxy = shallowReadonly(original);
  //     const reactiveProxy = readonly(original);
  //     expect(shallowProxy).not.toBe(reactiveProxy);
  //     expect(isReadOnly(shallowProxy.foo)).toBe(false);
  //     expect(isReadonly(reactiveProxy.foo)).toBe(true);
  //   });
})

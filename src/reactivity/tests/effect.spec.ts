import { effect } from "../effect"
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
})

import { h } from "../../lib/guide-mini-vue.esm.js"

export default {
  name: "App",
  render() {
    return h(
      "div",
      { id: "root", class: ["red"] },
      // 访问setup里定义的属性 通过代理
      "hi, " + this.msg
      //  [
      //   h("p", { class: "red" }, "hi"),
      //   h("p", { class: "blue" }, "mini-vue"),
      // ]
    )
  },
  setup() {
    return {
      msg: "mini-vue",
    }
  },
}

import { h } from "../lib/guide-mini-vue.esm.js"

export default {
  name: "App",
  render() {
    return h("div", { id: "root", class: ["red"] }, [
      h("p", { class: "red" }, "hi"),
      h("p", { class: "blue" }, "mini-vue"),
    ])
  },
  setup() {
    return {
      msg: "mini-vue",
    }
  },
}

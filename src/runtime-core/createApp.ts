import { reader } from "./renderer"
import { createVNode } from "./vnode"

export function createApp(rootComponent) {
  const app = {
    mount(rootContainer) {
      // 先将根容器转为vnode
      // component -> vnode
      const vnode = createVNode(rootComponent)
      reader(vnode, rootContainer)
    },
  }
  return app
}

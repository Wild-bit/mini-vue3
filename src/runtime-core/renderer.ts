import { createComponentInstance, setupComponent } from "./component"

export function reader(vnode, container) {
  // path
  path(vnode, container)
}
function path(vnode, container) {
  // 处理组件
  processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(
  instance: { vnode: any; type: any; render?: any },
  container
) {
  const subTree = instance.render()
  // vnode -> path
  // vnode -> element -> mountElement
  path(subTree, container)
}

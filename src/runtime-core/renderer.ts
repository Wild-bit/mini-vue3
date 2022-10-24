import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // path
  path(vnode, container)
}
function path(vnode, container) {
  // 处理组件
  // TODO 判断vnode的类型是不是ele
  // 是走处理ele的逻辑
  // 不是则走处理组件的逻辑
  // 如何区分vnode的类型? component类型的vnode是一个Object ele类型是一个string
  if (typeof vnode.type === "string") {
    processElement(vnode, container)
  } else if (isObject(vnode)) {
    processComponent(vnode, container)
  }
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.type)
  const { props, children } = vnode
  if (typeof children === "string") {
    el.textContent = children
  } else if (Array.isArray(children)) {
    children.forEach((v) => {
      path(v, el)
    })
  }
  // props
  for (const key in props) {
    el.setAttribute(key, props[key])
    // hostPatchProp(el, key, props[key])
  }
  container.append(el)
}

// function hostPatchProp(container, key, val) {
//   if (isObject(val)) {
//     for (const key in val) {
//       container.setAttribute(key, val)
//     }
//   } else {
//     container.setAttribute(key, val)
//   }
// }

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

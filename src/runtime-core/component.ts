import { isObject } from "../shared/index"

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  }
  return component
}

export function setupComponent(instance) {
  // TODO
  // 初始化Props
  // 初始化slots
  setupStatefulComponent(instance)
}
function setupStatefulComponent(instance) {
  const Component = instance.type
  const { setup } = Component
  if (setup) {
    // Return Object or Return Function
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance, setupResult: any) {
  // handle Return Object
  if (isObject(setupResult)) {
    instance.setupState = setupResult
  }
  // 保证 render是有值的
  finishComponentSetup(instance)
}
function finishComponentSetup(instance) {
  //  给 instance 设置 render

  // 先取到用户设置的 component options
  const Component = instance.type
  if (instance.render) {
    instance.reader = Component.render
  }
}

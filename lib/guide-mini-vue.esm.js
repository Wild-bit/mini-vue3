function isObject(val) {
    return val !== null && typeof val === "object";
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // 初始化Props
    // 初始化slots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    instance.proxy = new Proxy({}, {
        get(target, key) {
            // setupResult
            const { setupState } = instance;
            if (key in setupState) {
                return setupState[key];
            }
        },
    });
    const { setup } = Component;
    if (setup) {
        // Return Object or Return Function
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // handle Return Object
    if (isObject(setupResult)) {
        instance.setupState = setupResult;
    }
    // 保证 render是有值的
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    //  给 instance 设置 render
    // 先取到用户设置的 component options
    const Component = instance.type;
    // if (instance.render) {
    instance.render = Component.render;
    // }
}

function render(vnode, container) {
    // path
    path(vnode, container);
}
function path(vnode, container) {
    // 处理组件
    // TODO 判断vnode的类型是不是ele
    // 是走处理ele的逻辑
    // 不是则走处理组件的逻辑
    // 如何区分vnode的类型? component类型的vnode是一个Object ele类型是一个string
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountElement(vnode, container) {
    const el = document.createElement(vnode.type);
    const { props, children } = vnode;
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        children.forEach((v) => {
            path(v, el);
        });
    }
    // props
    for (const key in props) {
        el.setAttribute(key, props[key]);
        // hostPatchProp(el, key, props[key])
    }
    container.append(el);
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
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode -> path
    // vnode -> element -> mountElement
    path(subTree, container);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function createApp(rootComponent) {
    const app = {
        mount(rootContainer) {
            // 先将根容器转为vnode
            // component -> vnode
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
    return app;
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };

'use strict';

function isObject(val) {
    return val !== null && typeof val === "object";
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
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
    if (instance.render) {
        instance.reader = Component.render;
    }
}

function render(vnode, container) {
    // path
    path(vnode);
}
function path(vnode, container) {
    // 处理组件
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> path
    // vnode -> element -> mountElement
    path(subTree);
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
            render(vnode);
        },
    };
    return app;
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;

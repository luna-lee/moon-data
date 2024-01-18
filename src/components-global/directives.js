import { addResizeListener, removeResizeListener } from './libs/resize-event.js';

/**
 * dom元素尺寸监听指令。
 * 响应函数接受当前元素el，和可视状态。(el,visiable)
 *  */
export const resize = {
    // 指令的名称
    bind(el, binding) {
        if (binding.value && el) {
            el.__resize__listener__ = (visiable = true) => {
                binding.value(el, visiable);
            };
            addResizeListener(el, el.__resize__listener__);
        }
    },
    unbind(el) {
        if (el && el.__resize__listener__) {
            el.__resize__listener__(false);
            removeResizeListener(el, el.__resize__listener__);
        }
    }
};

/**
 * @author lip
 * @description Element 组件重写
 */
import service from './service';
import directive from './directive';
import Vue from 'vue';
// 当前存在的loading的Target，当有同一个页面有多个loading时，且target相同，则只展示一个
let loadingTargetMap = [];
//修改当页面过长时，加载的时候loading图标超出页面，或显示在底部，而影响美观
//注意，必须指定target，不然默认为body。当body的可视区域变化（按F12）会造成遮罩层问题
const defaultOptions = {
    target: '.main-content', //默认是main-content
    // body: true, //设置true时 作用于body上，新开的页面上也会有
    fullscreen: false,
    text: '加载中……',
    // spinner: "el-icon-loading",
    // background: "rgba(0,0, 0, 0.7)"
    background: 'rgba(250,250, 250, 0.7)'
};
// 关闭指定target上的loading
export const closeLoading = function (target = defaultOptions.target) {
    const loading = loadingTargetMap.find((v) => v.target == target)?.loading;
    loading && loading.close();
    loadingTargetMap = loadingTargetMap.filter((v) => v.target != target);
};
// 开启一个loading，同时返回一个关闭函数, 同一个target，只开启一个loading且返回一个相同的关闭函数
export const openLoading = function (options = {}) {
    let opt = { ...defaultOptions, ...options };
    // 没有target取body
    let target = opt.target || 'body';
    if (!loadingTargetMap.some((v) => v.target == target)) {
        let loading = service(opt);
        loadingTargetMap.push({ target, loading });
    }
    return function () {
        closeLoading(target);
    };
};
//绑定到Vue上 通过this.$引用,返回一个关闭函数
Vue.prototype.$openLoading = function (options = {}) {
    let destoryLoading = openLoading(options);
    //当所在的实体被销毁或不活动且时，close
    this.$on('hook:deactivated', destoryLoading);
    this.$once('hook:beforeDestroy', destoryLoading);
    return destoryLoading;
};
//绑定到Vue上 通过this.$引用,
Vue.prototype.$closeLoading = function (target = defaultOptions.target) {
    closeLoading(target);
};
Vue.use(
    directive({
        text: '',
        // spinner: "el-icon-loading",
        background: 'rgba(250,250, 250, 0.7)'
    })
);
Vue.prototype.$loading = service;

import Vue from 'vue';
import App from '@/App';
import router from '@/router'; // api: https://github.com/vuejs/vue-router
import store from '@/store'; // api: https://github.com/vuejs/vuex
import '@/plugins/index.js';
import 'animate.css';
Vue.config.productionTip = false;
new Vue({
    el: '#app',
    data: {},
    router,
    store,
    template: '<App/>',
    components: { App }
});

Vue.config.warnHandler = function (msg, vm, trace) {
    // `trace` 是组件的继承关系追踪
    console.warn('warnHandler msg: %o, vm: %o, trace: %o', msg, vm, trace);
};

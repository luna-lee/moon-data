/**
 * 全站路由配置
 * show_slider和full_screen不要搞混了，前者是在框架内显示，并且边框存在，后者是边框不存在
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue';
import Router from 'vue-router';

const originalPush = Router.prototype.push;
// 修改 原型对象中的push方法,
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};
Vue.use(Router);

const router = new Router({
    mode: 'hash',
    scrollBehavior: () => ({ y: 0 }),
    isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
    routes: [
        {
            path: '/moon-datav/preivew',
            name: 'preivew',
            component: () => import('@/views/moon-datav/preview/index.vue'),
            props: (route) => ({ projectId: route.query.id })
        },
        {
            path: '/moon-datav/create-view',
            name: 'create-view',
            component: () => import('@/views/moon-datav/create-view/index.vue'),
            props: (route) => ({ projectId: route.query.id })
        },
        {
            path: '/moon-datav/home/index',
            name: 'moon-datav',
            component: () => import('@/views/moon-datav/home/index.vue')
        },
        {
            path: '/md-view/:name',
            name: 'md-view',
            component: () => import('@/views/md-view.vue'),
            props: (route) => ({ name: route.params.name })
        },
        {
            path: '/doc-create/:id',
            name: 'doc-create',
            component: () => import('@/views/doc-create.vue'),
            props: (route) => ({ projectId: route.params.id })
        },

        {
            path: '/',
            name: 'login',
            component: () => import('@/views/login.vue')
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/test.vue')
        }
    ]
});

export default router;

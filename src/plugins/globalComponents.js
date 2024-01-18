import Vue from 'vue';

// 将components-global文件加中的组件，注册成全局组件
let files = require.context('@/components-global', true, /index.vue/);
files.keys().map((key) => {
    let vNode = files(key).default;
    let name = vNode.name;
    Vue.component(name, vNode);
});

let moonDatavFiles = require.context('@/views/moon-datav/components', true, /index.vue/);
moonDatavFiles.keys().map((key) => {
    let vNode = moonDatavFiles(key).default;
    let name = vNode.name;
    Vue.component(name, vNode);
});

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

VueMarkdownEditor.use(vuepressTheme);
Vue.use(VueMarkdownEditor);

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
    Hljs: hljs
});

Vue.use(VMdPreview);

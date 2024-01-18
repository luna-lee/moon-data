const files = require.context('./', false, /\.js/);
files.keys().map((item) => {
    if (!item.includes('index')) return files(item);
});

import './element-ui'; // api: https://github.com/ElemeFE/element
import './data-view';
import '@/assets/scss/index.scss';

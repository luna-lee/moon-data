const files = require.context('./', true, /\.js/);
export default files
    .keys()
    .filter((v) => !v.includes('index.js'))
    .map((item) => {
        let obj = files(item).default;
        if (!obj.attrs) obj.attrs = {};
        obj.stencilImg = `/static/img/${item.match(/[^/]+(?=\.js)/g)[0]}.png`;
        return obj;
    });

const files = require.context('./', true, /\.js/);
export default files
    .keys()
    .filter((v) => !v.includes('index.js'))
    .map((item) => {
        let obj = files(item).default;
        return obj;
    });

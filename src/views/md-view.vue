<template>
    <el-scrollbar style="height: 100vh; width: 100vw">
        <v-md-preview :text="text"></v-md-preview>
    </el-scrollbar>
</template>
<script>
let moonComponentFiles = require.context('@/components-global', true, /.md$/);
let moonDatavFiles = require.context('@/views/moon-datav/components', true, /.md$/);
function getMdObj(files) {
    return files.keys().reduce((obj, item) => {
        let pathList = item.match(/(?<=(\.\/)).*(?=(\.md))/)[0].split('/');
        if (pathList.length > 1) {
            //若文件名为readme则 取前一个路径名
            if (/readme/gi.test(pathList[pathList.length - 1])) {
                obj[pathList[pathList.length - 2]] = files(item).default;
            } else obj[pathList[pathList.length - 1]] = files(item).default;
        } else {
            if (!/readme/gi.test(pathList[0])) {
                obj['moon-' + pathList[0]] = files(item).default;
            }
        }
        return obj;
    }, {});
}
const mdFileContent = { ...getMdObj(moonDatavFiles), ...getMdObj(moonComponentFiles) };
import { getProjectById } from '@/service/index.js';

export default {
    inheritAttrs: false,
    name: '',
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    components: {},
    created() {},
    mounted() {},
    data() {
        return {
            text: ''
        };
    },
    watch: {
        name: {
            async handler() {
                if (this.name) {
                    this.text = await this.getMdText();
                }
            },
            immediate: true
        }
    },
    computed: {},
    methods: {
        async getMdText() {
            // element 组件跳转到对应的文档
            if (this.name.startsWith('el-')) {
                window.open(`https://element.eleme.cn/#/zh-CN/component/${this.name.split('-')[1]}`, '_self');
            } else if (this.name.startsWith('dv-')) {
                let arr = this.name.split('-');
                let name = arr.reduce((str, v, i) => {
                    if (i > 0) {
                        if (i == 1) str = str + v;
                        else {
                            if (i != arr.length - 1) {
                                const characters = [...v];
                                characters[0] = characters[0].toUpperCase();
                                str = str + characters.join('');
                            }
                            //末尾不能为数字,若为数字，则后面拼接整个名称
                            if (i == arr.length - 1) {
                                if (isNaN(v)) {
                                    const characters = [...v];
                                    characters[0] = characters[0].toUpperCase();
                                    str = str + characters.join('') + '.html';
                                } else str = str + '.html#' + this.name;
                            }
                        }
                    }
                    return str;
                }, '');
                window.open(`http://datav.jiaminghi.com/guide/${name}`, '_self');
            } else if (!this.name.startsWith('moon-')) {
                window.open(`https://www.runoob.com/tags/tag-${this.name}.html`, '_self');
            } else if (this.name.startsWith('moon-dv-id-')) {
                const { data: project } = await getProjectById({ id: this.name.replace('moon-dv-id-', '') });
                if (project) {
                    let mddoc = (project.mddoc || '').trim();
                    if (mddoc.startsWith('http://') || mddoc.startsWith('https://')) {
                        window.open(mddoc, '_self');
                        return '';
                    }
                    return mddoc;
                }
            }
            return mdFileContent[this.name];
        }
    }
};
</script>
<style lang="scss" scoped>
::v-deep(.el-scrollbar__wrap) {
    overflow: auto;
}
</style>

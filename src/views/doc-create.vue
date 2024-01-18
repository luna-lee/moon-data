<template>
    <div>
        <div class="title">{{ project.name }}文档</div>
        <v-md-editor v-model="project.mddoc" height="90vh" @save="onSave"></v-md-editor>
    </div>
</template>
<script>
import { getProjectById, addOrUpdateProject, getCellsByWorkSpaceId } from '@/service/index.js';

export default {
    inheritAttrs: false,
    name: '',
    props: {
        projectId: {
            type: String,
            default: ''
        }
    },
    components: {},
    created() {},
    mounted() {},
    data() {
        return {
            project: {
                title: '',
                mddoc: ''
            }
        };
    },
    watch: {
        projectId: {
            handler() {
                if (this.projectId) {
                    this.init();
                }
            },
            immediate: true
        }
    },
    computed: {},
    methods: {
        async init() {
            const { data: project } = await getProjectById({ id: this.projectId });
            if (project) {
                this.project = project;
                if (!this.project?.mddoc?.trim()) {
                    console.log(project.mainWorkspaceId);
                    let {
                        data: { cellList }
                    } = await getCellsByWorkSpaceId({ id: project.mainWorkspaceId });
                    let pageCell = cellList.find((v) => (v = v.cellId == this.projectId));
                    let cellConfig = JSON.parse(pageCell.jsonStr);
                    let globalVar = cellConfig.data.globalVar;
                    let propsConfigStr = Object.keys(globalVar).reduce((str, key) => {
                        let line = `|${key.replace('globalVar_', '')}|-|-|-|${JSON.stringify(globalVar[key])}| \n`;

                        return str + line;
                    }, '');
                    if (!propsConfigStr) propsConfigStr = '|……|……|……|……|……|';
                    this.project.mddoc = `
# ${project.name}
- #### 组件说明作用

- #### 作者……

<br/>

### Props
|名称|说明|类型|可选值|默认值|
|-|-|-|-|-|
${propsConfigStr}

<br/>

### Slots
|名称|说明|
|-|-|
|……|……|


<br/>

### Events
|事件名称|说明|回调参数|
|-|-|-|
|……|……|……|

### Methods
|方法名|说明|参数|
|-|-|-|
|……|……|……|

                `;
                }
            }
        },
        async onSave() {
            await addOrUpdateProject(this.project);
            this.$message.success('保存成功!');
        },
        setHotKey() {
            const saveResult = this.onSave;
            document.onkeydown = (e) => {
                e = window.event || e;
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    setTimeout(() => {
                        saveResult();
                    }, 1);
                    // 阻止默认事件
                    e.preventDefault();
                }
            };
            this.$once('hook:beforeDestroy', () => {
                document.onkeydown = null;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.title {
    text-align: center;
    font-size: 1.5rem;
    padding: 10px;
}
</style>

<template>
    <div class="common">
        <el-collapse :value="Array.from({ length: workspaceList.length }, (value, key) => key + 1)">
            <el-collapse-item v-for="(value, index) in workspaceList" :key="value.id" :title="value.name" :name="index + 1">
                <code-monaco-editor
                    :value="subWorkspaceShowHidden[value.id]"
                    @input="setsubWorkspaceShowHidden($event, value.id)"
                    style="height: 70px"
                ></code-monaco-editor>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import { updateCellDataView, equalsString, willChangeGlabalVar } from '@/views/moon-datav/utils';
import CodeMonacoEditor from './_c/code-monaco-editor.vue';

export default {
    inheritAttrs: false,
    name: '',
    inject: ['getTransformPlugin', 'getWorkspace', 'getWorkspaceList', 'pageCellId'],
    props: ['cell', 'graph'],
    components: { CodeMonacoEditor },
    created() {},
    mounted() {},
    data() {
        return {
            subWorkspaceShowHidden: {}
        };
    },
    watch: {
        workspaceList: {
            handler() {
                this.subWorkspaceShowHidden = this.cell.getData().subWorkspaceShowHidden;
                this.workspaceList.forEach((w) => {
                    this.subWorkspaceShowHidden[w.id] = this.subWorkspaceShowHidden[w.id] || `()=>{return true}`;
                });
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        workspaceList() {
            return this.getWorkspaceList().filter((w) => w.id != w.mainWorkspaceId);
        }
    },
    methods: {
        setsubWorkspaceShowHidden(e, id) {
            if (equalsString(e, this.subWorkspaceShowHidden[id])) return;
            this.subWorkspaceShowHidden[id] = e ? e : '()=>{return true}';
            let funText = this.subWorkspaceShowHidden[id];
            // 禁止在函数中改变自定义全局变量值
            if (willChangeGlabalVar(this.graph, funText, this.pageCellId)) {
                this.$message.error('禁止在函数中修改自定义全局变量值！');
                const cellData = this.cell.getData();
                this.subWorkspaceShowHidden[id] = cellData.subWorkspaceShowHidden[id] || '()=>{return true}';
                flag = false;
            } else {
                const data = this.cell.getData();
                if (!data.subWorkspaceShowHidden) data.subWorkspaceShowHidden = {};
                data.subWorkspaceShowHidden[id] = funText;
                updateCellDataView(this.cell, data);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.workspace {
}
</style>

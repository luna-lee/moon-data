<template>
    <div class="listener">
        <el-tabs type="border-card" v-model="tabDataItem">
            <el-tab-pane label="响应事件">
                <code-monaco-editor
                    :value="listenerFunctionText"
                    @input="changelistenerFunctionText"
                    style="height: 80vh"
                ></code-monaco-editor>
            </el-tab-pane>
            <el-tab-pane label="全局变量">
                <globalVarTable />
            </el-tab-pane>
            <el-tab-pane label="自定义全局变量">
                <globalVarCustomTable :data="globalVarArrs"></globalVarCustomTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { updateCellDataView, equalsString } from '@/views/moon-datav/utils';
import globalVarCustomTable from './_c/globalVarCustomTable.vue';
import globalVarTable from './_c/globalVarTable.vue';
import CodeMonacoEditor from './_c/code-monaco-editor.vue';

export default {
    inheritAttrs: false,
    name: '',
    inject: ['pageCellId'],
    props: ['cell', 'graph'],
    components: { globalVarCustomTable, globalVarTable, CodeMonacoEditor },
    created() {},
    mounted() {
        const cellData = this.cell.getData();
        this.listenerFunctionText = cellData?.attrs?.listenerFunctionText || this.$options.data().listenerFunctionText;
        const pageCell = this.graph.getCellById(this.pageCellId).getData();
        const globalVarObj = pageCell.globalVar || {};
        this.globalVar = JSON.stringify(globalVarObj);
        this.globalVarArrs = Object.keys(globalVarObj).map((key) => {
            return {
                name: key,
                value: typeof globalVarObj[key] == 'function' ? globalVarObj[key].toString() : JSON.stringify(globalVarObj[key])
            };
        });
    },
    data() {
        return {
            tabDataItem: '0',
            globalVar: '{}',
            globalVarArrs: [],
            listenerFunctionText: `()=>{ return { click:()=>{} }  }`
        };
    },
    watch: {},
    computed: {},
    methods: {
        changelistenerFunctionText(e) {
            if (equalsString(this.listenerFunctionText, e)) return;
            this.listenerFunctionText = e ? e : this.$options.data().listenerFunctionText;
            const data = this.cell.getData();
            if (data.attrs) data.attrs.listenerFunctionText = this.listenerFunctionText;
            else
                data.attrs = {
                    listenerFunctionText: this.listenerFunctionText
                };
            updateCellDataView(this.cell, data);
        }
    }
};
</script>
<style lang="scss" scoped></style>

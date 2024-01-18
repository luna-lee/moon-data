<template>
    <div class="globalvar">
        <moon-table-pagination
            :border="false"
            :data="data"
            style="width: 100%"
            :header-cell-style="{ backgroundColor: '#2e343c', border: 'none', padding: '2px 0' }"
            :cell-style="{ background: '#000', border: 'none', color: '#fff' }"
        >
            <el-table-column prop="name" label="变量名" header-align="center"> </el-table-column>
            <el-table-column prop="value" label="默认值" align="center" width="100"> </el-table-column>
            <el-table-column align="center" width="50">
                <template slot-scope="scope">
                    <i class="el-icon-search" style="cursor: pointer" @click="onClick(scope.row.value)" />
                </template>
            </el-table-column>
        </moon-table-pagination>
         <moon-dialog class="project-dialog" width="500px" :visible.sync="visible" append-to-body>
            <code-monaco-editor :value="code" style="height: 400px" readOnly></code-monaco-editor>
        </moon-dialog>
    </div>
</template>

<script>
import CodeMonacoEditor from './code-monaco-editor.vue';
export default {
    inheritAttrs: false,
    name: '',
    props: ['data'],
    components: { CodeMonacoEditor },
    created() {},
    mounted() {},
    data() {
        return { visible: false, code: '' };
    },
    watch: {},
    computed: {},
    methods: {
        onClick(code) {
            this.visible = true;
            this.code = code;
        }
    }
};
</script>
<style lang="scss" scoped>
::v-deep(.el-table) {
    background-color: #000;
    &::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
    }
}
.globalvar {
    ::v-deep(.el-table__body-wrapper) {
        /*滚动条样式*/
        &::-webkit-scrollbar {
            width: 5px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(0, 0, 0, 0.2);
        }
        &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 0;
            background: rgba(0, 0, 0, 0.1);
        }
    }
    ::v-deep(.el-table__header) {
        /*滚动条样式*/
        .gutter {
            background-color: #2e343c;
        }
    }
}
</style>

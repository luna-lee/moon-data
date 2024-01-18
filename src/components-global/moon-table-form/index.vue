<template>
    <div class="moon-table-form">
        <moon-table-pagination
            :key="componentKey"
            ref="tablePagination"
            v-bind="$attrs"
            :pagination="false"
            :span-method="spanMethod"
            :cell-style="setCellStyle"
            :cell-class-name="setCelClassName"
            :data="tableData"
            :show-overflow-tooltip="false"
            :border="false"
            style="width: 100%"
            :show-header="false"
        >
            <slot :tableColumn="tableColumn"></slot>
        </moon-table-pagination>
    </div>
</template>
<script>
import { createTableFormData, fillEmptyTr, setBorder } from './tableFormTool';
import { isType, getUUID } from '../utils';
export default {
    inheritAttrs: false,
    name: 'MoonTableForm',
    props: {
        constructData: {
            type: Array,
            required: true,
            default: () => []
        },
        columnNum: {
            type: [Number, String],
            default: 6
        },
        options: {
            type: Object,
            default: () => ({
                rowspan: 'rowspan',
                colspan: 'colspan'
            })
        },
        labelFun: {
            type: Function,
            default: () => {
                return (value) => {
                    return { text: value };
                };
            }
        },
        valueFun: {
            type: Function,
            default: () => {
                return (value) => {
                    return { text: value };
                };
            }
        },
        labelCellStyle: {
            type: Object,
            default: () => ({})
        },
        valueCellStyle: {
            type: Object,
            default: () => ({})
        },
        border: {
            type: String,
            default: '1px solid #ebeef5'
        },
        borderInner: {
            type: String,
            default: '1px solid #ebeef5'
        },
        cellStyle: {
            type: [Function, Object],
            default: () => ({})
        },
        cellClassName: {
            type: [Function, String],
            default: ''
        }
    },
    components: {},
    created() {},
    mounted() {
        this.$watch(
            function () {
                return { constructData: this.constructData, columnNum: this.columnNum };
            },
            function () {
                if (!this.constructData.length) return;
                let { tableData, tableColumn } = createTableFormData({
                    constructData: this.constructData,
                    columnNum: this.columnNum > 20 ? 20 : this.columnNum,
                    options: { rowspan: 'spanRow', colspan: 'spanCol', ...this.options },
                    labelFun: this.labelFun,
                    valueFun: this.valueFun
                });
                this.tableData = tableData;
                this.tableColumn = tableColumn;
                this.componentKey = getUUID();
                this.$nextTick(() => {
                    fillEmptyTr(this.$refs.tablePagination.$el);
                    setBorder(this.$refs.tablePagination.$el, this.border, this.borderInner, this.columnNum);
                });
            },
            {
                deep: true,
                immediate: true
            }
        );
        this.$watch(
            function () {
                return [this.border, this.borderInner];
            },
            function () {
                setBorder(this.$refs.tablePagination.$el, this.border, this.borderInner);
            },
            {
                deep: true
            }
        );
    },
    data() {
        return {
            tableColumn: [],
            tableData: [],
            componentKey: getUUID()
        };
    },
    watch: {},
    computed: {},
    methods: {
        setCellStyle(arg) {
            let { row, columnIndex } = arg;
            let extraStyle = {};
            if (isType(this.cellStyle, 'Function')) {
                extraStyle = this.cellStyle(arg) || {};
            }
            if (isType(this.cellStyle, 'Object')) {
                extraStyle = this.cellStyle;
            }
            if (row[`column0${columnIndex + 1}`].isLabel) extraStyle = { ...extraStyle, ...this.labelCellStyle };
            if (row[`column0${columnIndex + 1}`].isValue) extraStyle = { ...extraStyle, ...this.valueCellStyle };
            return {
                ...extraStyle,
                display: row[`column0${columnIndex + 1}`].hidden ? 'none' : ''
            };
        },
        setCelClassName(arg) {
            let { row, columnIndex } = arg;
            let className = '';
            if (row[`column0${columnIndex + 1}`].isLabel) className += ' labelCelClassName ';
            if (row[`column0${columnIndex + 1}`].isValue) className += ' valueCelClassName ';
            if (isType(this.cellClassName, 'Function')) {
                className += this.cellClassName(arg) || '';
            }
            if (isType(this.cellClassName, 'String')) {
                className += this.cellClassName;
            }
            return className;
        },
        spanMethod({ row, columnIndex }) {
            let { rowspan, colspan } = row[`column0${columnIndex + 1}`] || { rowspan: 1, colspan: 1 };
            return {
                rowspan,
                colspan
            };
        }
    }
};
</script>
<style lang="scss" scoped>
.moon-table-form {
    width: 100%;
}
// 清除hover样式
.moon-table-form ::v-deep .el-table__body tr:hover > td.el-table__cell.labelCelClassName {
    background-color: none !important;
}
.moon-table-form ::v-deep .el-table__body tr:hover > td.el-table__cell:not(.labelCelClassName) {
    background-color: inherit !important;
}
// 继承/取消滚动样式
.moon-table-form ::v-deep .el-table__body tr .cell {
    overflow: unset;
}
</style>

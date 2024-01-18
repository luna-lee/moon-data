<template>
    <div style="width: 100%">
        <!-- 制定统一的项目风格，不需要在组件中修改样式 -->
        <div class="pagination top" v-if="pagination && paginationPosition.includes('top')" :style="paginationStyle">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="inner_condition.page"
                :page-sizes="pageSize"
                :page-size="inner_condition.limit"
                :layout="layout"
                :total="total"
                :prev-text="prevText"
                hide-on-single-page
                :next-text="nextText"
            ></el-pagination>
        </div>
        <div :id="tablePaginationId">
            <div class="top-button-group">
                <div class="btn-group-item">
                    <el-button v-if="topButtonList.includes('add')" type="primary" @click="handleAdd">
                        <slot name="btn-add-text">
                            <i class="el-icon-circle-plus-outline"></i>
                            新增
                        </slot>
                    </el-button>
                    <el-button v-if="topButtonList.includes('delete')" @click="handleRemove" :disabled="!tableSelected.length">
                        <slot name="btn-delete-text">
                            <i class="el-icon-delete"></i>
                            删除
                        </slot>
                    </el-button>
                    <slot name="btn-left" :total="total"></slot>
                </div>
                <div class="btn-group-item">
                    <slot name="btn-right" :total="total"></slot>
                    <el-button v-if="topButtonList.includes('import')" @click="handleImport">
                        <slot name="btn-import-text"> 导入数据 </slot>
                    </el-button>
                    <el-button v-if="topButtonList.includes('export')" @click="handleExport">
                        <slot name="btn-export-text">
                            <i class="el-icon-download"></i>
                            导出数据
                        </slot>
                    </el-button>
                </div>
            </div>
            <el-table
                v-if="$slots.default"
                style="margin-top: 10px"
                ref="table"
                :style="{ width: tableWidth }"
                v-bind="tableProps"
                v-on="$listeners"
                v-loading="onloading"
                @selection-change="handleSelectionChange"
            >
                <template v-if="draggable">
                    <slot name="drag-left"></slot>
                    <el-table-column type="index" label="序号" width="80" align="center" fixed="left">
                        <template slot-scope="scope">
                            <orderInput :value="scope.$index + 1" @change="getOrderNum(scope)"></orderInput>
                        </template>
                    </el-table-column>
                </template>
                <slot></slot>
            </el-table>
            <slot name="list" :listData="listData"></slot>
        </div>
        <!-- 制定统一的项目风格，不需要在组件中修改样式 -->
        <div class="pagination" v-if="pagination && paginationPosition.includes('bottom')" :style="paginationStyle">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="inner_condition.page"
                :page-sizes="pageSize"
                :page-size="inner_condition.limit"
                hide-on-single-page
                :layout="layout"
                :total="total"
                :prev-text="prevText"
                :next-text="nextText"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
import { isType, getUUID, flatToTree } from '../utils';
import Sortable from 'sortablejs';
import { debounce } from 'lodash';
export default {
    inheritAttrs: false,
    name: 'MoonTablePagination',
    props: {
        // 表格数据。若传如值，则视为纯表格组件。分页组件将禁用
        data: {
            type: Array,
            default: () => []
        },
        // 自定义每页展现数量
        pageSize: {
            type: Array,
            default: () => {
                return [10, 20, 50];
            }
        },
        //是否分页
        pagination: {
            type: Boolean,
            default: true
        },
        paginationPosition: {
            type: Array,
            default: () => ['bottom', 'center'] // bottom (left  center right) / top (left  center right)
        },
        //获取数据的接口, 可以是的Url, 或者http函数接口，
        dataInterface: {
            type: [String, Function],
            default: ''
        },
        //condition 数据接口参数
        condition: {
            type: Object,
            default: function () {
                return {};
            }
        },
        //数据返回格式,项目里要统一
        responseType: {
            type: Object,
            default: function () {
                return {
                    list: 'data.page.list',
                    totalCount: 'data.page.totalCount' //当不分页时可以不指定
                };
            }
        },
        tableWidth: { type: String, default: 'auto' },
        // 树数据结构字段 默认为 id ，parentId
        treeOptions: {
            type: Object,
            default: function () {
                return {
                    id: 'id',
                    parentId: 'parentId'
                };
            }
        },
        // 是否可以拖拽
        draggable: {
            type: Boolean,
            default: false
        },
        // 数据项接受排序的字段名
        orderAttrName: {
            type: String,
            default: 'orderNum'
        },
        // 拖拽属性,onEnd默认触发drag-end事件，不会被传入的属性覆盖。若要修改可以通过响应事件来处理
        sortableOptions: {
            type: Object,
            default: function () {
                return {};
            }
        },
        // el-pagination props属性
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next,jumper'
        },
        prevText: {
            type: String,
            default: '上一页'
        },
        nextText: {
            type: String,
            default: '下一页'
        },
        // 顶部按钮列表
        topButtonList: {
            type: Array,
            default: () => [] //['add','delete','import','export']
        },
        //外部控制表格显示loading
        loading: {
            type: Boolean,
            default: true
        }
    },
    components: {
        orderInput: {
            template: `<div>{{value}}</div>`,
            props: ['value'],
            watch: {
                value: {
                    handler(val) {
                        this.$emit('change', val);
                    },
                    immediate: true
                }
            }
        }
    },
    watch: {
        loading: {
            handler(val) {
                if (this.onloading != val) this.onloading = val;
            },
            immediate: true
        },
        onloading(val) {
            if (this.loading != val) this.$emit('update:loading', val);
        }
    },
    mounted() {
        this.$watch(
            function () {
                return [this.dataInterface, this.condition, this.data];
            },
            function () {
                // 当外部设置limit时，需要更新pageSize
                if (this.condition.limit && !this.pageSize.includes(this.condition.limit)) {
                    this.pageSize.unshift(this.condition.limit);
                }
                // 分页则加上page，limit。
                if (this.pagination) this.inner_condition = { ...this.inner_condition, page: 1, limit: 10, ...this.condition };
                else this.inner_condition = { ...this.inner_condition, ...this.condition };
                // 接口与外部传递，优先接口
                if (this.dataInterface) this.getDataList_Debounce();
                else {
                    this.listData = this.data;
                    this.listData.forEach((item) => {
                        // 添加唯一标识，注意改标识必须不在item中
                        if (!item['table-row-key']) item['table-row-key'] = getUUID();
                    });
                    // 若props中没有data或没有loading时 则将onloading设置为false
                    if (!Object.hasOwn(this.$options.propsData, 'data') || !Object.hasOwn(this.$options.propsData, 'loading')) this.onloading = false;
                }
            },
            {
                deep: true,
                immediate: true
            }
        );
        this.$watch(
            'draggable',
            function () {
                this.$nextTick(() => {
                    if (this.draggable) {
                        this.tableRowDrag();
                        // 得到父组件中是moon-validator的实例
                        if (!this.parentMoonValidator) {
                            const getParrentVnodeByClass = (vnode, className) => {
                                if (!vnode) return;
                                if (vnode?.$options?.name === 'MoonValidator') return vnode;
                                else {
                                    return getParrentVnodeByClass(vnode?.$parent, className);
                                }
                            };
                            this.parentMoonValidator = getParrentVnodeByClass(this, 'moon-validator');
                        }
                    }
                });
            },
            {
                deep: true,
                immediate: true
            }
        );
    },
    data() {
        this.treeStore = {};
        return {
            getDataList_Debounce: debounce(this.getDataList, 300),
            tablePaginationId: getUUID(),

            //接收后台传过来的数据
            listResource: [],
            /*
                将后台数据listResource，按特定的方式(树形数据：异步加载/整体渲染)格式化后得到的数据
                当数据层级多且大时建议使用异步，此处异步是在整体数据上做页面组件的异步渲染，不涉及到再次请求服务器
                开启方式和element 提供的文档一样，添加lazy属性即可
             */
            listData: [],
            onloading: true,
            total: 1,
            inner_condition: { page: 1, limit: 10 },
            tableSelected: []
        };
    },

    computed: {
        paginationStyle() {
            let type = 'center';
            if (this.paginationPosition[1]) {
                type = this.paginationPosition[1];
                if (type == 'left') type = 'flex-start';
                if (type == 'right') type = 'flex-end';
            }
            return {
                'justify-content': type
            };
        },
        tableProps() {
            let baseProps = {
                'empty-text': '暂无数据',
                'tooltip-effect': 'dark',
                'row-class-name': this.tableRowClassName,
                'show-overflow-tooltip': true,
                'row-key': 'table-row-key',
                'header-cell-style': {
                    background: '#E9F0FF',
                    color: '#333',
                    padding: '6px 0'
                },
                // 避免固定列透视，同时也能响应鼠标悬停颜色
                'cell-class-name': 'bgColor-white',
                load: this.load,
                border: true
            };
            return { ...baseProps, ...this.$attrs, data: this.listData };
        }
    },
    methods: {
        getOrderNum(scope) {
            if (scope.row[this.orderAttrName] != scope.$index + 1) {
                scope.row[this.orderAttrName] = scope.$index + 1;
            }
            this.$emit('order-change', scope);
        },
        //懒加载-点击后添加子节点，同时判断子节点是否有子节点
        load(row, treeNode, resolve) {
            let childrenList = this.treeStore.objById[row[this.treeOptions.id]].children.map((item) => ({ ...item, children: undefined }));
            resolve(childrenList);
        },
        //选中行后，行的class属性添加
        tableRowClassName({ row }) {
            if (row.isSelected) {
                return 'select-row';
            }
            return '';
        },
        async getDataList() {
            if (!this.dataInterface || this.data.length) return;
            this.onloading = true;
            this.listData = [];
            //判断data的类型
            let isUrl = isType(this.dataInterface, 'String');
            let isInterface = isType(this.dataInterface, 'Function');
            let res = {};
            if (isInterface) res = await this.dataInterface(this.inner_condition);
            if (isUrl)
                res = await this.$http.get(this.dataInterface, {
                    params: this.inner_condition
                });
            this.$emit('response', JSON.parse(JSON.stringify(res)));
            this.onloading = false;
            // 为每条数据添加唯一表示
            this.listResource = (this.responseData(res, this.responseType.list) || []).map((item) => {
                // 添加唯一标识，注意改标识必须不在item中
                if (!item['table-row-key']) item['table-row-key'] = getUUID();
                return item;
            });
            this.$emit('response-data', JSON.parse(JSON.stringify(this.listResource)));

            //数组元素中包含treeOptions指定的树形属性时视为树形结构视图
            let hasTreeStr = this.listResource.length ? Object.hasOwn(this.listResource[0], this.treeOptions.id) && Object.hasOwn(this.listResource[0], this.treeOptions.parentId) : false;
            if (hasTreeStr) {
                this.initTreeStore(this.listResource);
                if (Object.hasOwn(this.$attrs, 'lazy')) {
                    this.listData = this.treeStore.treeData.map((item) => ({ ...item, children: undefined }));
                } else {
                    this.listData = this.treeStore.treeData;
                }
            } else this.listData = [...this.listResource];
            if (this.pagination) this.total = this.responseData(res, this.responseType.totalCount) || 0;
            this.$emit('total', this.total);
            this.$emit('view-data', JSON.parse(JSON.stringify(this.listData)));
        },
        responseData(res, path) {
            let attrs = path.split('.');
            let data = attrs.reduce((arr, val) => {
                let list = arr ? arr[val] : null;
                return list;
            }, res);
            return data;
        },
        handleSizeChange(val) {
            this.inner_condition.limit = val;
            this.getDataList();
        },
        handleCurrentChange(val) {
            this.inner_condition.page = val;
            this.getDataList();
        },
        // 树数据仓库
        initTreeStore(list) {
            let { treeData, flatData, objById } = flatToTree(list, this.treeOptions.id, this.treeOptions.parentId);
            flatData.forEach((item) => {
                if (item.children.length) item.hasChildren = true;
            });
            this.treeStore = { treeData, flatData, objById };
        },
        getTableVnode() {
            return this.$refs.table;
        },
        tableRowDrag() {
            const tbody = document.querySelector(`#${this.tablePaginationId} tbody`);
            this.sortableDom(tbody);
            const tbodyFixed = document.querySelector(`#${this.tablePaginationId} .el-table__fixed-body-wrapper tbody`);
            this.sortableDom(tbodyFixed);
        },
        sortableDom(el) {
            if (!el) return;
            let _this = this;
            let funObj = {};
            // 为每个传入的函数加上当前列表数据参数
            Object.keys(this.sortableOptions).forEach((key) => {
                if (isType(this.sortableOptions[key], 'Function')) {
                    funObj[key] = function (...arg) {
                        _this.sortableOptions[key](...arg, _this.listData);
                    };
                }
            });
            Sortable.create(el, {
                ..._this.sortableOptions,
                ...funObj,
                async onEnd(evt) {
                    if (_this.sortableOptions.onEnd) await _this.sortableOptions.onEnd(evt, _this.listData);
                    else {
                        let { newIndex, oldIndex } = evt;
                        const currRow = _this.listData.splice(oldIndex, 1)[0];
                        _this.listData.splice(newIndex, 0, currRow);
                    }
                    // 若包含在moon-validatore中则刷新moon-validatore配置
                    if (_this.parentMoonValidator) _this.parentMoonValidator.reload();
                    _this.$emit('drag-end', _this.listData);
                }
            });
        },
        handleSelectionChange(e) {
            this.tableSelected = e;
            //选中的数据，父组件可以通过sync接收
            this.$emit('update:table-selected', e);
            //使组件也继承原有的方法
            this.$emit('selection-change', e);
        },
        handleAdd() {
            //新增按钮事件
            this.$emit('btn-add');
        },
        handleRemove() {
            // 删除按钮事件
            this.$emit('btn-delete', this.tableSelected);
        },
        handleExport() {
            // 导出按钮事件
            this.$emit('btn-export');
        },
        handleImport() {
            // 导出按钮事件
            this.$emit('btn-import');
        }
    }
};
</script>
<style lang="less" scoped>
.buttonGroup {
    display: flex;
    flex-direction: row;
}
.top-button-group {
    display: flex;
    justify-content: space-between;
    .btn-group-item {
        display: flex;
        align-items: center;
        & ::v-deep .el-button:nth-child(n + 2) {
            margin-left: 10px;
        }
    }
}
.pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    &.top {
        margin: 0;
        height: 35px;
    }
}

.el-table {
    ::v-deep(.select-row) {
        background: rgb(216, 232, 242);
    }

    ::v-deep(.el-button) {
        margin-left: 5px;

        &:first-child {
            margin-left: 0px;
        }
    }
    &::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
    }
    // 由于标题字体太长时，排序按钮显示在末尾；修改表头标题布局，适配用户所指定的具体对齐方式，
    ::v-deep(th.el-table__cell.is-left > .cell) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    ::v-deep(th.el-table__cell.is-center > .cell) {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ::v-deep(th.el-table__cell.is-right > .cell) {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    ::v-deep(.slot-header-flex) {
        display: flex;
        flex-direction: column;
        line-height: normal;
        align-items: center;
    }

    ::v-deep(.bgColor-white) {
        background-color: white;
    }
}
</style>

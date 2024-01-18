/**
 * @author lip
 * @description Element 组件重写
 */
import { Table, TableColumn } from 'element-ui';
//修复当v-show切换页面时造成表格按钮在flex布局下只显示一半的bug
// 新增watch 监听layoutScrollX的变化，
Table.watch.layoutScrollX = function (v) {
    //重写初始化layout
    this.doLayout();
};
//新增computed 属性 layoutScrollX，
Table.computed.layoutScrollX = function () {
    return this.layout.scrollX;
};
// ------------------------------------------------------------------------------------------------------------
/* 
 在tableColumn组件中Props上增加treeIcon showTreeIcon 两个属性，

 属性           参考值                                                                    说明

 treeIcon      { fold: 'el-icon-arrow-right',expand: "el-icon-arrow-down"}               用来自定义树表格的折叠展开图标。

showTreeIcon   true/false                                                                用来指定图标显示在具体哪一列上。不指定这默认第一个type为default的列

*/

import { cellStarts, cellForced, defaultRenderCell, treeCellPrefix } from './config';
import { mergeOptions, compose } from './tabUtil';
//在tableColumn组件中Props增加了treeIcon  ,用来设置展开折叠图标
TableColumn.props.treeIcon = {
    type: Object,
    default: function () {
        return {
            fold: 'el-icon-arrow-right',
            expand: 'el-icon-arrow-down'
        };
    }
};
//将showTreeIcon treeIcon 写入element 自带的store里
let columnIdSeed = 1;
TableColumn.created = function () {
    const parent = this.columnOrTableParent;
    this.isSubColumn = this.owner !== parent;
    this.columnId = (parent.tableId || parent.columnId) + '_column_' + columnIdSeed++;

    const type = this.type || 'default';
    const sortable = this.sortable === '' ? true : this.sortable;
    const defaults = {
        ...cellStarts[type],
        id: this.columnId,
        type: type,
        property: this.prop || this.property,
        align: this.realAlign,
        headerAlign: this.realHeaderAlign,
        // showOverflowTooltip 可以通过直接在table上加改属性来实现所有column属性
        showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow || parent.$attrs['show-overflow-tooltip'],
        // filter 相关属性
        filterable: this.filters || this.filterMethod,
        filteredValue: [],
        filterPlacement: '',
        isColumnGroup: false,
        filterOpened: false,
        // sort 相关属性
        sortable: sortable,
        // index 列
        index: this.index,
        treeIcon: this.treeIcon,
        showTreeIcon: this.showTreeIcon
    };

    const basicProps = ['columnKey', 'label', 'className', 'labelClassName', 'type', 'renderHeader', 'formatter', 'fixed', 'resizable'];
    const sortProps = ['sortMethod', 'sortBy', 'sortOrders'];
    const selectProps = ['selectable', 'reserveSelection'];
    const filterProps = ['filterMethod', 'filters', 'filterMultiple', 'filterOpened', 'filteredValue', 'filterPlacement'];

    let column = this.getPropsData(basicProps, sortProps, selectProps, filterProps);
    column = mergeOptions(defaults, column);

    // 注意 compose 中函数执行的顺序是从右到左
    const chains = compose(this.setColumnRenders, this.setColumnWidth, this.setColumnForcedProps);
    column = chains(column);

    this.columnConfig = column;

    // 注册 watcher
    this.registerNormalWatchers();
    this.registerComplexWatchers();
};
//在tableColumn组件中Props增加了showTreeIcon  ,用来设置展开折叠图标在那个具体的el-table-column上面。
TableColumn.props.showTreeIcon = {
    type: Boolean,
    default: false
};
Table.components.TableBody.computed.firstDefaultColumnIndex = function () {
    let index = -1;
    this.columns.some((v, i) => {
        if (v.showTreeIcon) {
            index = i;
            return true;
        } else return false;
    });
    if (index == -1) {
        //证明当前树表格 表列中没有指定具体图标显示的位置，则默认显示在type为default的第一个列下
        this.columns.some((v, i) => {
            if (v.type === 'default') {
                index = i;
                return true;
            } else return false;
        });
    }
    return index;
};
TableColumn.methods.setColumnRenders = function (column) {
    var _this2 = this;
    var h = this.$createElement;
    var specialTypes = Object.keys(cellForced);
    // renderHeader 属性不推荐使用。
    if (this.renderHeader) {
        console.warn('[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.');
    } else if (specialTypes.indexOf(column.type) === -1) {
        column.renderHeader = function (h, scope) {
            var renderHeader = _this2.$scopedSlots.header;
            return renderHeader ? renderHeader(scope) : column.label;
        };
    }
    var originRenderCell = column.renderCell;
    // 自定义 type 为expand 样式，  type=expand可以放在任何el-table-column元素上，且当值el-table-column上有prop时也会显示具体值，而且展开图标可以通过treeIcon来自定义
    //注意，因为template被具体展开内容所使用，故el-table-column只能通过prop来显示具体的值
    //width 默认48 需要在el-table-column手动指定响应的值
    //字体可以通过::v-deep .el-table__expand-column 来修改
    if (column.type === 'expand') {
        const type = column.type;
        const source = cellForced[type] || {};
        // 对于展开行，renderCell 不允许配置的。在上一步中已经设置过，这里需要简单封装一下。
        originRenderCell = originRenderCell || defaultRenderCell;
        column.renderCell = function (h, data) {
            var children = null;
            children = defaultRenderCell(h, data);
            let { store, row } = data;
            const callback = function (e) {
                e.stopPropagation();
                store.toggleRowExpansion(row);
            };
            //将store.toggleRowExpansion放入row中，以便能再展开内容中通脱scoped 调用收起
            data.row.toggleRowExpansion = store.toggleRowExpansion;
            return (
                <div class="cell el-tooltip " style="display:flex;" on-click={callback}>
                    <div> {source.renderCell(h, data, _this2.treeIcon)}</div>
                    <div style="margin-left:0.2rem; cursor: pointer;">{children}</div>
                </div>
            );
        };
        this.owner.renderExpanded = function (h, data) {
            return _this2.$scopedSlots.default ? _this2.$scopedSlots.default(data) : _this2.$slots.default;
        };
    } else {
        originRenderCell = originRenderCell || defaultRenderCell;
        // 对 renderCell 进行包装
        column.renderCell = function (h, data) {
            var children = null;
            if (_this2.$scopedSlots.default) {
                children = _this2.$scopedSlots.default(data);
            } else {
                children = originRenderCell(h, data);
            }
            //将图标替换成自定义图标
            var prefix = treeCellPrefix(h, data, _this2.treeIcon);
            var props = {
                class: 'cell',
                style: {}
            };
            if (column.showOverflowTooltip) {
                props.class += ' el-tooltip';
                props.style = { width: (data.column.realWidth || data.column.width) - 1 + 'px' };
            }
            return h('div', props, [prefix, children]);
        };
    }
    return column;
};
//必须复制过来 虽然方法内容一样但内部调用的函数cellForced换成当前目录下的函数
TableColumn.methods.setColumnForcedProps = function (column) {
    // 对于特定类型的 column，某些属性不允许设置
    const type = column.type;
    const source = cellForced[type] || {};
    Object.keys(source).forEach((prop) => {
        let value = source[prop];
        if (value !== undefined) {
            column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value;
        }
    });
    return column;
};
export default { Table, TableColumn };

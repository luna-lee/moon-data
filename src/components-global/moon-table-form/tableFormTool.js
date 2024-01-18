/* 
依据第一条数据，以及表构造对象，构造出一个以存储当前数据的表述文本以及值的6个属性元素为一组对象数组。
空单元行 [{column01:{text:'',rowspan:0,colspan:0},column02:{text:'',rowspan:0,colspan:0,column03:{text:'',rowspan:0,colspan:0,column04:{text:'',rowspan:0,colspan:0,column05:{text:'',rowspan:0,colspan:0,column06:{text:'',rowspan:0,colspan:0}]
用新增一行方式来存储当前待添加的单元组
① 若当前行不满，则将之用空单元填充满。
② 若当前行中单元有跨行，则构造出对应所跨行数的空行(每个单元都是空单元)
③ 新增规则：若当前表格数据最后一或多行不为空行或这空行中可视区域不足以插入当前带添加的单元组。新增行。
*/
function addFilter({ columnNum, currentSumColspan, lastObj, cell_label, cell_value, spanCol, spanRow, arr }) {
    // 补全当前存储单元
    for (let i = currentSumColspan + 1; i <= columnNum; i++) {
        lastObj[`column0${i}`] = {
            text: '\u3000',
            merge: true,
            visiable: true,
            rowspan: 1,
            colspan: 1
        };
    }
    // 增加空行，用于单元跨行时填充,对新增空行中的每一项进行可视化判断。 同时设置hidden
    let rowspanTotal = 1;
    let keys = Object.keys(lastObj);
    let list = keys.map((key) => {
        rowspanTotal = lastObj[key].rowspan > rowspanTotal ? lastObj[key].rowspan : rowspanTotal;
        return lastObj[key];
    });
    for (let i = 1; i < rowspanTotal; i++) {
        let obj = {};
        for (let j = 1; j <= columnNum; j++) {
            let visiable = true;
            if (list[j - 1].rowspan > i) visiable = false;
            obj[`column0${j}`] = {
                text: '\u3000',
                merge: true,
                rowspan: 1,
                colspan: 1,
                visiable,
                hidden: !visiable
            };
        }
        arr.push(obj);
    }
    // --------------------------新增存储单元，并用当前项初始化-----------------------------------------------------------------------
    // 将新增项的行数和列数与当前arr最后连续n行第一列的属性merge为true的空存储单元的个数以其中的visiable数比较。若符合条件，则做替换处理
    let emptyRow = [];
    // 得到空行
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i]?.column01?.merge) emptyRow.unshift(arr[i]);
        else break;
    }
    let emptyRowLen = emptyRow.length;
    // 是否以填充，用于跳出循环
    let hasFill = false;
    // 当空行数不为0且大于待插入单元组的跨行数时执行
    if (emptyRowLen) {
        // 将空行数据中所有visiable为true的单元，依据行数构造一个二维对象数组。统计出每个空行中可以跨列的数据。同时返回出对应的对象数据和key值
        let getEmptyVisiable = emptyRow.reduce((arr, item) => {
            let obj = [];
            Object.keys(item).map((key) => {
                if (item[key].visiable) {
                    if (!obj.length || obj[obj.length - 1].num == 0) {
                        obj.push({
                            num: 0,
                            range: [],
                            keys: []
                        });
                    }
                    obj[obj.length - 1].num++;
                    obj[obj.length - 1].range.push(item[key]);
                    obj[obj.length - 1].keys.push(key);
                } else {
                    obj.push({
                        num: 0,
                        range: [],
                        keys: []
                    });
                }
            });
            arr.push(obj);
            return arr;
        }, []);
        // ①遍历getEmptyVisiable以及单元，只有在可跨行数跨列数，且第一个可替换单元对应的visiable为true时，才进行替换
        // ②替换必须保留对象的引用。同时将visiable设置为false
        // ③若有跨行，将所跨行对应的单元对象加上hidden属性。用于表格渲染时屏蔽改单元
        // ④hasFill更改为true，逐层跳出循环
        for (let i = 0; i < getEmptyVisiable.length; i++) {
            let item = getEmptyVisiable[i];
            for (let j = 0; j < item.length; j++) {
                let obj = item[j];
                if (obj.num - 1 >= spanCol && obj.range[0].visiable) {
                    Object.keys(obj.range[0]).map((key) => {
                        delete obj.range[0][key];
                    });
                    Object.keys(obj.range[1]).map((key) => {
                        delete obj.range[1][key];
                    });
                    obj.range[0].merge = true;
                    Object.assign(obj.range[0], cell_label);
                    Object.assign(obj.range[1], cell_value);
                    obj.range.forEach((value, index) => {
                        if (index > 1 && spanCol >= index) {
                            value.hidden = true;
                            value.visiable = false;
                        }
                    });
                    // 将所跨行上对应的单元赋上hidden,同时将visiable设置为false
                    if (spanRow > 1) {
                        let len = getEmptyVisiable.length > spanRow ? spanRow : getEmptyVisiable.length;
                        for (let k = i + 1; k < len; k++) {
                            let colTotal = 1;
                            for (let jj = 0; jj < j; jj++) {
                                if (item[jj].num) colTotal += item[jj].num;
                                else colTotal++;
                            }
                            // 得到相同长度得到下标
                            let next = getEmptyVisiable[k];
                            let _colTotal = 0;
                            for (let jj = 0; jj < next.length; jj++) {
                                if (next[jj].num) _colTotal += next[jj].num;
                                else _colTotal++;
                                if (_colTotal >= colTotal) {
                                    next[jj].range[0].hidden = true;
                                    next[jj].range[1].hidden = true;
                                    next[jj].range[0].visiable = false;
                                    next[jj].range[1].visiable = false;
                                    break;
                                }
                            }
                        }
                    }
                    hasFill = true;
                    break;
                }
            }
            if (hasFill) break;
        }
    }
    // 若已渲染，则返回，不在以新增行的方式来存储
    if (hasFill) return;
    let obj = {
        column01: cell_label,
        column02: cell_value
    };
    let len = spanCol > columnNum - 1 ? columnNum - 2 : spanCol - 1;
    for (let i = 1; i <= len; i++) {
        obj[`column0${2 + i}`] = {
            text: '\u3000',
            merge: true,
            rowspan: spanRow,
            colspan: 1,
            hidden: true
        };
    }
    arr.push(obj);
}
/**
 * @description 返回的数据中，对hidden = true 和visiable = true的项 通过cell-style和cell-class 进行修改。
 * @param {constructData} [{}]
 * @param {columnNum} 表单列数。默认8
 * @param {labelFun} label单元回调函数，参数为当前constructData中当前的单元项。返回一个对象。
 * @param {valueFun} label单元对应值的回调函数，参数为当前constructData中当前的单元项。返回一个对象。
 * @param {options}constructData数据对象中rowspan和colspan对应的字段
 * @return 
 *  {
     tableData :[{
        "column01": {
            ...,
            "rowspan": 1,
            "colspan": 1,
            "isLabel": true
        },
        "column02": {
            ...,
            "rowspan": 1,
            "colspan": 1,
            "isValue": true
        },
        "column03": {
            ...，
            "rowspan": 3,
            "colspan": 1,
            "isLabel": true
        },
        "column04": {
             ...，
            "rowspan": 3,
            "colspan": 3,
            "isValue": true
        },
        "column05": {
            "text": "",
            "merge": true,
            "rowspan": 3,
            "colspan": 1,
            "hidden": true
        },
        "column06": {
            "text": "",
            "merge": true,
            "rowspan": 3,
            "colspan": 1,
            "hidden": true
        }
    },...】
  , tableColumn:[
    {
        "hasLabelCell": true,
        "columnKey": "column01"
    },
    {
        "hasLabelCell": false,
        "columnKey": "column02"
    },
    {
        "hasLabelCell": true,
        "columnKey": "column03"
    },
    {
        "hasLabelCell": false,
        "columnKey": "column04"
    },
    {
        "hasLabelCell": true,
        "columnKey": "column05"
    },
    {
        "hasLabelCell": false,
        "columnKey": "column06"
    }
]}
 */
export function createTableFormData({ constructData, columnNum = 8, labelFun, valueFun, options = { rowspan: 'rowspan', colspan: 'colspan' } }) {
    columnNum = columnNum - 0;
    if (columnNum < 2) return { tableData: [], tableColumn: [] };
    let tableData = constructData.reduce(
        (arr, value, index) => {
            let spanCol = value[options.colspan] - 0 || 1;
            // 若跨行超过定义的列数，则设为columnNum-1
            if (spanCol > columnNum - 1) spanCol = columnNum - 1;
            let spanRow = value[options.rowspan] - 0 || 1;
            // 待插入单元
            let cell_label = { ...(labelFun ? labelFun(value) : { text: 'label' }), rowspan: spanRow, colspan: 1, isLabel: true };
            // 待插入单元
            let cell_value = {
                ...(valueFun ? valueFun(value) : { text: 'value' }),
                rowspan: spanRow,
                colspan: spanCol,
                isValue: true
            };
            // 当前最新一行数据
            let lastObj = arr[arr.length - 1];
            // 当前行长度
            let currentSumColspan = Object.keys(lastObj).length;
            // 当前存储单元可供存入的列跨度不得低于2，否则新增
            if (columnNum - currentSumColspan >= 2) {
                // 待增加的组，列跨度超过当前存储最大可容跨度时，新增之,否则在当前存储单元上新增
                if (spanCol + 1 > columnNum - currentSumColspan) {
                    addFilter({ columnNum, currentSumColspan, lastObj, cell_label, cell_value, spanCol, spanRow, arr });
                } else {
                    lastObj[`column0${currentSumColspan + 1}`] = cell_label;
                    lastObj[`column0${currentSumColspan + 2}`] = cell_value;
                    for (let i = 1; i <= spanCol - 1; i++) {
                        lastObj[`column0${currentSumColspan + 2 + i}`] = {
                            text: '\u3000',
                            merge: true,
                            rowspan: spanRow,
                            colspan: 1,
                            hidden: true
                        };
                    }
                }
            } else {
                addFilter({ columnNum, currentSumColspan, lastObj, cell_label, cell_value, spanCol, spanRow, arr });
            }
            // 循环结束，对最后一行进行补全,和追加空行
            if (index == constructData.length - 1) {
                //  最新一行数据
                lastObj = arr[arr.length - 1];
                //  行长度
                currentSumColspan = Object.keys(lastObj).length;
                // 补全当前存储单元
                for (let i = currentSumColspan + 1; i <= columnNum; i++) {
                    lastObj[`column0${i}`] = {
                        text: '\u3000',
                        merge: true,
                        visiable: true,
                        rowspan: 1,
                        colspan: 1
                    };
                }

                // 增加空行，用于单元跨行时填充,对新增空行中的每一项进行可视化判断。 同时设置hidden
                let rowspanTotal = 1;
                let keys = Object.keys(lastObj);
                let list = keys.map((key) => {
                    rowspanTotal = lastObj[key].rowspan > rowspanTotal ? lastObj[key].rowspan : rowspanTotal;
                    return lastObj[key];
                });
                for (let i = 1; i < rowspanTotal; i++) {
                    let obj = {};
                    for (let j = 1; j <= columnNum; j++) {
                        let visiable = true;
                        if (list[j - 1].rowspan > i) visiable = false;
                        obj[`column0${j}`] = {
                            text: '\u3000',
                            merge: true,
                            rowspan: 1,
                            colspan: 1,
                            visiable,
                            hidden: !visiable
                        };
                    }
                    arr.push(obj);
                }
            }
            return arr;
        },
        [{}]
    );
    // 构造出列数组，判断当前列是否有label单元
    let tableColumn = tableData.reduce(
        (arr, row) => {
            Object.keys(row).forEach((key, i) => {
                if (!arr[i].hasLabelCell) arr[i].hasLabelCell = Boolean(row[key].isLabel);
                if (!arr[i].columnKey) arr[i].columnKey = key;
            });
            return arr;
        },
        Array.from({ length: columnNum }, () => ({ hasLabelCell: false, columnKey: '' }))
    );
    return { tableColumn, tableData };
}
/**
 * @description 为表格中所有tr高度为0的元素，填充一个不显示的td，同时设置边框
 * @description 由于table合并行对tr样式造成改变，导致整行跨行时不起作用。 这里要判断一行的高度。若为0则需要复制一个不显示且不包含rowspan colspan的td
 * @param {tableDom} 表dom对象
 */
export function fillEmptyTr(tableDom) {
    let trList = tableDom.getElementsByTagName('tr');
    // 新增td后同时colgroup也新增一个col
    let colgroup = tableDom.getElementsByTagName('colgroup');
    for (let i = 0, len = colgroup.length; i < len; i++) {
        if (!colgroup[i].children.length) continue;
        let col = colgroup[i].firstElementChild.cloneNode(true);
        colgroup[i].appendChild(col);
    }
    for (let i = 0, len = trList.length; i < len; i++) {
        // 最后一行移除底部边框
        if (i == len - 1) {
            let tdList = trList[i].getElementsByTagName('td');
            for (let i = 0, len = tdList.length; i < len; i++) {
                tdList[i].style.borderBottom = 'none';
            }
        }
        if (trList[i].offsetHeight == 0 && trList[i].children.length) {
            let firstElementChild = trList[i].firstElementChild.cloneNode(true);
            firstElementChild.removeAttribute('rowspan');
            firstElementChild.removeAttribute('colspan');
            firstElementChild.removeAttribute('style');
            firstElementChild.removeAttribute('class');
            firstElementChild.style.visibility = 'hidden';
            firstElementChild.style.zIndex = '-9999999';
            trList[i].appendChild(firstElementChild);
        }
    }
}
/**
 * @description 设置表内外边框
 * @param {tableDom} 表dom对象
 * @param {border}  表格边框
 * @param {borderInner} 表内部边框
 * @param {columnNum} 列数
 */
export function setBorder(tableDom, border = '1px solid #EBEEF5', borderInner = '1px solid #EBEEF5', columnNum = 6) {
    // 设置表格边框,为了适配el-table,这里不用borderCollapse来设置边框，手动计算可以使内外边框同尺寸不同颜色
    let elTable = tableDom.getElementsByClassName('el-table');
    //是否出现滚动，用于判断最后一个td是否设置右边框
    let isScrollingNone = Boolean(tableDom.getElementsByClassName('is-scrolling-none').length);
    if (elTable.length) {
        elTable[0].style.border = border;
        let trList = tableDom.getElementsByTagName('tr');
        for (let i = 0, len = trList.length; i < len; i++) {
            let tr = trList[i];
            let borderBottom = i == len - 1 ? 'none' : borderInner;
            setTdBorder({ tr, columnNum, isScrollingNone, borderBottom, borderRight: borderInner });
        }
    }
}

function setTdBorder({ tr, columnNum, isScrollingNone, borderBottom, borderRight }) {
    let tdList = tr.getElementsByTagName('td');
    for (let i = 0, len = tdList.length; i < len; i++) {
        let td = tdList[i];
        td.style.borderRight = borderRight;
        td.style.borderBottom = borderBottom;
        // 当没有出现滚动时, 判断当前td所在的位置以及加上对应的colspan 是否与列数相同
        if (isScrollingNone && i + (td.getAttribute('colspan') - 0) == columnNum) td.style.borderRight = 'none';
    }
}

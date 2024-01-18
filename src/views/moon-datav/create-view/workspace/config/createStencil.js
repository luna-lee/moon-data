import { Stencil } from '@antv/x6-plugin-stencil';
export function createStencil(graph, stencilDom, pageCellId ,width) {
    if (!graph || !stencilDom) return;
    const stencil = new Stencil({
        title: '组件库',
        target: graph,
        stencilGraphWidth: 200,
        stencilGraphHeight: 0,
        collapsable: false,
        /*      search(cell, keyword) {
            return cell.getData().label.indexOf(keyword) !== -1;
        },
        placeholder: '搜索组件',
        notFoundText: '没有找到对应的组件', */
        groups: [
            {
                title: '',
                name: 'container'
            }
        ],
        layoutOptions: {
            columns: 1,
            columnWidth: width,
            rowHeight: 125,
        },
        getDragNode(sourceNode) {
            const cell = sourceNode.clone();
            const cellAttrs = cell.getAttrs();
            const cellData = cell.getData();
            cellData.labelStyle = { display: 'none' };
            cellData.attrs.style = cellAttrs?.style?.graph ? cellAttrs.style.graph : cellData.attrs.style || {};
            cell.size(450, 270);
            let zIndex = 0;
            graph.getCells().forEach((cell) => {
                let z = cell.getZIndex();
                if (zIndex <= z) zIndex = z + 1;
            });
            cell.setZIndex(zIndex);
            cell.setData(cellData, {
                overwrite: true
            });
            return cell;
        },
        getDropNode(draggingNode) {
            const cell = draggingNode.clone();
            const pageCell = graph.getCellById(pageCellId);
            setNodeLabel(cell, graph);
            cell.setParent(pageCell);
            console.log(cell);
            return cell;
        },
        validateNode(droppingNode, opt) {
            // console.log(droppingNode);
            // let cell = graph.updateCellId(droppingNode, '4855ba5babad493f81650c80d5e282c1');
            // console.log(cell);
            // graph.addCell(cell)
            return true;
        }
    });
    if (stencilDom) stencilDom.appendChild(stencil.container);

    return stencil;
}
//自动在同名的节点后面累加数字
function setNodeLabel(cell, graph) {
    const cellData = cell.getData();
    let label = cellData.label;
    const reg = new RegExp(label + '-(\\d)');
    cellData.label = graph.getCells().reduce((str, cell) => {
        let text = cell.getData().label;
        let textNum = 0;
        let strNum = 0;
        let match = text.match(reg);
        if (match) textNum = parseInt(match[1]);
        let match2 = str.match(reg);
        if (match2) strNum = parseInt(match2[1]);
        if (textNum && strNum <= textNum) str = `${label}-${textNum + 1}`;
        if (text == str) str = text + '-1';
        return str;
    }, label);
    cell.setData(cellData, {
        overwrite: true
    });
}
export async function loadByGroup(graph, stencil, currentSelectGroup) {
    const nodeList = currentSelectGroup.nodeList.map((config) => {
        if (config?.attrs?.style?.stencil) config.data.attrs.style = config.attrs.style.stencil;
        return graph.createNode(config);
    });
    stencil.load(nodeList, 'container');
}

export async function loadByName(graph, stencil, nodeName, nodeShapList) {
    let nodeList = [];
    function getAllLeaveNode(arr) {
        arr.map(item => {
            if (item?.children?.length) {
                getAllLeaveNode(item.children)
            }
            else {
                nodeList = [...nodeList, ...item.nodeList.filter((node) => node.data.label.includes(nodeName))]
            }
        })
    }
    getAllLeaveNode(nodeShapList)
    stencil.load(
        nodeList.map((config) => {
            if (config?.attrs?.style?.stencil) config.data.attrs.style = config.attrs.style.stencil;
            return graph.createNode(config);
        }),
        'container'
    );
}

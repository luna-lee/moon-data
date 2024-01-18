import { Graph, Point } from '@antv/x6';
export const createGraph = (container, pageCellId) => {
    const graph = new Graph({
        container,
        // scroller: true,
        panning: true,
        background: {
            color: '#25282C'
        },
        grid: {
            visible: true,
            type: 'dot',
            args: {
                color: '#a0a0a0', // 网格线/点颜色
                thickness: 1 // 网格线宽度/网格点大小
            }
        },
        autoResize: true,
        mousewheel: {
            enabled: true,
            zoomAtMousePosition: true,
            modifiers: 'ctrl',
            minScale: 0.1,
            maxScale: 10
        },
        interacting: function (cellView) {
            const cell = cellView.cell;
            // 节点只有选中后才能移动，且id不能为page，不能锁定
            let nodeMovable = true;
            if (graph.isSelected(cell) && cell.id != pageCellId && !cell.getAttrs()?.config?.lock) {
                cellView.container.style.cursor = 'move';
                nodeMovable = true;
            } else {
                cellView.container.style.cursor = 'grab';
                nodeMovable = false;
            }
            return { nodeMovable };
        },
        translating: {
            restrict(cellView) {
                if (!cellView) return false;
                // const parentId = cell.prop('parent');
                const pageCell = graph.getCellById(pageCellId);
                // if (parentId == pageCellId) {
                // const parentNode = graph.getCellById(parentId);
                // if (pageCell) {
                return pageCell.getBBox().moveAndExpand({
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                });
                // }
                // return cell.getBBox();
                // } else return true;
            }
        },
        embedding: {
            enabled: true,
            frontOnly: false,
            findParent({ node }) {
                return [node.getParent()];
            },
            validate({ parent, child }) {
                return parent.id == pageCellId || parent.data.type == 'moon-dv-container';
            }
        }
    });

    return graph;
};

export function event(graph, container) {
    // graph.on('node:mouseenter', () => {
    //     console.log('node:mouseenter');
    //     // changePortsShow(true, container);
    // });
    // graph.on('node:mouseleave', () => {
    //     console.log('node:mouseleave');
    //     // changePortsShow(false, container);
    // });
    // graph.on('node:removed', () => {
    //     console.log('node:removed');
    // });

    // graph.on('node:change:data', () => {
    //     //console.log('node:change:data', cell);
    // });
    // 移入入临时表，将节点中的fields存入临时表fields中
    graph.on('node:embedded', ({ node, currentParent }) => {
        console.log('node:embedded');
        // upDateZIndex(currentParent);
    });
}
/* function changePortsShow(val, container) {
    const ports = container.querySelectorAll('.x6-port-body');
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = val ? 'visible' : 'hidden';
    }
} */
// 更新层级
function upDateZIndex(cell) {
    const children = cell.getChildren();
    const zIndex = cell.getZIndex();
    if (children) {
        children.forEach((child) => {
            if (child.getZIndex() <= zIndex) {
                child.setZIndex(zIndex + 1);
            }
            upDateZIndex(child);
        });
    }
}

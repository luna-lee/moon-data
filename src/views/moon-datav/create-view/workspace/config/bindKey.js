import { Message } from 'element-ui';
export function bindKey(graph, transformPlugin, pageCellId) {
    /*  graph.bindKey(
        ['ctrl', 'meta'],
        () => {
            graph.keyState = 'ctrl';
        },
        'keypress'
    );
    graph.bindKey(
        ['ctrl', 'meta'],
        () => {
            graph.keyState = '';
        },
        'keyup'
    ); */
    graph.bindKey(['ctrl+c', 'meta+c'], () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
            graph.copy(cells);
        }
        return false;
    });
    graph.bindKey(['ctrl+z', 'meta+z'], () => {
        let cells = graph.getCells();
        if (cells.length > 1) graph.undo();
    });

    graph.bindKey(['ctrl+v', 'meta+v'], () => {
        // 拷贝时需要替换对应的class名
        graph.getCellsInClipboard().map((cell) => {
            let data = cell.getData();
            data.attrs.class = data.attrs.class.replace(/(?<=(\.moon-datav-)).*(?={)/gm, cell.id + ' ');
        });
        if (!graph.isClipboardEmpty()) {
            const cells = graph.paste({
                offset: 32,
                nodeProps: {
                    parent: pageCellId
                }
            });
            graph.cleanSelection();
            transformPlugin.clearWidgets();
            graph.select(cells);
        }
        return false;
    });
    graph.bindKey(['delete', 'backspace'], () => {
        const cells = graph.getSelectedCells();

        graph.removeCells(
            cells.filter((cell) => {
                //组件被锁定且不是透传组件，不能被删除
                if (cell.getAttrs()?.config?.lock && !cell.getAttrs().bussinessData.pushWorkspaceId) {
                    Message.error('不能删除被锁定的组件！');
                }
                return cell.id != pageCellId && (!cell.getAttrs()?.config?.lock || cell.getAttrs().bussinessData.pushWorkspaceId);
            })
        );
    });

    /*     graph.bindKey(['up'], () => {
        const cells = graph.getSelectedCells();
        graph.removeCells(cells.filter((cell) => cell.id != pageCellId && !cell.getAttrs()?.config?.lock));
    }); */
}

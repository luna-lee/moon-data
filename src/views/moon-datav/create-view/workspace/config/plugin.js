import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
// import { Scroller } from '@antv/x6-plugin-scroller';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';
import { MiniMap } from '@antv/x6-plugin-minimap';
export function plugin(graph, pageCellId) {
    graph.use(
        new Keyboard({
            enabled: true,
            global: true
        })
    );
    const transformPlugin = new Transform({
        resizing: {
            enabled(cell) {
                return cell.id != pageCellId && !cell.getAttrs()?.config?.lock && graph.getSelectedCells().length <= 1;
            },
            minWidth(cell) {
                return 0;
            },

            maxWidth(cell) {
                const page = graph.getCellById(pageCellId);
                return page.size().width;
            },
            minHeight(cell) {
                return 0;
            },
            maxHeight(cell) {
                const page = graph.getCellById(pageCellId);
                return page.size().height;
            },
            allowReverse: false
        }
    });
    transformPlugin.init(graph);
    graph.use(
        new Snapline({
            enabled: false
        })
    );

    graph.use(
        new Clipboard({
            enabled: true
        })
    );
    graph.use(
        new Selection({
            enabled: true,
            multiple: true,
            // rubberband: true,
            movable: true,
            pointerEvents: 'none',
            showNodeSelectionBox: true,
            showEdgeSelectionBox: false
            /*   filter(cell) {
                return cell.id != pageCellId;
            } */
        })
    );
    graph.use(
        new History({
            enabled: true
        })
    );
/*     graph.use(new MiniMap({
        container: document.getElementById('minimap'),
        graphOptions: {
            createCellView(cell) {
                this.addCell(SimpleNodeView)
                return SimpleNodeView
            },
        },
    })) */

    return { transformPlugin };
}

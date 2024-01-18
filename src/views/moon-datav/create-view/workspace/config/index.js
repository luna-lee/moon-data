import { registerCellTool } from './register';
import { event } from './event';
import { plugin } from './plugin';
import { bindKey } from './bindKey';
import { createGraph } from './createGraph';
export function initDag(graphDom, pageCellId) {
    registerCellTool(pageCellId);
    const graph = createGraph(graphDom, pageCellId);
    event(graph, graphDom, pageCellId);
    const { transformPlugin } = plugin(graph, pageCellId);
    bindKey(graph, transformPlugin, pageCellId);
    return { graph, transformPlugin };
}

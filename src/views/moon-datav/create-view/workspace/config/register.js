import { Graph, Shape } from '@antv/x6';
import { register } from '@antv/x6-vue-shape';
import CustomVueRect from './component/custom-vue-node/index.vue';
export function registerCellTool(pageCellId) {
    CustomVueRect.props.pageCellId.default = pageCellId;
    unRegisterCellTool();
    // 表节点
    register({
        shape: 'custom-vue-node',
        width: 200,
        height: 90,
        component: CustomVueRect
    });
}
function unRegisterCellTool() {
    Graph.unregisterEdgeTool('circle-target-arrowhead');
    Graph.unregisterEdgeTool('circle-source-arrowhead');
    Graph.unregisterNode('custom-vue-node');
}

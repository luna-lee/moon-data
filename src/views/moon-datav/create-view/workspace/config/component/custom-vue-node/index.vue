<template>
    <div class="custom-vue-rect">
        <div class="mask"></div>
        <template v-if="!isStencil">
            <moon-transition v-bind="getNode().getData().animation">
                <!-- <component class="graph-cell" :key="key" :is="ComponentName" v-bind="ComponentAttrs" :class="[className]"></component> -->
                <moon-dv-custom
                    v-if="ComponentAttrs"
                    class="graph-cell"
                    :key="key"
                    :name="ComponentName"
                    :bindAttrs="ComponentAttrs"
                    :class="[className]"
                    :globalVar="globalVar"
                ></moon-dv-custom>
            </moon-transition>
        </template>
        <template v-else>
            <div class="label" :style="labelStyle">{{ label }}</div>
            <component
                v-if="!getNode().getAttrs().config?.stencilImg && ComponentAttrs"
                class="graph-cell"
                :key="key"
                :is="ComponentName"
                v-bind="ComponentAttrs"
                :class="[className]"
            ></component>
            <el-image class="stencilImg" v-else :src="getNode().getAttrs().config?.stencilImg">
                <div slot="placeholder" class="placeholder">加载中<span class="dot">...</span></div>
            </el-image>
        </template>
    </div>
</template>
<script>
// 组件内无法使用vuex.与vue-route
import less from 'less';
import { getUUID } from '@/components-global/utils.js';
import { updateCellDataView, ExecFunctionStr, ReplaceGlobalVarName } from '@/views/moon-datav/utils';
export default {
    inheritAttrs: false,
    name: '',
    inject: ['getNode', 'getGraph'],
    props: {
        pageCellId: {
            type: String,
            default: 'page'
        }
    },
    provide() {
        return {
            pageCellId: this.pageCellId
        };
    },
    components: {},
    created() {},

    mounted() {
        const node = this.getNode();
        this.className = `moon-datav-${node.id}`;

        node.on('change:size', () => {
            //console.log('change:size');
            if (node.getData().type.startsWith('dv-border-box') || node.getData().type.startsWith('dv-decoration')) this.key = getUUID();
        });
        this.graph = this.getGraph();
        const pageCell = this.graph.getCellById(this.pageCellId);
        if (pageCell) {
            this.initDataGraph(node, pageCell);
            this.graph.on('cell:change:data', ({ cell }) => {
                // 设计视图中，工作空间中全局变量改变，触发所有依赖组件的重绘
                if (cell.id == this.pageCellId && node.id != this.pageCellId) {
                    let isMainWorkspace = cell.getAttrs().bussinessData.mainWorkspaceId == cell.getAttrs().bussinessData.workspaceId;
                    // 只有对pageCell有依赖的组件才更新
                    let { globalVar } = cell.getData();
                    let { attrs, showhiddenFunctionText } = node.getData();
                    const slotDom = ReplaceGlobalVarName(attrs.slotDom || '');
                    let propsFunctionText = ReplaceGlobalVarName(attrs.propsFunctionText || '()=>{return true}');
                    showhiddenFunctionText = ReplaceGlobalVarName(showhiddenFunctionText || '()=>{return true}');
                    const keys = Object.keys(globalVar);
                    const flag = keys.some((key) => {
                        // 子空间之需要判断workspaceVar开头的变量
                        if (!isMainWorkspace && key.startsWith('workspaceVar'))
                            return (
                                slotDom.indexOf(key) != -1 ||
                                propsFunctionText.indexOf(key) != -1 ||
                                showhiddenFunctionText.indexOf(key) != -1
                            );
                        if (isMainWorkspace)
                            return (
                                slotDom.indexOf(key) != -1 ||
                                propsFunctionText.indexOf(key) != -1 ||
                                showhiddenFunctionText.indexOf(key) != -1
                            );
                        else return false;
                    });
                    if (!this.initLoading && flag) this.initDataGraph(node, pageCell);
                }
                if (node.id == cell.id) {
                    if (!this.initLoading) this.initDataGraph(node, pageCell);
                }
            });
        } else this.initDataStencil(node);
        /*   node.on('change:data', ({ cell }) => {
            this.initDataGraph(cell, pageCell);
        }); */
    },
    data() {
        return {
            label: '',
            labelStyle: {},
            ComponentName: '',
            ComponentAttrs: null,
            key: getUUID(),
            className: '',
            globalVar: {},
            graph: null,
            isStencil: false,
            initLoading: true
        };
    },
    watch: {},
    computed: {},
    methods: {
        async initDataGraph(node, pageCell) {
            this.initLoading = true;
            try {
                this.isStencil = false;
                let { type, attrs, label, labelStyle, prepareFunctionText, mainWorkspacePrepareFunctionText, showhiddenFunctionText } =
                    node.getData();
                const slotDom = attrs.slotDom && ReplaceGlobalVarName(attrs.slotDom);
                let { globalVar } = pageCell.getData();
                this.globalVar = globalVar;
                this.ComponentName = type || '';
                const classDom = attrs.class || '';
                if (node.id == this.pageCellId) {
                    const org_globalvarString = JSON.stringify(this.globalVar);
                    if (mainWorkspacePrepareFunctionText) {
                        mainWorkspacePrepareFunctionText = ReplaceGlobalVarName(mainWorkspacePrepareFunctionText || 'async()=>{}');
                        await ExecFunctionStr(this.globalVar, this, mainWorkspacePrepareFunctionText);
                    }
                    prepareFunctionText = ReplaceGlobalVarName(prepareFunctionText || 'async()=>{}');
                    await ExecFunctionStr(this.globalVar, this, prepareFunctionText);

                    if (JSON.stringify(this.globalVar) != org_globalvarString) {
                        updateCellDataView(node, { globalVar: this.globalVar, ...node.getData() });
                    }
                } else {
                    showhiddenFunctionText = ReplaceGlobalVarName(showhiddenFunctionText || '()=>{return true}');

                    let flag = await ExecFunctionStr(this.globalVar, this, showhiddenFunctionText);
                    let partentVisibale = node.getParent() && node.getParent().isVisible();
                    if (flag && !node.isVisible() && partentVisibale) {
                        //  若node是容器，这将其所有子节点都显示
                        node.getDescendants().map((n) => n.show());
                        node.show();
                    }
                    if ((!flag && node.isVisible()) || !partentVisibale) {
                        //  若node是容器，这将其所有子节点都隐藏
                        node.getDescendants().map((n) => n.hide());
                        node.hide();
                    }
                }

                this.ComponentAttrs = { ...attrs, slotDom };
                this.ComponentAttrs.propsFunctionText = ReplaceGlobalVarName(this.ComponentAttrs.propsFunctionText || '()=>{return true}');
                // delete this.ComponentAttrs.propsFunctionText;
                delete this.ComponentAttrs.listenerFunctionText;
                delete this.ComponentAttrs.class;
                this.label = label || '';
                this.labelStyle = labelStyle || {};
                this.insertClass(classDom);
                this.inertBodyCSS(node);
                this.key = getUUID();
            } catch (error) {
                console.log(error);
            }
            this.initLoading = false;
        },
        async initDataStencil(node) {
            try {
                this.isStencil = true;
                let { type, attrs, label, labelStyle } = node.getData();
                this.ComponentName = type || '';
                this.ComponentAttrs = { ...attrs } || {};
                let propsFunctionText = ReplaceGlobalVarName(this.ComponentAttrs.propsFunctionText || '()=>{return true}');
                let props = await ExecFunctionStr(this.globalVar, this, propsFunctionText);
                this.ComponentAttrs = { ...this.ComponentAttrs, ...props };
                delete this.ComponentAttrs.propsFunctionText;
                delete this.ComponentAttrs.listenerFunctionText;
                this.label = label || '';
                this.labelStyle = labelStyle || {};
                this.key = getUUID();
            } catch (error) {
                console.log(error);
            }
        },

        insertClass(classDom) {
            let dom = document.getElementById(this.className);
            less.render(classDom, (e, output) => {
                const css = output ? output.css : '';
                if (!dom) {
                    const styleDom = document.createElement('style');
                    styleDom.setAttribute('id', this.className);
                    styleDom.innerHTML = css;
                    document.head.appendChild(styleDom);
                } else dom.innerHTML = css;
            });
        },
        inertBodyCSS(node) {
            const graphElement = document.getElementById('moon-dv-x6-graph');
            if (node.id == this.pageCellId && !graphElement.className.includes(`moon-datav-${this.pageCellId}`)) {
                graphElement.className = graphElement.className + ` moon-datav-${this.pageCellId}`;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.custom-vue-rect {
    width: 100%;
    height: 100%;
    .label {
        position: absolute;
        width: 100%;
        top: -24px;
        background: #2e343c;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #bcc9d4;
        padding: 0 5px;
        box-sizing: border-box;
    }
    .graph-cell {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
    .mask {
        position: absolute;
        top: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        z-index: 9999;
    }
    .stencilImg {
        width: 100%;
        height: 100%;
        .error {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            border: 1px solid;
            box-sizing: border-box;
        }
    }
}
</style>

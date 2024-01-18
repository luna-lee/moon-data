<template>
    <div class="workspace" v-resize="handlerDomResize">
        <div class="nav-bar">
            <div style="margin-left: 10px">
                <el-tooltip effect="dark" content="返回" placement="bottom">
                    <div class="item" @click="onBack()">
                        <i class="el-icon-s-home"></i>
                    </div>
                </el-tooltip>
            </div>
            <div style="margin-left: 10px">
                <el-tooltip effect="dark" content="图层" placement="bottom">
                    <div class="item" @click="showLayer = !showLayer" :class="{ active: showLayer }">
                        <i class="el-icon-s-data"></i>
                    </div>
                </el-tooltip>
            </div>
            <div style="display: flex; right: 10px; position: absolute">
                <el-tooltip effect="dark" content="保存" placement="bottom">
                    <div class="item" @click="saveResult()">
                        <i class="el-icon-collection"></i>
                    </div>
                </el-tooltip>
                <el-tooltip effect="dark" content="预览" placement="bottom">
                    <div class="item" @click="prevew">
                        <i class="el-icon-view"></i>
                    </div>
                </el-tooltip>

                <!-- <el-tooltip effect="dark" content="小地图" placement="bottom">
                    <div class="item" @click="openHideMiniMap" :class="{ active: miniMap }" style="margin-left: 50px">
                        <i class="el-icon-map-location"></i>
                    </div>
                </el-tooltip> -->
                <el-tooltip effect="dark" content="配置面板" placement="bottom">
                    <div class="item" @click="controlPannel = !controlPannel" :class="{ active: controlPannel }">
                        <i class="el-icon-setting"></i>
                    </div>
                </el-tooltip>
                <div style="margin-left: 50px">
                    <el-tooltip effect="dark" :content="$store.state.user.userInfo.userName" placement="bottom">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="small"></el-avatar>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div class="dag" :style="{ height: height - 30 + 'px' }">
            <moon-transition name="moon-slide">
                <layer v-if="showLayer && graph" :graph="graph" @layercontextmenu="onLayercontextmenu"></layer>
            </moon-transition>
            <stencil v-if="!!graph" :graph="graph"></stencil>
            <div class="canvans">
                <div id="moon-dv-x6-graph" ref="canvans"></div>
            </div>
            <div class="left" :style="controlPannel ? { transform: 'translateX(0)' } : { transform: translateX }">
                <!-- <div class="minimap" :style="{ right: minimapRight + 'px' }" id="minimap" v-show="miniMap"></div> -->
                <div class="cell-infor" ref="box">
                    <div class="move-left-border" ref="leftborder"></div>
                    <controlPannel
                        v-if="selectCell && controlPannel"
                        :cell="selectCell"
                        :graph="graph"
                        :key="selectCell.id"
                    ></controlPannel>
                </div>
            </div>
        </div>
        <contextMenu
            v-if="selectCell"
            v-model="contextMenu"
            :contextMenuStyle="contextMenuStyle"
            :cell="selectCell"
            :graph="graph"
            :key="selectCell.id"
        />
    </div>
</template>
<script>
import { initDag } from './config/index';
import { pageNode } from './config/nodeShapList';
import { resize } from '@/components-global/directives.js';
import controlPannel from './control-pannel/index.vue';
import stencil from './config/component/stencil/index.vue';
import contextMenu from './context-menu/index.vue';
import layer from './layer/index.vue';
import {
    getProjectById,
    addOrUpdateCells,
    getCellsByWorkSpaceId,
    getCellByWorkspaceIdAndCellId,
    delCellByWorkspaceIdAndCellId
} from '@/service/index.js';
export default {
    inheritAttrs: false,
    name: '',
    provide() {
        return {
            getTransformPlugin: () => this.transformPlugin,
            getCell: () => this.selectCell,
            getGaph: () => this.graph,
            getWorkspace: () => this.workspace,
            pageCellId: this.pageCellId
        };
    },
    props: {
        id: {
            type: String,
            require: true
        },
        projectId: {
            type: String,
            default: ''
        },
        pageCellId: {
            type: String,
            default: 'page'
        }
    },
    directives: {
        resize
    },
    components: {
        stencil,
        controlPannel,
        contextMenu,
        layer
    },
    data() {
        return {
            loading: false,
            controlPannel: true,
            miniMap: false,
            graph: null,
            transformPlugin: null,
            // editDrawer: true,
            selectCell: null,
            height: 'auto',
            contextMenuStyle: {},
            contextMenu: false,
            showLayer: false,

            scale: 3, //658813476562495, //1,
            startX: 0,
            startY: 0,
            thick: 20,
            isShowRuler: true,
            isShowReferLine: true,
            workspace: {
                id: '',
                projectName: '',
                naem: '主工作空间',
                projectId: '',
                mainWorkspaceId: ''
            },
            // recodeInitDataJsonStr: '',
            publicCells: [],
            needSave: false,
            translateX: 'translateX(470px)'
            // minimapRight: 450
        };
    },
    mounted() {
        const { graph, transformPlugin } = initDag(this.$refs.canvans, this.pageCellId);
        this.transformPlugin = transformPlugin;
        graph.zoomTo(0.5);
        graph.centerPoint();
        graph.translate(10, 10);
        this.$once('hook:beforeDestroy', () => {
            graph.dispose();
        });
        this.graph = graph;

        graph.on('blank:click', ({ e, x, y }) => {
            // console.log('blank:click');
            const page = graph.getCellById(this.pageCellId);
            this.selectCell = page;
            this.contextMenu = false;
            // this.editDrawer = true;
            /* 配置栏不在关闭
            const size = page.size();
            if (size.width >= x && x >= 0 && size.height >= y && y >= 0) {
                this.editDrawer = true;
                this.selectCell = page;
            } else {
                this.editDrawer = false;
            } */
        });
        graph.on('blank:mousedown', () => {
            this.contextMenu = false;
        });
        graph.on('cell:mousedown', () => {
            this.contextMenu = false;
        });
        graph.on('node:removed', () => {
            this.needSave = true;
            this.selectCell = graph.getCellById(this.pageCellId);
        });
        graph.on('node:added', ({ node }) => {
            this.needSave = true;
            // console.log(node);
            // 必须在page组件中
            // if (node.id != this.pageCellId && !node.prop('parent')) graph.removeNode(node);
            const pageCell = graph.getCellById(this.pageCellId);
            const { x, y } = node.getPosition();
            const { width, height } = pageCell.getSize();

            const data = node.getData();
            // 工具线 特殊处理
            if (data.type == 'moon-dv-tool-line' && data.attrs.direction == 'x') {
                node.setPosition(0, node.getPosition().y);
                node.setSize(pageCell.getSize().width, node.getSize().height);
            }
            if (data.type == 'moon-dv-tool-line' && data.attrs.direction == 'y') {
                node.setPosition(node.getPosition().x, 0);
                node.setSize(node.getSize().width, pageCell.getSize().height);
            }
            if (x < 0) {
                node.setPosition(0, y);
            }
            if (y < 0) {
                node.setPosition(node.getPosition().x, y);
            }
            if (x > width) node.setPosition(width - node.getSize().width, node.getPosition().y);
            if (y > height) node.setPosition(node.getPosition().x, height - node.getSize().height);
        });
        graph.on('cell:selected', ({ cell }) => {
            if (!cell || cell.isEdge()) return;
            //console.log('cell:selected');
            this.editForm(cell);
        });
        graph.on('cell:unselected', () => {
            //console.log('cell:unselected');
            // this.editDrawer = false;
        });
        graph.on('cell:unselected', () => {
            //console.log('cell:unselected');
            // this.editDrawer = false;
        });
        graph.on('node:contextmenu', ({ cell, e: { clientY, clientX } }) => {
            this.transformPlugin.clearWidgets();
            // console.log('node:contextmenu');
            let flag = graph.getSelectedCells().some((c) => cell.id == c.id);
            if (!flag) graph.resetSelection([cell]);
            this.contextMenu = true;
            this.contextMenuStyle = {
                top: clientY + 'px',
                left: clientX + 'px'
            };
        });

        graph.on('blank:contextmenu', ({ e: { clientY, clientX } }) => {
            this.transformPlugin.clearWidgets();
            const cell = graph.getCellById(this.pageCellId);
            this.selectCell = cell;
            let flag = graph.getSelectedCells().some((c) => cell.id == c.id);
            if (!flag) graph.resetSelection([cell]);
            this.contextMenu = true;
            this.contextMenuStyle = {
                top: clientY + 'px',
                left: clientX + 'px'
            };
        });
        this.initCell();
        this.setHotKey();
        this.moveBorder();
    },

    watch: {
        editDrawer(val) {
            // 清楚节点选择样式
            if (!val) this.graph.cleanSelection();
        },
        async id(newVal, oldVal) {
            this.initCell();
        }
    },
    computed: {
        isMainWorkspace() {
            return this.workspace.id == this.workspace.mainWorkspaceId;
        }
    },
    methods: {
        async initCell() {
            this.loading = true;
            if (this.graph && this.id) {
                this.graph.clearCells();
                const res = await getCellsByWorkSpaceId({ id: this.id });
                this.workspace = res.data;
                //副工作空间，需要从主工作空间中重新获取自定义全局变量，以及isPublic组件
                if (this.workspace.id != this.workspace.mainWorkspaceId) {
                    const { data: mainWorkspace } = await getCellsByWorkSpaceId({ id: this.workspace.mainWorkspaceId });
                    let mainPageCell = {};
                    // 公共视图组件，只存在与主工作空间中的cell
                    this.publicCells = [];
                    mainWorkspace.cellList.forEach((cell) => {
                        if (cell.cellId == this.pageCellId) {
                            mainPageCell = JSON.parse(cell.jsonStr);
                        }
                        if (cell.isPublic == '1') {
                            let c = JSON.parse(cell.jsonStr);
                            c.attrs.bussinessData = cell;
                            c.attrs.bussinessData.mainWorkspaceId = this.workspace.mainWorkspaceId;
                            this.publicCells.push(c);
                        }
                    });
                    // 更新依赖的push透视组件，除主工作空间以外的任何工作空间中的cell,透视组件不能被修改，但能被删除。
                    if (this.workspace.cellList.length) {
                        let cells = await Promise.all(
                            this.workspace.cellList.map(async (cell) => {
                                if (cell.pushWorkspaceId) {
                                    let { data: pushCell } = await getCellByWorkspaceIdAndCellId({
                                        workspaceId: cell.pushWorkspaceId,
                                        cellId: cell.cellId
                                    });
                                    if (pushCell.id) {
                                        // 避免透传的是容器的组件，而丢失视图。cell的partent设置为partent。cell只做视图占位，不参配置。故不会有任何影响
                                        cell.jsonStr = JSON.stringify({ ...JSON.parse(pushCell.jsonStr), parent: this.pageCellId });
                                    } else {
                                        // 依赖被删除了
                                        await delCellByWorkspaceIdAndCellId({ workspaceId: cell.workspaceId, cellId: cell.cellId });
                                        cell = null;
                                    }
                                }
                                if (!cell) return null;
                                let c = JSON.parse(cell.jsonStr);
                                // 若透传则锁定
                                if (cell.pushWorkspaceId) {
                                    if (c.attrs.config) c.attrs.config.lock = true;
                                    else
                                        c.attrs.config = {
                                            lock: true
                                        };
                                }
                                c.attrs.bussinessData = cell;
                                c.attrs.bussinessData.mainWorkspaceId = this.workspace.mainWorkspaceId;

                                return c;
                            })
                        );
                        // 将publicCells中非page页面合并到cells中,
                        cells = [...cells.filter((v) => v), ...this.publicCells.filter((v) => v.id != this.pageCellId)];
                        this.setPageCellFirst(cells);
                        cells.forEach((cell) => {
                            // 将主工作空间中的自定义全局变量更新到副工作空间中
                            if (cell.id == this.pageCellId) {
                                // 子工作空间的globalVar
                                const workspaceSelfGlobalVar = {};
                                Object.keys(cell.data.globalVar).forEach((key) => {
                                    if (!key.trim().startsWith('globalVar_')) {
                                        workspaceSelfGlobalVar[key] = cell.data.globalVar[key];
                                    }
                                });
                                cell.data.globalVar = { ...workspaceSelfGlobalVar, ...mainPageCell.data.globalVar };
                                // 临时存储
                                cell.data.mainWorkspacePrepareFunctionText = mainPageCell.data.prepareFunctionText;
                                // 主空间中的配置
                                cell.data.attrs = mainPageCell.data.attrs;
                                cell.size = mainPageCell.size;
                            }
                            if (cell.attrs.bussinessData.isPublic == '1')
                                cell.attrs.config = {
                                    lock: true
                                };
                            this.graph.addNode(cell);
                        });
                    } else {
                        this.setPageCellFirst(this.publicCells);
                        this.publicCells.forEach((cell) => {
                            cell.attrs.config = {
                                lock: true
                            };
                            this.graph.addNode(cell);
                        });
                        // 调用保存
                        this.saveResult('工作空间初始化完成');
                    }
                } else {
                    if (this.workspace.cellList.length) {
                        let cells = this.workspace.cellList.map((cell, index) => {
                            let c = JSON.parse(cell.jsonStr);
                            c.attrs.bussinessData = cell;
                            c.attrs.bussinessData.mainWorkspaceId = this.workspace.mainWorkspaceId;
                            return c;
                        });
                        this.setPageCellFirst(cells);
                        cells.forEach((cell) => {
                            this.graph.addNode(cell);
                        });
                    } else {
                        pageNode.attrs.bussinessData.isPublic = '1';
                        pageNode.id = this.pageCellId;
                        this.graph.addNode(pageNode);
                    }
                }
                const page = this.graph.getCellById(this.pageCellId);
                this.selectCell = page;

                /*               // 记录初始化时的json数据，当切换工作空间是用于判断是否需要保存
                const { cells: jsonArr } = this.graph.toJSON();
                this.recodeInitDataJsonStr = JSON.stringify(jsonArr); */
                // 延时调用，避免因graph刷新时触发保存机制
                this.needSave = false;
                setTimeout(() => {
                    this.graph.on('cell:change:attrs', () => {
                        this.needSave = true;
                    });
                    this.graph.on('cell:change:zIndex', () => {
                        this.needSave = true;
                    });
                    this.graph.on('cell:change:parent', () => {
                        this.needSave = true;
                    });
                    this.graph.on('cell:change:data', (res) => {
                        this.needSave = true;
                    });
                    this.graph.on('cell:change:position', () => {
                        this.needSave = true;
                    });
                    this.graph.on('cell:change:size', () => {
                        this.needSave = true;
                    });
                }, 1000);
            }
            this.loading = false;
        },
        /*       // 判断工作空间是否需要保存
        validateGraphChanged() {
            console.log(this.recodeInitDataJsonStr);
            console.log(this.getCurrentDataJsonStr());
            //判断上个工作空间，是否需要保存
            //    await this.saveResult(this.workspace.name + '保存成功！');
            return !equalsString(this.recodeInitDataJsonStr, this.getCurrentDataJsonStr());
        }, */
        /*       getCurrentDataJsonStr() {
            const { cells: jsonArr } = this.graph.toJSON();
            return JSON.stringify(jsonArr);
        }, */
        setHotKey() {
            const saveResult = this.saveResult;
            document.onkeydown = (e) => {
                e = window.event || e;
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    setTimeout(() => {
                        saveResult();
                    }, 1);
                    // 阻止默认事件
                    e.preventDefault();
                }
            };
            this.$once('hook:beforeDestroy', () => {
                document.onkeydown = null;
            });
        },
        //page页面cell设置为第一个
        setPageCellFirst(cells) {
            let pageIndex = cells.findIndex((cell) => cell.id == this.pageCellId);
            // 若不为0则移动到第一个位置
            if (pageIndex > 0) {
                let pageCell = cells[pageIndex];
                cells.splice(pageIndex, 1);
                cells.unshift(pageCell);
            }
        },
        async saveResult(message) {
            const { data: project } = await getProjectById({ id: this.workspace.projectId });
            if (project.ispublish == '1') {
                this.$message.warning('该项目已发布，不能保存！');
                return;
            }
            message = message || this.workspace.name + '保存成功';
            // 针对自定义全局变量中的值为函数做特殊处理，存储成一个null，在运行时会自动赋值
            const pageCell = this.graph.getCellById(this.pageCellId);
            /*      const globalVarObjFormatFun = Object.keys(globalVarObj).reduce((obj, key) => {
                obj[key] = typeof globalVarObj[key] == 'function' ? null : globalVarObj[key];
                return obj;
            }, {}); */
            let { cells: jsonArr } = this.graph.toJSON();
            jsonArr = jsonArr.map((c) => {
                if (c.id == this.pageCellId) c.data.globalVar = pageCell.getData().globalVarDefaultValue || {};
                return c;
            });
            // this.recodeInitDataJsonStr = JSON.stringify(jsonArr);
            this.workspace.cellList = jsonArr
                .filter((cell) => {
                    if (this.isMainWorkspace || cell.id == this.pageCellId) return true;
                    // 子空间中非page的公共视图不保存
                    return cell.attrs.bussinessData.isPublic != '1';
                })
                .map((cell) => {
                    let obj = cell.attrs.bussinessData;
                    delete cell.attrs.bussinessData;
                    obj.cellId = cell.id;
                    obj.jsonStr = JSON.stringify(cell);
                    return obj;
                });
            await addOrUpdateCells({ ...this.workspace, overwrite: true });
            this.needSave = false;
            // localStorage.setItem('dagJson', JSON.stringify(jsonArr));
            this.$message.success(message);
        },
        editForm(cell) {
            this.selectCell = cell;
            // this.selectCellData = JSON.parse(JSON.stringify(cell.getData()));
            this.editDrawer = true;
            /* this.$nextTick(() => {
              if (cell.isNode())
                    this.selectCellData.fields.forEach((item) => {
                        this.$refs.table.getTableVnode().toggleRowSelection(item, item.show);
                    });
                else {
                    this.selectEdgeSourceCellData = cell.getSourceNode().getData();
                    this.selectEdgeTargetCellData = cell.getTargetNode().getData();
                }
            }); */
        },
        openHideMiniMap() {
            this.miniMap = !this.miniMap;
        },
        closeEditForm() {
            this.editDrawer = false;
        },
        onCellSaveConifg() {
            // this.editDrawer = false;
        },
        handlerDomResize(el) {
            this.height = el.offsetHeight;
        },
        zoom(val) {
            this.graph.zoom(val);
        },
        prevew() {
            this.saveResult();
            window.open(`#/moon-datav/preivew?id=${this.workspace.projectId}`);
        },
        onLayercontextmenu({ x, y }) {
            if (this.graph.getSelectedCells().length == 0) {
                const page = this.graph.getCellById(this.pageCellId);
                this.selectCell = page;
            }
            this.transformPlugin.clearWidgets();
            this.contextMenu = true;
            this.contextMenuStyle = {
                top: y + 'px',
                left: x + 'px'
            };
        },
        onBack() {
            this.$router.replace({ name: 'moon-datav' });
        },
        moveBorder() {
            let disX = 0; //鼠标按下时光标的X值
            let disY = 0; //鼠标按下时光标的Y值
            let disW = 0; //拖拽前div的宽
            let disH = 0; // 拖拽前div的高
            let box = this.$refs.box;
            let _this = this;
            this.$refs.leftborder.onmousedown = function (ev) {
                ev = ev || window.event;
                disX = ev.clientX; // 获取鼠标按下时光标x的值
                disY = ev.clientY; // 获取鼠标按下时光标Y的值
                disW = box.offsetWidth; // 获取拖拽前div的宽
                disH = box.offsetHeight; // 获取拖拽前div的高
                document.onmousemove = function (ev) {
                    ev = ev || window.event;
                    //拖拽时为了对宽和高 限制一下范围，定义两个变量
                    let W = disX - ev.clientX + disW;
                    box.style.width = W + 'px'; // 拖拽后物体的宽
                    _this.translateX = `translateX(${W}px)`;
                    _this.minimapRight = W;
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
        }
    }
};
</script>
<style lang="scss" scoped>
.titleStyle {
    background: #2e343c;
    color: #bcc9d4;
}

.workspace {
    height: 100%;
    background-color: #1d1e1f;
    overflow: hidden;
    position: relative;
    .nav-bar {
        height: 30px;
        background-color: #1d1e1f;
        display: flex;
        .item {
            background: #303640;
            padding: 5px;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 2px;
            font-size: 18px;
        }
        .active {
            background: #2681ff;
        }
    }
    .dag {
        position: relative;
        display: flex;
        box-sizing: border-box;
        .canvans {
            position: relative;
            flex: 1;
            height: 100%;
            overflow: hidden;
        }
        .left {
            position: absolute;
            right: 0;
            display: flex;
            height: 0;
            z-index: 999;
            transition: all 1s ease;
            .minimap {
                position: absolute;
                top: calc(100vh - 220px);
            }
            .cell-infor {
                // position: absolute;
                // right: 0;
                width: 450px;
                height: calc(100vh - 30px);
                background-color: #191c21;
                padding: 0 10px;
                position: relative;
                box-sizing: border-box;
                .move-left-border {
                    position: absolute;
                    width: 0;
                    height: 100%;
                    left: 0;
                    border: 5px solid transparent;
                    cursor: w-resize;
                    z-index: 99999999;
                }
                ::v-deep(.el-collapse) {
                    border-top: 0px solid #ebeef5;
                    border-bottom: 0px solid #ebeef5;
                }
                ::v-deep(.el-collapse-item__wrap) {
                    background-color: inherit;
                    border-bottom: 1px solid rgba(52, 52, 52, 0.5);
                }
                ::v-deep(.el-collapse-item__header) {
                    background-color: inherit;
                    color: #fff;
                    border-bottom: 1px solid rgba(52, 52, 52, 0.5);
                    white-space: nowrap;
                }
                ::v-deep(.el-collapse-item__content) {
                    color: #fff;
                    padding-bottom: 0;
                }

                ::v-deep(.el-form-item__label) {
                    color: hsla(0, 0%, 100%, 0.74);
                }

                ::v-deep(.el-textarea__inner) {
                    background: #000 !important;
                    color: #fff;
                    border: transparent;
                }
                ::v-deep(.el-input__inner) {
                    background: #000 !important;
                    color: #fff;
                    border: transparent;
                }
            }
        }
    }
    ::v-deep(.x6-widget-selection-box) {
        border: 1px dashed #feb663;
        box-shadow: none;
        margin: 0;
        padding: 0;
    }
    ::v-deep(.x6-widget-transform) {
        margin: 0;
        padding: 0;
    }
}
.border {
    border: 1px solid #ccc;
    box-sizing: border-box;
}
</style>

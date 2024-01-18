<template>
    <div class="context-menu" v-if="value" v-resize="onResize" :style="{ ...contextMenuStyle, ...style }">
        <template v-if="cell.id != pageCellId">
            <template v-if="isMainWorkspace || (!cell.attrs.bussinessData.pushWorkspaceId && cell.attrs.bussinessData.isPublic != '1')">
                <div @click="up" :class="[disabled.up ? 'disabled' : '']">上移</div>
                <div @click="down" :class="[disabled.down ? 'disabled' : '']">下移</div>
                <div @click="totop" :class="[disabled.up ? 'disabled' : '']">置顶</div>
                <div @click="tobottom" :class="[disabled.down ? 'disabled' : '']">置底</div>
                <div class="align" v-if="graph.getSelectedCells().length > 1 && cell.id != pageCellId && !cell.getAttrs()?.config?.lock">
                    对齐组件
                    <i class="el-icon-arrow-right"></i>
                    <div class="container" :style="{ right: -width + 'px' }">
                        <div @click="setAlign('width')">等宽</div>
                        <div @click="setAlign('height')">等高</div>

                        <div @click="setAlign('top')">顶端对齐</div>
                        <div @click="setAlign('bottom')">底端对齐</div>

                        <div @click="setAlign('left')">左对齐</div>
                        <div @click="setAlign('right')">右对齐</div>
                    </div>
                </div>
                <div class="align" v-if="graph.getSelectedCells().length == 1 && cell.id != pageCellId && !cell.getAttrs()?.config?.lock">
                    对齐辅助线
                    <i class="el-icon-arrow-right"></i>
                    <div class="container" :style="{ right: -width + 'px' }">
                        <div @click="setAlignByLine('top')">顶端对齐</div>
                        <div @click="setAlignByLine('bottom')">底端对齐</div>
                        <div @click="setAlignByLine('left')">左对齐</div>
                        <div @click="setAlignByLine('right')">右对齐</div>
                        <div @click="setAlignByLine('vertical')">垂直居中</div>
                        <div @click="setAlignByLine('horizontal')">水平居中</div>
                    </div>
                </div>
                <div class="insert" v-if="containerList.length">
                    添加到容器内
                    <i class="el-icon-arrow-right"></i>
                    <div class="container" :style="{ right: -width + 'px' }">
                        <div v-for="cell in containerList" :key="cell.id" @click="insert(cell)">
                            {{ cell.data.label }}
                        </div>
                    </div>
                </div>
                <div v-if="!cell.getAttrs()?.config?.lock" @click="onLock(true)">锁定</div>
                <div v-else @click="onLock(false)">解锁</div>

                <div
                    v-if="graph.getSelectedCells().length > 1 && graph.getSelectedCells().some((cell) => !cell.getAttrs()?.config?.lock)"
                    @click="onLockAll(true)"
                >
                    全部锁定
                </div>
                <div
                    v-if="graph.getSelectedCells().length > 1 && graph.getSelectedCells().some((cell) => cell.getAttrs()?.config?.lock)"
                    @click="onLockAll(false)"
                >
                    全部解锁
                </div>
                <div v-if="cell.getParent()?.getData()?.type == 'moon-dv-container'" @click="remove">从容器内移除</div>
                <div v-if="cell.getData().type == 'moon-dv-container'" @click="selectAllNode">选中容器中所有节点</div>

                <div
                    class="insert"
                    v-if="
                        workspaceList.filter((v) => v.id != v.mainWorkspaceId).length &&
                        !cell.attrs.bussinessData.pushWorkspaceId &&
                        cell.attrs.bussinessData.isPublic != '1'
                    "
                >
                    透传到指定工作空间
                    <i class="el-icon-arrow-right"></i>
                    <div class="container" :style="{ right: -width + 'px' }">
                        <div
                            v-for="workspace in workspaceList.filter((v) => v.id != v.mainWorkspaceId)"
                            :key="workspace.id"
                            @click="toOtherWorkspace(workspace, 'push')"
                        >
                            {{ workspace.name }}
                        </div>
                    </div>
                </div>
                <div class="insert" v-if="workspaceList.length">
                    复制到指定工作空间
                    <i class="el-icon-arrow-right"></i>
                    <div class="container" :style="{ right: -width + 'px' }">
                        <div v-for="workspace in workspaceList" :key="workspace.id" @click="toOtherWorkspace(workspace, 'copy')">
                            {{ workspace.name }}
                        </div>
                    </div>
                </div>
                <div class="copyToClipboard" @click="copyToClipboard">复制到剪切板</div>
                <div @click="onDelete" :class="[disabled.delete ? 'disabled' : '']">删除</div>
            </template>
            <div v-if="cell.attrs.bussinessData.pushWorkspaceId" @click="onDelete">删除</div>

            <div v-if="isMainWorkspace && cell.attrs.bussinessData.isPublic != '1'" @click="toPublic('1')">设为公共视图</div>
            <div v-if="isMainWorkspace && cell.attrs.bussinessData.isPublic == '1'" @click="toPublic('0')">取消公共视图</div>
        </template>
        <div v-if="cell.getParent() && cell.getParent().id != pageCellId" @click="onSelectParentContainer">选择所属容器</div>
        <div v-if="graph.getCells().length > 1" @click="onSelectAllPageNode">全选</div>
        <div v-if="canPaste" @click="onPasteFromClipboard">从剪切板黏贴</div>
        <div v-if="graph.getSelectedCells().length > 0" @click="onCaneclSelect">取消选择</div>
    </div>
</template>
<script>
import { resize } from '@/components-global/directives.js';
import { addOrUpdateCells } from '@/service/index.js';
import { copyFlatData, isType } from '@/components-global/utils.js';
export default {
    inheritAttrs: false,
    name: '',
    props: ['value', 'cell', 'graph', 'contextMenuStyle'],
    inject: ['getTransformPlugin', 'getWorkspace', 'getWorkspaceList', 'pageCellId'],
    components: {},
    created() {},
    directives: {
        resize
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            disabled: { down: false, up: false, delete: false },
            containerList: [],
            width: '',
            height: '',
            style: {},
            canPaste: false
        };
    },
    watch: {
        value() {
            this.justifyCanPaste();
        },
        'cell.id': {
            handler(val) {
                if (val) {
                    this.init();
                }
            }
        },
        contextMenuStyle: {
            handler() {
                this.restCalcPosition();
            },
            deep: true
        }
    },
    computed: {
        workspace() {
            return this.getWorkspace();
        },
        workspaceList() {
            return this.getWorkspaceList().filter((v) => v.id != this.workspace.id);
        },
        isMainWorkspace() {
            return this.workspace.id == this.workspace.mainWorkspaceId;
        }
    },
    methods: {
        init() {
            this.justice();
            this.containerList = this.graph.getCells().filter((cell) => cell.data.type == 'moon-dv-container' && cell.id != this.cell.id);
            this.disabled.delete = this.cell.getAttrs()?.config?.lock;
            // .map((cell) => cell.id);
            this.cell.on('change:zIndex', ({ current }) => {
                this.justice();
            });
            this.cell.on('change:attrs', ({ current }) => {
                this.disabled.delete = this.cell.getAttrs()?.config?.lock;
            });
            this.graph.on('selection:changed', ({ cell }) => {
                this.hidden();
            });
            this.justifyCanPaste();
        },
        justice() {
            const selectCells = this.graph.getSelectedCells();
            this.maxZIndex = 1;
            // 获取非选中的他控件的最高层级
            this.graph.getCells().forEach((cell) => {
                if (!selectCells.some((c) => c.id == cell.id) && cell.getZIndex() > this.maxZIndex) this.maxZIndex = cell.getZIndex();
            });
            let down = true;
            let up = true;
            selectCells.forEach((cell) => {
                let z = cell.getZIndex();
                down = down & (z == 1);
                up = up & (z > this.maxZIndex);
            });
            this.disabled.down = down;
            this.disabled.up = up;
        },
        up() {
            this.graph.getSelectedCells().map((cell) => {
                cell.setZIndex(cell.getZIndex() + 1);
            });
            this.hidden();
        },
        down() {
            if (this.disabled.down) return;
            this.graph.getSelectedCells().map((cell) => {
                if (cell.getZIndex() != 1) cell.setZIndex(cell.getZIndex() - 1);
            });
            this.hidden();
        },
        totop() {
            if (this.disabled.up) return;
            this.graph.getSelectedCells().map((cell, index) => {
                cell.setZIndex(this.maxZIndex + 1);
            });
            this.hidden();
        },
        tobottom() {
            this.graph.getSelectedCells().map((cell, index) => {
                cell.setZIndex(1);
            });
            this.hidden();
        },
        insert(partent) {
            this.graph.getSelectedCells().map((cell, index) => {
                if (partent.getZIndex() >= cell.getZIndex()) cell.setZIndex(partent.getZIndex() + 1);
                partent.embed(cell);
            });
            this.hidden();
        },
        copyToClipboard() {
            let selectedCells = this.graph.getSelectedCells().map((cell) => cell.toJSON());
            let clipboardTextObject = {
                moonDvClipboardJsonStr: selectedCells.map((cell) => {
                    //将所有parent置空，以便后面粘贴时，重新赋值
                    if (cell.parent == this.pageCellId) {
                        cell.parent = '';
                    }
                    return cell;
                })
            };
            let clipboard = new Clipboard('.copyToClipboard', {
                text: function () {
                    return JSON.stringify(clipboardTextObject);
                }
            });
            clipboard.on('success', () => {
                this.$message.success('复制成功！');
                clipboard.destroy();
            });
            this.hidden();
        },
        async justifyCanPaste() {
            let flag = true;
            let text = await navigator.clipboard.readText();
            try {
                let jsonText = JSON.parse(text);
                flag = isType(jsonText.moonDvClipboardJsonStr, 'Array');
            } catch (error) {
                flag = false;
            }
            this.canPaste = flag;
        },
        async onPasteFromClipboard() {
            let text = await navigator.clipboard.readText();
            try {
                let jsonText = JSON.parse(text);
                if (!isType(jsonText.moonDvClipboardJsonStr, 'Array')) throw '组件格式不对请重新复制！';
                let cloneJson = copyFlatData({
                    source: jsonText.moonDvClipboardJsonStr,
                    id: 'id',
                    pId: 'parent',
                    defaultPid: this.pageCellId,
                    customFunction: ({ current, idMap }) => {
                        if (current.children) current.children = current.children.map((id) => idMap[id]).filter(Boolean);
                    }
                });
                cloneJson.map((cell) => {
                    let data = cell.data;
                    data.attrs.class = data.attrs.class.replace(/(?<=(\.moon-datav-)).*(?={)/gm, cell.id + ' ');
                    this.graph.addNode(cell);
                });
            } catch (error) {
                console.log(error);
                this.$message.error('组件格式不对请重新复制！');
            }
            this.hidden();
        },
        remove() {
            const pageCell = this.graph.getCellById(this.pageCellId);
            this.graph.getSelectedCells().map((cell, index) => {
                const current_partent = cell.getParent();
                current_partent.unembed(cell);
                pageCell.embed(cell);
            });
            this.hidden();
        },
        hidden() {
            this.$emit('input', false);
        },
        selectAllNode() {
            const cells = this.cell.getDescendants();
            this.graph.cleanSelection();
            this.getTransformPlugin().clearWidgets();
            this.graph.select([...cells, this.cell]);
            this.hidden();
        },
        onResize(e) {
            this.width = e.offsetWidth;
            this.height = e.offsetHeight;
            this.restCalcPosition();
        },
        restCalcPosition() {
            this.style = {};
            let top = parseInt(this.contextMenuStyle.top) || 0;
            const { clientWidth, clientHeight } = document.documentElement;
            if (top + this.height > clientHeight) {
                this.style = { top: top - this.height + 'px' };
            }
            // console.log(this.style);
        },
        onDelete() {
            const cells = this.graph.getSelectedCells();
            this.graph.removeCells(
                cells.filter(
                    (cell) => cell.id != this.pageCellId && (!cell.getAttrs()?.config?.lock || cell.attrs.bussinessData.pushWorkspaceId)
                )
            );
            this.hidden();
        },
        onSelectAllPageNode() {
            const cells = this.graph.getCells();
            cells.shift();
            this.graph.resetSelection(cells);
            this.hidden();
        },
        onCaneclSelect() {
            this.graph.cleanSelection();
            this.hidden();
        },
        onSelectParentContainer() {
            this.cell.getParent();
            this.graph.cleanSelection();
            this.graph.select([this.cell.getParent()]);
        },
        setAlign(type) {
            let { width, height } = this.cell.getSize();
            let { x, y } = this.positionMathRound(this.cell);
            let size = {
                width,
                height
            };
            let position = {
                x,
                y
            };

            this.graph.getSelectedCells().forEach((cell) => {
                if (cell.id != this.pageCellId && !cell.getAttrs()?.config?.lock) {
                    if (type == 'top') {
                        const { x, y } = this.positionMathRound(cell);
                        cell.translate(0, position.y - y);
                    }
                    if (type == 'left') {
                        const { x, y } = this.positionMathRound(cell);
                        cell.translate(position.x - x, 0);
                    }
                    if (type == 'right') {
                        const { x, y } = this.positionMathRound(cell);
                        let { width, height } = cell.getSize();
                        cell.translate(position.x - x + size.width - width, 0);
                    }
                    if (type == 'bottom') {
                        const { x, y } = this.positionMathRound(cell);
                        let { width, height } = cell.getSize();
                        cell.translate(0, position.y - y + size.height - height);
                    }
                    if (type == 'width') {
                        let { width, height } = cell.getSize();
                        cell.size(size.width, height);
                    }
                    if (type == 'height') {
                        let { width, height } = cell.getSize();
                        cell.size(width, size.height);
                    }
                } else {
                    this.$message.warning('不能修改已锁定的组件');
                }
            });
            this.hidden();
        },
        setAlignByLine(type) {
            let pageCell = this.graph.getCellById(this.pageCellId);
            let { width: pageWidth, height: pageHeight } = pageCell.getSize();

            let { width, height } = this.cell.getSize();
            let { x, y } = this.positionMathRound(this.cell);
            let lineCell = {
                top: {
                    x: 0,
                    y: 0
                },
                bottom: {
                    x: 0,
                    y: pageHeight
                },
                left: {
                    x: 0,
                    y: 0
                },
                right: {
                    x: pageWidth,
                    y: 0
                }
            };
            // 找到最近的4根辅助线
            let gapMaxTop = pageHeight - height;
            let gapMaxLeft = pageWidth - width;
            let gapMaxBottom = pageHeight - height;
            let ggapMaxBottom = pageWidth - width;
            this.graph.getCells().forEach((cell) => {
                if (cell.getData().type == 'moon-dv-tool-line') {
                    let { x: lineX, y: lineY } = this.positionMathRound(cell);
                    if (cell.getData().attrs.direction == 'x') {
                        let grap = lineY - y - height;
                        if (grap >= 0 && grap <= gapMaxBottom) {
                            gapMaxBottom = grap;
                            lineCell.bottom = this.positionMathRound(cell);
                        }
                        grap = y - lineY;
                        if (grap >= 0 && grap <= gapMaxTop) {
                            gapMaxTop = grap;
                            lineCell.top = this.positionMathRound(cell);
                        }
                    }
                    if (cell.getData().attrs.direction == 'y') {
                        let grap = lineX - x - width;
                        if (grap >= 0 && grap <= ggapMaxBottom) {
                            ggapMaxBottom = grap;
                            lineCell.right = this.positionMathRound(cell);
                        }
                        grap = x - lineX;
                        if (grap >= 0 && grap <= gapMaxLeft) {
                            gapMaxLeft = grap;
                            lineCell.left = this.positionMathRound(cell);
                        }
                    }
                }
            });
            if (type == 'top') {
                this.cell.translate(0, lineCell.top.y - y);
            }
            if (type == 'bottom') {
                this.cell.translate(0, lineCell.bottom.y - y - height);
            }
            // 垂直
            if (type == 'vertical') {
                this.cell.translate(0, (lineCell.bottom.y + lineCell.top.y - height) / 2 - y);
            }
            // 水平
            if (type == 'horizontal') {
                this.cell.translate((lineCell.right.x + lineCell.left.x - width) / 2 - x, 0);
            }
            if (type == 'left') {
                this.cell.translate(lineCell.left.x - x, 0);
            }
            if (type == 'right') {
                this.cell.translate(lineCell.right.x - x - width, 0);
            }
        },
        positionMathRound(cell) {
            let { x, y } = cell.position();
            return { x: Math.round(x), y: Math.round(y) };
        },
        onLock(flag) {
            this.cell.setAttrs({
                config: {
                    lock: flag
                }
            });
            this.hidden();
        },
        onLockAll(flag) {
            this.graph.getSelectedCells().forEach((cell) => {
                cell.setAttrs({
                    config: {
                        lock: flag
                    }
                });
            });
            this.hidden();
        },
        async toOtherWorkspace(workspace, type) {
            let selectedCells = this.graph.getSelectedCells().map((cell) => {
                if (type == 'copy') {
                    return cell.clone().toJSON();
                } else return cell.toJSON();
            });
            workspace.cellList = selectedCells.map((cell) => {
                let obj = cell.attrs.bussinessData;
                cell.data.attrs.class = cell.data.attrs.class.replace(/(?<=(\.moon-datav-)).*(?={)/gm, cell.id + ' ');
                delete cell.attrs.bussinessData;
                cell.parent = this.pageCellId;
                obj.cellId = cell.id;
                obj.jsonStr = JSON.stringify(cell);
                obj.pushWorkspaceId = type == 'push' ? this.workspace.id : '';
                return obj;
            });
            await addOrUpdateCells(workspace);
            this.$message.success(type == 'copy' ? '复制成功' : '透传成功');
            this.hidden();
        },
        toPublic(isPublic) {
            this.graph.getSelectedCells().forEach((cell) => {
                cell.setAttrs({
                    bussinessData: {
                        isPublic
                    }
                });
            });
            this.hidden();
        }
    }
};
</script>
<style lang="scss" scoped>
.context-menu {
    position: fixed;
    user-select: none;
    top: 0;
    left: 0;
    z-index: 99999;
    background-color: rgb(72, 72, 78);
    color: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    // width: 120px;
    > div {
        padding: 10px;

        &:hover {
            background-color: rgba(52, 52, 52, 0.5);
            cursor: pointer;
        }
    }
    .disabled {
        color: rgba(255, 255, 255, 0.1);
        &:hover {
            cursor: not-allowed;
        }
    }
    .insert,
    .align {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:hover {
            .container {
                display: block;
            }
        }
        .container {
            display: none;
            position: absolute;
            width: 100%;
            background-color: rgb(72, 72, 78);
            color: rgba(255, 255, 255, 0.8);
            top: 10px;
            &:hover {
                display: block;
            }
            > div {
                padding: 10px;

                &:hover {
                    background-color: rgba(52, 52, 52, 0.5);
                    cursor: pointer;
                }
            }
        }
    }
}
</style>

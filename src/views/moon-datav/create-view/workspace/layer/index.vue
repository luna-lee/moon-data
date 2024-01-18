<template>
    <div class="layer">
        <div class="top">
            <el-input v-model="cellName" size="mini" placeholder="搜索图层"> </el-input>
        </div>

        <el-scrollbar wrap-style="overflow-x:hidden !important;" style="height: 100%; width: 150px">
            <div class="center">
                <div
                    class="item"
                    :class="{ selected: selectedCellIds.includes(value.id) }"
                    @click="onSelected($event, value)"
                    v-for="value in list"
                    :key="value.id"
                >
                    <i :class="value.getAttrs().config.lock ? 'el-icon-lock lock' : 'el-icon-unlock'" /> {{ value.getData().label }}
                    <i :class="hiddenCellIds.includes(value.id) ? 'el-icon-view unshow' : 'el-icon-view show'" />
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>
<script>
import { debounce } from 'lodash';
import { ExecFunctionStr, ReplaceGlobalVarName } from '@/views/moon-datav/utils';
export default {
    inheritAttrs: false,
    name: '',
    props: ['graph'],
    inject: ['getTransformPlugin', 'pageCellId'],
    components: {},
    created() {},
    mounted() {
        this.init();
        this.graph.on('cell:change:attrs', () => {
            this.init();
        });
        this.graph.on('cell:change:data', () => {
            this.init();
        });
        this.graph.on('cell:added', ({ cell }) => {
            this.list.unshift(cell);
        });
        this.graph.on('cell:removed', ({ cell }) => {
            this.list.splice(
                this.list.findIndex((c) => c.id == cell.id),
                1
            );
        });
        this.graph.on('selection:changed', ({ selected }) => {
            this.selectedCellIds = this.graph.getSelectedCells().map((c) => c.id);
            // this.init();
        });
        this.$el.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
            const x = evt.clientX;
            const y = evt.clientY;
            this.$emit('layercontextmenu', { x, y });
        });
    },
    data() {
        return {
            list: [],
            copy_list: [],
            selectedCellIds: [],
            hiddenCellIds: [],
            cellName: '',
            debounce_searchCellByName: debounce(this.searchCellByName, 300)
        };
    },
    watch: {
        cellName() {
            this.debounce_searchCellByName();
        }
    },
    computed: {},
    methods: {
        async init() {
            this.hiddenCellIds = [];
            this.selectedCellIds = this.graph.getSelectedCells().map((c) => c.id);
            const pageCell = this.graph.getCellById(this.pageCellId);
            const globalVar = pageCell.getData().globalVar;
            this.list = await Promise.all(
                this.graph
                    .getCells()
                    .reverse()
                    .map(async (cell) => {
                        try {
                            const showhiddenFunctionText = ReplaceGlobalVarName(
                                cell.getData().showhiddenFunctionText || '()=>{return true}'
                            );
                            let flag = await ExecFunctionStr(globalVar, this, showhiddenFunctionText);
                            if (!flag) this.hiddenCellIds.push(cell.id);
                        } catch (error) {
                            console.log('layer,showhiddenFunctionText:', error);
                        }
                        return cell;
                    })
            );
            this.list.pop();
            this.copy_list = [...this.list];
            if (this.cellName) this.searchCellByName();
        },
        onSelected(e, cell) {
            this.getTransformPlugin().clearWidgets();
            if (!e.ctrlKey && !e.metaKey) this.selectedCellIds = [];
            let index = this.selectedCellIds.indexOf(cell.id);
            if (index >= 0) {
                this.selectedCellIds.splice(index, 1);
                this.graph.unselect(cell);
            } else {
                this.selectedCellIds.push(cell.id);
                if (!e.ctrlKey && !e.metaKey) this.graph.resetSelection(cell);
                else this.graph.select(cell);
            }
        },
        searchCellByName() {
            if (!this.cellName) this.list = [...this.copy_list];
            else
                this.list = this.copy_list.filter((cell) => {
                    return cell.getData().label.indexOf(this.cellName) != -1;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.layer {
    width: 150px;
    background-color: #232422;
    color: #fff;
    display: flex;
    flex-direction: column;
    user-select: none;
    overflow-x: hidden;
    .top {
        display: flex;
        align-items: center;
        background-color: #2e343c;
        padding: 10px;
        border-right: 2px solid #000;
        span {
            color: #bcc9d4;
            font-size: 12px;
            width: 6rem;
            text-align: center;
        }
        ::v-deep(.el-input__inner) {
            background: #000;
            color: #fff;
            border: transparent;
        }
        ::v-deep(.el-input-group__append) {
            background-color: #1d262e;
            border: 1px solid #1d262e;
            padding: 0 10px;
        }
    }
    .center {
        display: flex;
        flex-direction: column;
        user-select: none;
        box-sizing: border-box;
        padding-right: 20px;
        padding-left: 5px;

        .item {
            position: relative;
            height: 80px;
            margin: 5px 0;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #2f343b;
            border: 2px solid #2f343b;
            &.selected {
                border: 2px dashed #feb663;
            }
            i {
                position: absolute;
                right: -20px;
            }
            .lock {
                color: #feb663;
            }
            .show {
                top: 0px;
            }
            .unshow {
                top: 0px;
                color: #feb663;
                &::after {
                    position: absolute;
                    top: 6px;
                    right: 1px;
                    width: 15px;
                    height: 2px;
                    transform: rotate(310deg);
                    background-color: #feb663;
                    content: '';
                }
            }
        }
    }
    ::v-deep(.el-scrollbar__wrap) {
        overflow-x: hidden !important;
    }
}
</style>

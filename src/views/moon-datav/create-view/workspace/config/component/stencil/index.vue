<template>
    <div class="stencil-panel" :style="{ width: width + 'px' }">
        <div class="top">
            <span>搜索组件</span>
            <el-input v-model="cellName" size="mini" @keyup.enter.native="searchCellByNaem">
                <el-button slot="append" icon="el-icon-search" @click="searchCellByNaem"></el-button>
            </el-input>
        </div>
        <div class="center">
            <tabMenu v-resize="onTabMenuResize" height="90vh" :menuList="ComponentData" @change="onChangeTab"></tabMenu>
            <moon-scroll style="height: 100%" :style="{ width: stencilWidth + 'px' }">
                <div class="stencil" ref="stencil"></div>
            </moon-scroll>
        </div>
    </div>
</template>
<script>
import { nodeShapList } from '../../nodeShapList.js';
import { createStencil, loadByGroup, loadByName } from '../../createStencil';
import tabMenu from './tab-menu.vue';
import { cloneDeep } from 'lodash';
import { resize } from '@/components-global/directives.js';

export default {
    inheritAttrs: false,
    name: '',
    props: ['graph'],
    inject: ['pageCellId'],
    components: { tabMenu },
    created() {},
    directives: { resize },

    async mounted() {
        this.ComponentData = await nodeShapList(this.pageCellId);
        this.stencil = createStencil(this.graph, this.$refs.stencil, this.pageCellId, this.stencilWidth);
    },
    data() {
        return {
            stencil: null,
            tabsActionName: 'base',
            cellName: '',
            ComponentData: [],
            currentSelectTabs: [],
            width: 285,
            graphWidth: 0, //计算得出
            currentViewWidth: 0, //计算得出
            stencilWidth: 227
        };
    },
    watch: {
        cellName(val) {
            if (val) {
            }
        }
    },
    computed: {},
    methods: {
        initStencil() {
            this.stencil = createStencil(this.graph, this.$refs.stencil, this.pageCellId, this.stencilWidth);
        },
        onChangeTab(e) {
            this.currentSelectTabs = e;
            loadByGroup(this.graph, this.stencil, e[e.length - 1]);
            this.resizeGraphCell();
        },
        searchCellByNaem() {
            if (this.cellName) loadByName(this.graph, this.stencil, this.cellName, cloneDeep(this.ComponentData));
            else loadByGroup(this.graph, this.stencil, this.currentSelectTabs[this.currentSelectTabs.length - 1]);
            this.resizeGraphCell();
        },
        onTabMenuResize(el) {
            this.currentViewWidth = this.width - el.clientWidth;
            if (el.clientWidth && !this.graphWidth) {
                this.graphWidth = this.currentViewWidth;
            }
            this.resizeGraphCell();
        },
        resizeGraphCell() {
            if (!this.stencil || !this.currentViewWidth || !this.graphWidth) return;
            const graph = this.stencil.getGraph('container');
            graph.getCells().map((cell) => {
                cell.resize((this.currentViewWidth * 200) / this.graphWidth, cell.size().height);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.stencil-panel {
    display: flex;
    flex-direction: column;
    .top {
        display: flex;
        align-items: center;
        background-color: #2e343c;
        padding: 10px;
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
        height: 100%;
        .el-tabs {
            ::v-deep(.el-tabs__nav-wrap) {
                &::after {
                    background-color: inherit;
                }
            }
            ::v-deep(.el-tabs__item) {
                height: auto;
                line-height: normal;
                padding: 14px 15px;
                &:not(.is-active) {
                    color: #fff;
                }
                .label-menu {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    i {
                        font-size: 18px;
                    }
                    span {
                        margin-top: 10px;
                        font-size: 12px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: block;
                        font-weight: 400;
                    }
                }
            }
        }
        ::v-deep(.el-scrollbar__wrap) {
            overflow-x: hidden !important;
        }
        .stencil {
            position: relative;
            height: 100%;
            padding: 0 10px;
            height: 100%;
            z-index: 999;

            ::v-deep(.x6-widget-stencil) {
                background-color: #191c21;
            }
            ::v-deep(.x6-widget-stencil-group > .x6-widget-stencil-group-title) {
                display: none;
            }
            ::v-deep(.x6-widget-stencil-title) {
                display: none;
            }
            ::v-deep(.x6-widget-stencil-content) {
                position: relative;
                top: 0;
            }
        }
    }
}
</style>

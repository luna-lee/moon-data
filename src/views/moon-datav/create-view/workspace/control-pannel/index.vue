<template>
    <div class="control-pannel">
        <div class="title">
            <el-input :value="title" @input="onChange" :disabled="disabled || (isPublicCell && !isMainWorkspace)"></el-input>
        </div>
        <div v-if="!isPageCell && !isTools" class="show-document" @click="onShowDocument">
            <i class="el-icon-document"></i> <span>组件文档</span>
        </div>
        <div v-if="isPageCell" class="show-document" @click="onWriteDocument">
            <i class="el-icon-document"></i> <span>编写项目文档</span>
        </div>
        <el-tabs type="border-card" v-model="tab">
            <template v-if="isMainWorkspace || (!isPushCell && !isPublicCell) || isPageCell">
                <el-tab-pane label="视图" v-if="isMainWorkspace || (!isPushCell && !isPublicCell)" name="common">
                    <el-scrollbar style="height: calc(100vh - 110px)">
                        <common v-if="tab == 'common'" :cell="cell" :graph="graph"></common>
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="数据" v-if="!isTools" name="attrsdata">
                    <el-scrollbar style="height: calc(100vh - 110px)">
                        <attrsdata v-if="tab == 'attrsdata'" :cell="cell" :graph="graph"></attrsdata>
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="事件" v-if="!isTools && !isPageCell" name="listener">
                    <el-scrollbar style="height: calc(100vh - 110px)">
                        <listener v-if="tab == 'listener'" :cell="cell" :graph="graph"></listener>
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane
                    label="子工作空间显示/隐藏"
                    v-if="isMainWorkspace && isPageCell && getWorkspaceList().filter((w) => w.id != w.mainWorkspaceId).length"
                    name="workspace"
                >
                    <el-scrollbar style="height: calc(100vh - 110px)">
                        <workspace :cell="cell" :graph="graph" v-if="tab == 'workspace'"></workspace>
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="动画" v-if="!isPageCell && !isTools" name="animation">
                    <el-scrollbar style="height: calc(100vh - 110px)">
                        <animation :cell="cell" :graph="graph" v-if="tab == 'animation'"></animation>
                    </el-scrollbar>
                </el-tab-pane>
            </template>
            <moon-form-template v-else :offset="0" :span="24" labelWidth="6rem" label-position="left">
                <el-form-item v-if="cell.attrs.bussinessData.pushWorkspaceId" label="透传来源" labelWidth="6rem">
                    <span style="color: #fff">
                        {{ pushWorksapce.name }}
                    </span>
                </el-form-item>
                <div v-if="cell.attrs.bussinessData.isPublic == '1'" style="color: #fff">公共视图不能修改</div>
            </moon-form-template>
        </el-tabs>
    </div>
</template>
<script>
import common from './common.vue';
import attrsdata from './attrsdata.vue';
import listener from './listener.vue';
import workspace from './workspace.vue';
import animation from './animation/index.vue';

import { updateCellDataView } from '@/views/moon-datav/utils';

import { getWorkSpaceById } from '@/service/index.js';
export default {
    inheritAttrs: false,
    name: '',
    props: ['cell', 'graph'],
    inject: ['getTransformPlugin', 'getWorkspace', 'getWorkspaceList', 'pageCellId'],
    components: { common, attrsdata, listener, workspace, animation },
    created() {},
    async mounted() {
        this.title = this.cell.getData().label;
        this.disabled = this.cell.getAttrs()?.config?.lock;
        this.cell.on('change:data', ({ current: { label } }) => {
            if (this.title != label) this.title = label;
        });
        this.cell.on('change:attrs', ({ current }) => {
            this.disabled = current?.config?.lock;
        });
        if (this.cell.attrs.bussinessData.pushWorkspaceId) {
            let { data } = await getWorkSpaceById({ id: this.cell.attrs.bussinessData.pushWorkspaceId });
            this.pushWorksapce = data;
        }
        if (!(this.isMainWorkspace || (!this.isPushCell && !this.isPublicCell))) this.tab = 'attrsdata';
    },
    data() {
        return { tab: 'common', title: '', disabled: false, pushWorksapce: { name: '' } };
    },
    watch: {},
    computed: {
        workspace() {
            return this.getWorkspace();
        },
        isMainWorkspace() {
            return this.workspace.id == this.workspace.mainWorkspaceId;
        },
        isTools() {
            return this.cell.getData().type.indexOf('moon-dv-tool-') != -1;
        },
        isPushCell() {
            return !!this.cell.attrs.bussinessData.pushWorkspaceId;
        },
        isPublicCell() {
            return this.cell.attrs.bussinessData.isPublic == '1';
        },
        isPageCell() {
            return this.cell.id == this.pageCellId;
        }
    },
    methods: {
        onChange(e) {
            this.title = e;
            if (!e) return;
            const data = this.cell.getData();
            data.label = this.title;
            updateCellDataView(this.cell, data);
        },
        onShowDocument() {
            window.open(`#/md-view/${this.cell.getData().type}`);
        },
        onWriteDocument() {
            window.open(`#/doc-create/${this.pageCellId}`);
        }
    }
};
</script>
<style lang="scss" scoped>
.control-pannel {
    .title {
        background: #2e343c;
        color: #bcc9d4;
        text-align: center;
        padding: 5px;
        ::v-deep(.el-input__inner) {
            text-align: center;
        }
    }
    .show-document {
        position: absolute;
        color: #fff;
        top: 50px;
        right: 20px;
        cursor: pointer;
        z-index: 999;
        font-size: 14px;
    }
    &::v-deep(.el-tabs) {
        background: inherit;
        border: 0px solid #dcdfe6;
        .el-tabs__header {
            background-color: #000;
            border-bottom: none;
            .is-active {
                color: #fff;
                background-color: rgba(255, 255, 255, 0.3);
            }
            .el-tabs__item:hover {
                color: #fff;
            }
            .el-tabs__item {
                border: none;
                font-size: 12px;
            }
        }
        .el-tabs__content {
            padding: 5px 0;
        }
        .el-scrollbar__wrap {
            overflow-x: hidden !important;
        }
        .el-collapse-item__header {
            height: 40px;
        }
        .el-tabs--border-card {
            background: inherit;
            border: 0px solid #dcdfe6;
        }
    }
}
</style>

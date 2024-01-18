<template>
    <div class="create-view">
        <div class="workspace-tab">
            <div
                class="tab"
                :class="workspaceId == value.id ? 'active' : ''"
                v-for="(value, index) in workspaceList"
                :key="value.id"
                @click="onTabClick(value)"
            >
                <span class="workspace-name">{{ value.name }}</span>
                <i v-if="value.id != value.mainWorkspaceId" @click.stop="delWorkspace(value, index)" class="el-icon-error del" />
            </div>
            <div v-if="workspaceId" class="tab add" @click="addWorkspace"><i class="el-icon-folder-add" /></div>
        </div>
        <workspace
            v-if="workspaceId"
            ref="workspace"
            :id="workspaceId"
            :projectId="projectId"
            :pageCellId="projectId"
            :key="workspaceId"
        ></workspace>
        <moon-dialog
            class="project-dialog"
            width="500px"
            :visible.sync="visible"
            :title="updateWorkspace.id ? '修改工作空间' : '新增工作空间'"
            append-to-body
        >
            <moon-form-template v-if="visible" :span="24" labelWidth="8rem">
                <el-form-item label="工作空间名称">
                    <el-input v-model="updateWorkspace.name"></el-input>
                </el-form-item>
            </moon-form-template>
            <div class="dialog-button">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="onComfirm">确定</el-button>
            </div>
        </moon-dialog>
    </div>
</template>
<script>
import workspace from './workspace/index.vue';
import { getWorkSpaceListByProjectId, addOrUpdateWorkSpace, delWorkspace, getProjectById } from '@/service/index.js';
export default {
    inheritAttrs: false,
    name: '',
    props: {
        projectId: {
            type: String,
            default: ''
        }
    },
    provide() {
        return { getWorkspaceList: () => this.workspaceList };
    },
    components: {
        workspace
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            visible: false,
            workspaceId: '',
            workspaceList: [],
            updateWorkspace: {
                id: '',
                name: '',
                projectId: ''
            },
            tabClickTime: 0,
            project: {}
        };
    },

    watch: {
        visible() {
            if (!this.visible) {
                // $rest
                this.updateWorkspace = this.$options.data().updateWorkspace;
            }
        }
    },
    computed: {},
    methods: {
        async init() {
            const res = await getWorkSpaceListByProjectId({ id: this.projectId });
            this.workspaceList = res.data;
            if (res.data.length) this.workspaceId = res.data[0].id;
            const { data: project } = await getProjectById({ id: this.projectId });
            this.project = project;
        },
        async addWorkspace() {
            this.visible = true;
        },
        async onComfirm() {
            this.updateWorkspace.projectId = this.projectId;
            let { data: newWorkspace } = await addOrUpdateWorkSpace(this.updateWorkspace);
            // 新增
            if (!this.updateWorkspace.id) {
                this.workspaceList.push(newWorkspace);
            } else {
                // 修改
                let index = -1;
                this.workspaceList.some((v, i) => {
                    if (v.id == this.updateWorkspace.id) {
                        index = i;
                        return true;
                    }
                });
                if (index != -1) this.workspaceList.splice(index, 1, newWorkspace);
            }

            this.visible = false;
        },
        async onTabClick(value) {
            if (this.workspaceId == value.id) {
                const currentTime = new Date().getTime();
                if (currentTime - this.tabClickTime < 500) {
                    this.updateWorkspace = { ...value };
                    this.visible = true;
                }
                this.tabClickTime = currentTime;
            } else {
                if (this.$refs.workspace.loading) return;

                // 判断工作空间是否需要保存
                if (this.$refs.workspace.needSave && this.project.ispublish != '1') {
                    let currentWorkspace = this.workspaceList.find((v) => v.id == this.workspaceId);
                    this.$confirm(`${currentWorkspace.name}修改后尚未保存，是否进行保存！`, '提示', {
                        confirmButtonText: '保存',
                        cancelButtonText: '不保存',
                        type: 'warning',
                        customClass: 'project-messagebox'
                    })
                        .then(async () => {
                            await this.$refs.workspace.saveResult();
                            this.workspaceId = value.id;
                        })
                        .catch(() => {
                            this.workspaceId = value.id;
                        });
                } else this.workspaceId = value.id;
            }
        },
        delWorkspace(value, index) {
            this.$confirm(`请确认是否删除工作空间${value.name}吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'project-messagebox'
            })
                .then(async () => {
                    await delWorkspace(value.id);
                    this.workspaceList.splice(index, 1);
                    if (this.workspaceId == value.id) this.workspaceId = value.mainWorkspaceId;
                    this.$message.success('删除成功!');
                })
                .catch(() => {});
        }
    }
};
</script>

<style lang="scss" scoped>
.create-view {
    height: 100vh;
    .workspace-tab {
        position: absolute;
        display: flex;
        z-index: 999;
        left: 100px;
        .tab {
            background-color: #2e343c;
            color: #fff;
            height: 26px;
            line-height: 26px;
            padding: 0 10px;
            font-size: 12px;
            margin: 2px 5px;
            border-radius: 2px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
            &:hover {
                background-color: #969696;
            }
            &.add {
                font-size: 20px;
                color: rgb(89, 175, 255);
            }
            &.active {
                background-color: #409eff;
                .del {
                    color: rgba(0, 0, 0, 0.6);
                }
            }
            .workspace-name {
                min-width: 2rem;
                margin-right: 4px;
                text-align: center;
            }
            .del {
                font-size: 10px;
                &:hover {
                    transform: scale(1.2);
                }
            }
        }
    }
}
</style>

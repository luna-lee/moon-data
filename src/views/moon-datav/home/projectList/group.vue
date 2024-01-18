<template>
    <moon-scroll class="moon-scroll" :style="{ height: height + 'px' }">
        <div class="group">
            <el-tree
                :current-node-key="currentId"
                :data="groupList"
                :props="{ children: 'children', label: 'name' }"
                highlight-current
                node-key="id"
                default-expand-all
                check-on-click-node
                :expand-on-click-node="false"
                @node-click="onNodeClick"
            >
                <div class="tree-node" slot-scope="{ node, data }">
                    <div class="tree-node-label">{{ node.label }}</div>
                    <div class="tree-node-button" v-if="data.id">
                        <el-button v-show="data.id != 'all'" type="text" icon="el-icon-edit" size="mini" @click.stop="onEdit(data)">
                        </el-button>
                        <el-button
                            v-show="data.id == 'all'"
                            type="text"
                            style="color: #67c23a"
                            :style="data.id == 'all' ? { fontSize: '1.2rem' } : {}"
                            icon="el-icon-circle-plus-outline"
                            size="mini"
                            @click.stop="onAdd(data)"
                        >
                        </el-button>
                        <el-button
                            v-show="data.id != 'all'"
                            type="text"
                            style="color: red"
                            icon="el-icon-delete"
                            size="mini"
                            @click.stop="onRemove(data)"
                        >
                        </el-button>
                    </div>
                </div>
            </el-tree>
            <moon-dialog
                class="project-dialog"
                width="400px"
                :title="editCurrent.id ? '编辑分类' : '新增分类'"
                append-to-body
                :visible.sync="visible"
            >
                <el-input placeholder="请输入内容" v-model="editCurrent.name">
                    <template slot="prepend"> <span style="color: red; margin-right: 3px">*</span>分类名： </template>
                </el-input>
                <div class="dialog-button">
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" @click="onComfirm">确定</el-button>
                </div>
            </moon-dialog>
        </div>
    </moon-scroll>
</template>
<script>
import { getProjectGroup, deleteProjectGroup, addOrUpdateProjectGroup } from '@/service/index.js';
import { flatToTree } from '@/components-global/utils.js';
export default {
    inheritAttrs: false,
    name: '',
    props: {
        height: {
            type: [String, Number],
            default: '0'
        },
        type: {
            type: String,
            require: true
        }
    },
    components: {},
    created() {},
    mounted() {
        this.init();
    },
    data() {
        return {
            currentId: 'all',
            editCurrent: {
                id: '',
                name: '',
                parent: '',
                type: this.type,
                ordernum: '0'
            },
            groupList: [
                {
                    id: 'all',
                    name: '全部',
                    children: [
                        {
                            id: '',
                            name: '未分类'
                        }
                    ]
                }
            ],
            objById: {},
            visible: false
        };
    },
    watch: {
        currentId() {
            this.$emit('node-click', this.currentId);
        }
    },
    computed: {},
    methods: {
        async init() {
            this.currentId = 'all';
            this.editCurrent = this.$options.data.bind(this)().editCurrent;
            this.groupList = this.$options.data.bind(this)().groupList;
            let { data } = await getProjectGroup({ type: this.type });
            let { treeData, objById } = flatToTree(data, 'id', 'parent');
            this.groupList[0].children.push(...treeData);
            this.$emit('group-list', this.groupList[0].children);
        },
        onEdit(data) {
            this.editCurrent = { ...data };
            this.visible = true;
        },
        onAdd(data) {
            this.editCurrent = this.$options.data.bind(this)().editCurrent;
            if (data && data.id != 'all') {
                this.editCurrent.parent = data.id;
            }
            this.visible = true;
        },
        async onRemove(data) {
            await this.$confirm(`确定要删除该分类吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'project-messagebox'
            });
            await deleteProjectGroup(data.id);
            await this.init();
        },
        async onComfirm() {
            if(!this.editCurrent.name){
                this.$message.error('分类名不能为空')
                return
            }
            this.visible = false;
            await addOrUpdateProjectGroup(this.editCurrent);
            // 新增时，更新其他节点的ordernum
            if (!this.editCurrent.id) {
                if (this.objById[this.editCurrent.parent])
                    await Promise.all(
                        this.objById[this.editCurrent.parent].children.map(async (cell, index) => {
                            await addOrUpdateProjectGroup({
                                ...cell,
                                ordernum: index + 1
                            });
                        })
                    );
                else {
                    await Promise.all(
                        this.groupList[0].children.slice(1).map(async (cell, index) => {
                            await addOrUpdateProjectGroup({
                                ...cell,
                                ordernum: index + 1
                            });
                        })
                    );
                }
            }
            await this.init();
        },
        onNodeClick(e) {
            this.currentId = e.id;
        }
    }
};
</script>
<style lang="scss" scoped>
.moon-scroll {
    padding-bottom: 20px;
    background-color: rgba(0, 0, 0, 0.5);
}
.group {
    padding: 10px;
    width: 350px;
    box-sizing: border-box;
    .el-tree {
        background-color: transparent;
        color: #fff;
        .tree-node {
            display: flex;
            align-items: center;
            width: calc(100% - 30px);
            justify-content: space-between;
            .tree-node-label {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .tree-node-button {
                width: 4rem;
            }
        }
        ::v-deep(.el-tree-node) {
            &.is-current > .el-tree-node__content {
                background-color: transparent;
                background-image: url(https://www.1724956493.top/files/5ad52e90e04111ed91b4f7437d34c747/nav-menu-img.png);
                background-repeat: round;
            }
            .el-tree-node__content {
                background-color: transparent;
                height: 50px;
                &:hover {
                    background-color: transparent;
                    // color: rgb(13, 81, 183);
                }
            }
        }
    }
}
</style>

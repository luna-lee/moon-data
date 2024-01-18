<template>
    <div class="project-list">
        <div class="group">
            <group :height="height" :type="type" @node-click="onNodeClick" @group-list="getGroupList"></group>
        </div>
        <div class="content">
            <div class="top">
                <div class="new-project" @click="onAdd">
                    <img src="/static/img/new-project.png" width="100px" height="50px" alt="" />
                    新增{{ titleName }}
                </div>
                <el-input :placeholder="'搜索' + titleName" prefix-icon="el-icon-search" v-model="searchName"></el-input>
            </div>
            <moon-table-pagination
                ref="table"
                key="second"
                :condition="condition"
                :dataInterface="getProjectList"
                :responseType="{ list: 'data.list', totalCount: 'data.total' }"
                :paginationPosition="['top', 'right']"
                layout="total,  prev, pager, next "
                prevText=""
                nextText=""
                style="width: 100%"
            >
                <template #list="{ listData }">
                    <moon-scroll :style="{ height: height - 50 + 'px' }">
                        <div class="list">
                            <div class="item" v-for="(item, index) in listData" :key="index">
                                <div class="top">
                                    <!-- :preview-src-list="[item.icon]" -->
                                    <el-image style="width: 100%; height: 100%" :src="item.icon">
                                        <div slot="placeholder" class="placeholder">加载中<span class="dot">...</span></div>
                                    </el-image>
                                    <el-tag
                                        v-if="item.ispublish == '1'"
                                        type="success"
                                        effect="dark"
                                        style="position: absolute; right: -10px; top: -10px"
                                    >
                                        已发布
                                    </el-tag>
                                </div>
                                <div class="bottom">
                                    <div>{{ item.name }}</div>
                                    <div class="options">
                                        <div class="btn" @click="toDocument(item)"><i class="el-icon-document" title="文档"></i></div>
                                        <div class="btn" style="margin-left: 5px" @click="toUpdate(item)" title="编辑">
                                            <i class="el-icon-edit-outline"></i>
                                        </div>
                                        <moon-dropdown style="margin-left: 5px">
                                            <el-button type="text">更多<i class="el-icon-arrow-down"></i></el-button>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item @click="toEdit(item.id)">
                                                    <el-button type="text">
                                                        <i class="el-icon-edit-outline"></i>
                                                        {{ item.ispublish != '1' ? '设计' : '查看' }}
                                                    </el-button>
                                                </el-dropdown-item>
                                                <el-dropdown-item @click="toPreview(item.id)">
                                                    <el-button type="text" class="">
                                                        <i class="el-icon-view"></i>
                                                        {{ item.ispublish != '1' ? '预览' : '浏览' }}
                                                    </el-button>
                                                </el-dropdown-item>
                                                <el-dropdown-item @click="onDeleteFrom(item.id)" v-show="item.ispublish != '1'">
                                                    <el-button type="text">
                                                        <i class="el-icon-delete"></i>
                                                        删除
                                                    </el-button>
                                                </el-dropdown-item>
                                                <el-dropdown-item @click="onPublish(item)" v-show="item.ispublish != '1'">
                                                    <el-button type="text">
                                                        <i class="el-icon-delete"></i>
                                                        发布
                                                    </el-button>
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </moon-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </moon-scroll>
                </template>
            </moon-table-pagination>
        </div>
        <moon-dialog
            class="project-dialog"
            width="400px"
            :visible.sync="visible"
            :title="(form.id ? '修改' : '新增') + titleName"
            append-to-body
        >
            <moon-form-template v-if="visible" ref="form" :span="24" :model="form" labelWidth="4rem" :rules="rules">
                <el-form-item label="名称" required prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="图片" required prop="icon">
                    <span style="color: #409eff; cursor: pointer" @click="toSourceMag" slot="label">图片</span>
                    <el-input v-model="form.icon" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="form.groupId" type="textarea" popper-class="project-select">
                        <el-tree
                            style="margin-bottom: 20px"
                            :data="groupList"
                            :props="{ children: 'children', label: 'name' }"
                            highlight-current
                            node-key="id"
                            default-expand-all
                            check-on-click-node
                        >
                            <div slot-scope="{ data }">
                                <el-option :label="data.name" :value="data.id"> </el-option>
                            </div>
                        </el-tree>
                    </el-select>
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
import { addOrUpdateProject, getProjectList, delProject } from '@/service/index.js';
import group from './group.vue';
export default {
    inheritAttrs: false,
    name: '',
    props: {
        type: {
            type: String,
            require: true
        },
        height: {
            type: [String, Number],
            default: 0
        }
    },
    created() {},
    mounted() {},
    components: { group },
    data() {
        return {
            getProjectList,
            visible: false,
            searchName: '',
            groupList: [],
            form: {
                id: '',
                name: '',
                mainWorkspaceId: '',
                icon: '',
                type: this.type,
                groupId: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请填写名称',
                        trigger: 'blur'
                    }
                ],
                icon: [{ required: true, message: '请填图片地址', trigger: 'blur' }]
            },
            condition: { type: this.type, groupId: undefined, name: '' }
        };
    },
    watch: {
        searchName() {
            this.condition.name = this.searchName;
        }
    },
    computed: {
        titleName() {
            return this.type == 'project' ? '项目' : '组件';
        }
    },
    methods: {
        toSourceMag() {
            window.open('https://www.1724956493.top/moon-datav/#/moon-datav/preivew?id=d3268170c84811ed8b5e8d50fc002388');
        },
        getGroupList(list) {
            this.groupList = list;
        },
        toDocument(item) {
            window.open(`#/md-view/moon-dv-id-${item.id}`);
        },
        toEdit(id) {
            this.$router.push({ path: '/moon-datav/create-view', query: { id } });
        },
        async onPublish(item) {
            await this.$confirm(`确定发布该${this.titleName}吗?发布后将不能被修改和删除！`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'project-messagebox'
            });
            await addOrUpdateProject({ ...item, ispublish: '1' });
            this.$refs.table.getDataList();
            this.$message.success('发布成功!');
        },
        toPreview(id) {
            window.open(`#/moon-datav/preivew?id=${id}`);
        },
        onDeleteFrom(id) {
            this.$confirm(`请确认是否删除该${this.titleName}吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'project-messagebox'
            })
                .then(async () => {
                    await delProject(id);
                    this.$refs.table.getDataList();
                    this.$message.success('删除成功!');
                })
                .catch(() => {});
        },
        onAdd() {
            this.visible = true;
            this.form = this.$options.data.bind(this)().form;
            this.form.groupId = this.condition.groupId;
        },
        toUpdate(item) {
            this.visible = true;
            this.form = item;
        },
        async onComfirm() {
            let { flag, fields } = this.$refs.form.validate_cb();
            if (!flag) {
                this.$message.error(fields[Object.keys(fields)[0]][0].message);
                return;
            }
            this.visible = false;
            const { data } = await addOrUpdateProject(this.form);
            this.$refs.table.getDataList();
        },
        onExit() {
            this.$router.replace({ path: '/' });
        },
        onNodeClick(id) {
            id = id == 'all' ? undefined : id;
            this.condition.groupId = id;
        }
    }
};
</script>
<style lang="scss" scoped>
.project-list {
    display: flex;
    .top {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        .new-project {
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 20px;
            border: 1px solid #39414d;
            background: #22272e;
        }
        .el-input {
            width: 200px;
            margin-left: 20px;
            ::v-deep(.el-input__inner) {
                background: #454545;
                color: #fff;
                border: transparent;
            }
        }
    }
    ::v-deep(.pagination) {
        height: 50px;
        .btn-prev {
            background: transparent;
            color: #606266;
        }
        .btn-next {
            background: transparent;
            color: #606266;
        }
        li {
            background: transparent;
            color: #606266;
            &.active {
                color: #409eff;
            }
        }
    }
    .content {
        margin-top: 10px;
        margin-left: 20px;
        flex: 1;
        position: relative;
        .list {
            display: flex;
            flex-wrap: wrap;
            color: #fff;
            padding: 20px 0;
            .item {
                width: 210px;
                height: 200px;
                margin-right: 15px;
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background-color: #454545;
                border-radius: 8px;
                padding: 10px 10px 0 10px;
                .top {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    flex: 1;
                }

                .bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .btn {
                        color: #b7bdc9;
                        cursor: pointer;
                    }

                    .options {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                }
            }
        }
    }
}
</style>

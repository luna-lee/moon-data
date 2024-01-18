<template>
    <div class="moon-datav">
        <div v-resize="onTopResize">
            <div style="color: aliceblue; position: absolute; right: 0" @click="onExit">
                <el-tooltip effect="dark" :content="$store.state.user.userInfo.userName" placement="bottom">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="small"></el-avatar>
                </el-tooltip>
            </div>
            <img style="width: 100%; height: 200px" src="/static/img/nav-img.png" />
            <moon-menu
                style="margin-top: -5px"
                background-color="#2e343c"
                hoverBgColor="rgba(17, 17, 17,0.5)"
                text-color="#fff"
                active-text-color="#fff"
                activeBgColor="#111111"
                default-active="1"
                :menuList="navList"
                @select="onMenuChange"
                :itemStyle="{ border: 'none', padding: '10px 100px', fontSize: '15px' }"
                mode="horizontal"
            >
                <template #icon="{ node }">
                    <i v-if="node.icon" :class="node.icon" style="margin-right: 10px"></i>
                </template>
            </moon-menu>
        </div>
        <div>
            <projectList :height="contentHeight" v-if="activeName == 1" key="project" type="project"></projectList>
            <projectList :height="contentHeight" v-if="activeName == 2" key="component" type="component"></projectList>
        </div>
    </div>
</template>
<script>
import projectList from './projectList/index.vue';
import { resize } from '@/components-global/directives.js';
export default {
    inheritAttrs: false,
    name: 'home',
    props: {},
    created() {},
    components: {
        projectList
    },
    mounted() {},
    directives: { resize },
    data() {
        return {
            contentHeight: 0,
            activeName: '1',
            navList: [
                {
                    id: '1',
                    name: '项目',
                    icon: 'el-icon-monitor'
                },
                {
                    id: '2',
                    name: '组件',
                    icon: 'el-icon-orange'
                }
            ]
        };
    },
    watch: {},
    computed: {},
    methods: {
        onExit() {
            this.$router.replace({ path: '/' });
        },
        onMenuChange(e) {
            this.activeName = e;
        },
        onTopResize(el) {
            let bodyHeight = document.body.clientHeight;
            this.contentHeight = bodyHeight - el.clientHeight;
        }
    }
};
</script>

<style lang="scss">
.el-dropdown-menu {
    border: none;
    background-color: #4f4f4f;

    ::v-deep(.popper__arrow) {
        &::after {
            top: 1px;
            margin-left: -6px;
            border-top-width: 0;
            border-bottom-color: #4f4f4f;
        }
    }

    .el-button--text {
        border-color: transparent;
        color: #fff;
        background: 0 0;
        padding-left: 0;
        padding-right: 0;
    }

    .popper__arrow {
        border-bottom-color: #4f4f4f !important;

        &::after {
            top: 1px;
            margin-left: -6px;
            border-top-width: 0;
            border-bottom-color: #4f4f4f !important;
        }
    }

    .el-dropdown-menu__item:not(.is-disabled):hover {
        background-color: #6b6b6b;
    }
}
</style>
<style lang="scss" scoped>
.moon-datav {
    height: 100vh;
    background-color: #292929;
    .nav {
        margin-bottom: 20px;
        padding-left: 10px;
        color: #fff;
        display: flex;
        background-color: rgb(46, 52, 60);
        .item {
            padding: 5px 10px;
            cursor: pointer;
            &.active {
                background-color: #409eff;
            }
        }
    }
}
</style>

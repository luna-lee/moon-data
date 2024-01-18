<template>
    <el-dialog v-bind="Object.assign(defaultAttrs, $attrs)" v-on="$listeners">
        <template #title>
            <div class="title">
                <slot name="title">
                    {{ title }}
                </slot>
            </div>
        </template>
        <slot></slot>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </el-dialog>
</template>
<script>
export default {
    inheritAttrs: false,
    name: 'MoonDialog',
    props: {
        title: { type: String, default: '提示' }
    },
    components: {},
    created() {},
    mounted() {},
    data() {
        return {
            defaultAttrs: {
                top: '15vh'
            }
        };
    }
};
</script>
<style lang="less" scoped>
@title_color: black;
@title_background: #f8f8f8;
::v-deep(.el-dialog ){
    .el-dialog__header {
        background: @title_background;
        padding: 12px 20px 12px;
        .title {
            color: @title_color;
            font-size: 16px;
        }
        .el-dialog__headerbtn {
            top: 15px;
            .el-dialog__close {
                color: @title_color;
            }
        }
    }
    .el-dialog__body {
        padding: 10px 20px;
    }
    .buttonGroup {
        margin-top: 20px;
        text-align: right;
    }
}
</style>

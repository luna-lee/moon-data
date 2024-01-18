<template>
    <div class="moon-scroll">
        <slot></slot>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: 'moon-scroll',
    props: {},
    components: {},
    created() {},
    mounted() {},
    data() {
        return {};
    },
    watch: {},
    computed: {},
    methods: {}
};
</script>
<style lang="scss" scoped>
.moon-scroll {
    overflow: auto;
    /* 整个滚动条 */
    &::-webkit-scrollbar {
        width: 0px;
        height: 10px;
    }

    /* 滚动条上的滚动滑块 */
    &::-webkit-scrollbar-thumb {
        background-color: rgba(204, 204, 204, 0.8);
        border-radius: 32px;
    }

    /* 滚动条轨道 */
    &::-webkit-scrollbar-track {
        background-color: #dbeffd;
        border-radius: 32px;
    }
}
</style>

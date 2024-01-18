<template>
    <div class="moon-dv-echarts-group">
        <slot></slot>
        <moon-dv-echarts v-for="(option, index) in options" :key="index" :option="option"></moon-dv-echarts>
        <slot name="last"></slot>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: 'moon-dv-echarts-group',
    props: {
        options: {
            type: Array,
            default: () => []
        }
    },
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
.moon-dv-echarts-group {
    height: 100%;
    width: 100%;
    display: flex;
}
</style>

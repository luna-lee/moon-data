<template>
    <div class="moon-dv-container">
        <slot></slot>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: 'moon-dv-container',
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
.moon-dv-container {
    height: 100%;
    width: 100%;
}
</style>

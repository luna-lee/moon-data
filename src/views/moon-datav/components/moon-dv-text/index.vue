<template>
    <div class="moon-dv-text">
        <slot name="prefix"></slot>
        {{ value }}
        <slot name="suffix"></slot>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: 'moon-dv-text',
    props: {
        value: {
            type: String,
            default: ''
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
.moon-dv-text {
    width: 100%;
    height: 100%;
}
</style>

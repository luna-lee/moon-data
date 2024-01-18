<template>
    <div class="moon-dv-div" v-on="$listeners">
        <slot></slot>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: 'moon-dv-div',
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
.moon-dv-div {
    height: 100%;
    width: 100%;
}
</style>

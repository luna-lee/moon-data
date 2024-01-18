<template>
    <div class="moon-if-show" v-if="compile" v-show="show">
        <slot></slot>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: 'MoonIfShow',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        delay: {
            type: Number,
            defatule: 0
        }
    },
    components: {},
    watch: {
        show: {
            handler(val) {
                if (val && !this.compile) {
                    setTimeout(() => {
                        this.compile = true;
                    }, this.delay);
                }
            },
            immediate: true
        }
    },
    created() {},
    computed: {},
    mounted() {},
    data() {
        return { compile: false };
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
.moon-if-show {
    width: 100%;
    height: 100%;
}
</style>

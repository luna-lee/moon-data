<template>
    <div class="moon-dv-tool-line">
        <div :class="['line-' + direction]"></div>
        <div v-if="isGraph" :class="['value-' + direction]">{{ num }}</div>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: 'moon-dv-tool-line',
    inject: ['getNode', 'getGraph', 'pageCellId'],
    props: {
        direction: {
            type: String,
            default: 'x'
        }
    },
    components: {},
    created() {},
    mounted() {
        if (this.getGraph().getCellById(this.pageCellId)) {
            this.isGraph = true;
        }
        const node = this.getNode();
        this.init();
        node.on('change:position', () => {
            this.init();
        });
    },
    data() {
        return {
            isGraph: false,
            num: 0
        };
    },
    watch: {},
    computed: {},
    methods: {
        init() {
            const { x, y } = this.getNode().getPosition();
            this.num = this.direction == 'x' ? Math.round(y) : Math.round(x);
        }
    }
};
</script>
<style lang="scss" scoped>
.moon-dv-tool-line {
    width: 100%;
    height: 100%;
    .line-x {
        width: 100%;
        height: 1px;
        border-top: 1px solid red;
        box-sizing: border-box;
    }
    .line-y {
        width: 1px;
        height: 100%;
        border-left: 1px solid red;
        box-sizing: border-box;
    }
    .value-x {
        color: red;
        position: absolute;
        top: -10px;
    }
    .value-y {
        color: red;
        position: absolute;
        left: 10px;
        top: 0px;
        transform: rotate(90deg);
        transform-origin: left top;
    }
}
</style>

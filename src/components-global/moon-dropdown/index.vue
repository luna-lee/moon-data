<script>
import { getUUID } from '../utils';
export default {
    inheritAttrs: false,
    name: 'MoonDropdown',
    props: {},
    components: {},
    created() {},
    mounted() {
        this.renderCell();
    },
    data() {
        return {
            defaultProps: {
                trigger: 'click'
            },
            commandMap: {}
        };
    },
    render() {
        return (
            <el-dropdown
                {...{
                    attrs: { ...this.defaultProps, ...this.$attrs },
                    on: { command: this.handleCommand, ...this.$listeners }
                }}
            >
                {this.$slots.default}
                {this.renderCell()}
            </el-dropdown>
        );
    },
    watch: {},
    computed: {},
    methods: {
        renderCell() {
            if (!this.$slots.dropdown) return [];
            this.$slots.dropdown[0].componentOptions.children.forEach((vnode) => {
                if (!vnode.componentOptions.propsData.command) vnode.componentOptions.propsData.command = getUUID();
                if (vnode.componentOptions?.listeners?.click) this.commandMap[vnode.componentOptions.propsData.command] = vnode.componentOptions.listeners.click;
            });
            return this.$slots.dropdown;
        },
        handleCommand(command) {
            this.commandMap[command]?.();
        }
    }
};
</script>
<style lang="less" scoped></style>

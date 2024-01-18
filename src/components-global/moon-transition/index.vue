<script>
export default {
    inheritAttrs: false,
    name: 'MoonTransition',
    props: {
        name: {
            type: String,
            default: ''
        },
        mode: {
            type: String,
            default: 'out-in'
        }
    },
    components: {},
    created() {},
    mounted() {},
    render() {
        const attrs = { ...this.$attrs };
        // 有进无出时 设置出的默认值
        if (attrs['enter-active-class'] && attrs['enter-active-class'].indexOf('animate__') != -1) {
            attrs['enter-active-class'] = 'animate__animated ' + attrs['enter-active-class'];
            if (!attrs['leave-active-class']) {
                attrs['leave-active-class'] = 'default-leave-active-class';
            }
        }
        if (attrs['leave-active-class'] && attrs['leave-active-class'].indexOf('animate__') != -1) {
            attrs['leave-active-class'] = 'animate__animated ' + attrs['leave-active-class'];
        }
        let useTransition = Object.keys(attrs).some((key) => key.indexOf('class') != -1) || this.name;
        return useTransition ? (
            <transition name={this.name} mode={this.mode} appear {...{ attrs: { ...attrs }, on: { ...this.$listeners } }}>
                {this.$slots.default}
            </transition>
        ) : (
            this.$slots.default
        );
    },
    data() {
        return {};
    },
    watch: {},
    computed: {},
    methods: {}
};
</script>
<style lang="less" scoped>
// 默认离开样式
.default-leave-active-class {
    display: none;
}
/* moon-fade */
.moon-fade-leave-active,
.moon-fade-enter-active {
    transition: all 0.5s;
}

.moon-fade-enter {
    opacity: 0;
    transform: translateX(-30px);
}

.moon-fade-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
.moon-slide-enter,
.moon-slide-leave-to {
}

.moon-slide-leave,
.moon-slide-enter-to {
}
.moon-slide-enter-active {
    animation: slide-in 0.5s ease-out;
}
.moon-slide-leave-active {
    animation: slide-out 0.5s ease-in;
}
@keyframes slide-in {
    from {
        transform: translateX(-150px);
        width: 0px;
    }
    to {
        transform: translateX(0px);
    }
}
@keyframes slide-out {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-150px);
        width: 0px;
    }
}
</style>

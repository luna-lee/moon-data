<template>
    <div class="moon-dv-page" ref="page">
        <slot></slot>
    </div>
</template>
<script>
import { addResizeListener } from '@/components-global/libs/resize-event.js';
export default {
    inheritAttrs: false,
    name: 'moon-dv-page',
    inject: {
        getPage: {
            from: 'getPage',
            default: null
        }
    },
    props: {},
    components: {},
    created() {},
    mounted() {
        this.getPage && this.windowScale();
    },
    data() {
        return {};
    },
    watch: {},
    computed: {},
    methods: {
        windowScale() {
            const page = this.getPage();
            if (!page.data.attrs.screamscale) {
                return;
            }
            let _this = this;
            let parent = null;
            function setScale() {
                const pageDom = _this.$refs.page;
                //查找父节点可视区域不为0的节点，并依据该节点的可视区域进行等比缩放
                parent = pageDom.parentNode;
                while (parent && (parent.clientHeight == 0 || parent.clientWidth == 0)) {
                    parent = parent.parentNode;
                }
                if (parent == document.body) parent = document.documentElement;
                const pageWidth = page.size.width;
                const pageHeight = page.size.height;
                pageDom.style.width = pageWidth + 'px';
                pageDom.style.height = pageHeight + 'px';
                pageDom.style.transformOrigin = 'left top';
                pageDom.style.overflow = 'hidden';
                const { clientWidth, clientHeight } = parent;
                const scaleX = clientWidth / parseInt(pageWidth);
                const scaleY = clientHeight / parseInt(pageHeight);
                pageDom.style.transform = `scale(${scaleX},${scaleY})`;
            }
            setScale();
            // window.onresize = setScale;
            addResizeListener(parent, setScale);
        }
    }
};
</script>
<style lang="scss" scoped>
.moon-dv-page {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>

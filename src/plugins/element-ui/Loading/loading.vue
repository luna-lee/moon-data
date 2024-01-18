<template>
    <transition name="el-loading-fade" @after-leave="handleAfterLeave">
        <div v-resize="resize" v-show="visible" class="el-loading-mask" :style="{ backgroundColor: background || '' }" :class="[customClass, { 'is-fullscreen': fullscreen }]">
            <div class="el-loading-spinner" :style="styleCss">
                <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none" />
                </svg>
                <i v-else :class="spinner"></i>
                <p v-if="text" class="el-loading-text">{{ text }}</p>
            </div>
        </div>
    </transition>
</template>

<script>
import { resize } from '@/components-global/directives.js';
export default {
    data() {
        return {
            text: null,
            spinner: null,
            background: null,
            fullscreen: true,
            visible: false,
            customClass: '',
            styleCss: {
                top: '30%'
            }
        };
    },
    directives: { resize },
    mounted() {
        // 若最外层已经有了loading 则不在显示
        setTimeout(() => {
            let el = this.$el;
            let markNode = document.querySelectorAll('.el-loading-mask');
            for (let i = 0, len = markNode.length; i < len; i++) {
                if (markNode[i] != el && markNode[i].offsetWidth && markNode[i].offsetHeight && markNode[i].parentNode.contains(el.parentNode)) {
                    this.visible = false;
                }
            }
        }, 100);
    },
    methods: {
        handleAfterLeave() {
            this.$emit('after-leave');
        },
        setText(text) {
            this.text = text;
        },
        resize(el) {
            let targetClientHeight = el.clientHeight;
            let bodyHeight = document.body.clientHeight;
            //固定 top 为target或body的 30%。当target的高度超出body的高度时 取body的高度，否则当target的2倍高度大于body时取target高度, 否则为50%
            if (targetClientHeight > bodyHeight) this.styleCss.top = bodyHeight * 0.3 + 'px';
            else if (targetClientHeight * 2 > bodyHeight) this.styleCss.top = targetClientHeight * 0.3 + 'px';
            else this.styleCss.top = '50%';
        }
    }
};
</script>
<style lang="scss" scoped>
.el-loading-mask {
    width: 100%;
}
</style>

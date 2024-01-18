<template>
    <div class="moon-video-player" ref="video"></div>
</template>
<script>
import DPlayer from 'dplayer';
export default {
    inheritAttrs: false,
    name: 'moon-video-player',
    props: {},
    components: {},
    created() {},
    mounted() {
        this.init();
    },
    data() {
        return {};
    },
    watch: {},
    computed: {},
    methods: {
        init() {
            const dp = new DPlayer({
                container: this.$refs.video,
                ...this.$attrs
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.moon-video-player {
    width: 100%;
    height: 100%;
}
</style>

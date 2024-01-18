<template>
    <moon-monaco-editor v-bind="bindAttrs" v-on="$listeners" trigger="blur"></moon-monaco-editor>
</template>
<script>
export default {
    inheritAttrs: false,
    name: '',
    props: {},
    components: {},
    created() {},
    mounted() {},
    data() {
        return {};
    },
    watch: {},
    computed: {
        bindAttrs() {
            return {
                ...this.$attrs,
                jsHighlightCode: [
                    [/echarts/, { token: 'type.identifier' }],
                    [/axios/, { token: 'type.identifier' }],
                    [/vm/, { token: 'type.identifier' }],
                    [/\_/, { token: 'type.identifier' }],
                    [/globalVar_[\w\$]*/, { token: 'type.identifier' }],
                    [/workspaceVar_[\w\$]*/, { token: 'type.identifier' }]
                ],
                fullscreenWidth: '60%'
            };
        }
    },
    methods: {}
};
</script>
<style lang="scss" scoped></style>

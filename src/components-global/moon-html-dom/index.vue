<script>
import Vue from 'vue';
export default {
    inheritAttrs: false,
    name: 'MoonHtmlDom',
    props: ['htmlDom', 'entity'],
    data() {
        return { placeholder: '' };
    },
    render() {
        const template = `<div>${this.htmlDom.replace(/\$\.?/g, 'this.entity.').replace(/<\//g, '{{placeholder}}</')}</div>`;
        return Vue.compile(template).render.apply(this, arguments);
    },
    renderError(h, err) {
        return h('div', { style: { color: 'red' } }, err.track);
    }
};
</script>
<style lang="scss" scoped></style>

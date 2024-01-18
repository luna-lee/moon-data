<!-- <template>
    <component :is="name" v-bind="bindData" v-on="bindOn">
        <slot />
    </component>
</template> -->

<script>
import Vue from 'vue';
import { ExecFunctionStr } from '@/views/moon-datav/utils';
import preview from '@/views/moon-datav/preview/index.vue';
export default {
    inheritAttrs: false,
    name: 'moon-dv-custom',
    props: ['name', 'globalVar', 'bindAttrs', 'bindOnStr'],
    components: { preview },
    created() {},
    render(h) {
        const slotDom = (this.inner_bindAttrs.slotDom || '').replace(/(?<=>)\s+(?=<)/gm, '');
        // Vue.compile div 只能单层
        // loading结束后渲染组件
        let templateDom = '<div></div>';
        if (this.name && !this.loading) {
            if (this.name.startsWith('moon-dv-id-')) {
                // preview 继承传入的class和style，再覆盖自定义组件样式是，class中的同名样式需要用!important进行覆盖，也可以直接写style进行覆盖
                const projectId = this.name.replace('moon-dv-id-', '');
                //  prettier-ignore
                templateDom = `
                <div>
                    <preview  className="${this.$parent.$el.className}" :styleObj="bindData.style||{}" projectId="${projectId}" height="100%" v-bind="bindData" v-on='bindOn'>
                        ${slotDom}
                    </preview>
                </div>
                `;
            } else {
                let CustomHtmlElementName = this.name == 'div' ? 'moon-dv-div' : this.name;
                templateDom = `<${CustomHtmlElementName} v-bind='bindData' v-on='bindOn'>
                                    ${slotDom}
                                    <slot />
                        </${CustomHtmlElementName}>
                              `;
            }
        }
        return Vue.compile(templateDom).render.apply(this, arguments);
    },
    async mounted() {
        this.loading = true;
        await this.excEvalFunction();
        this.setWatch();
        try {
            if (this.bindOnStr) this.bindOn = await ExecFunctionStr(this.globalVar, this, this.bindOnStr);
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    },
    data() {
        return { domAttrs: {}, bindOn: {}, loading: true };
    },
    watch: {},
    computed: {
        inner_bindAttrs() {
            // style 合并
            let style = { ...(this.bindAttrs?.style || {}), ...(this.domAttrs?.style || {}) };
            return { ...this.bindAttrs, ...this.domAttrs, style };
        },
        bindData() {
            let { slotDom, propsFunctionText, ...attts } = this.inner_bindAttrs;
            return attts;
        },
        propsFunctionText() {
            return this.bindAttrs.propsFunctionText;
        }
    },
    methods: {
        setWatch() {
            if (!this.propsFunctionText) return;
            const keys = Object.keys(this.globalVar);
            const watchKeys = keys.filter((key) => {
                //找到排除赋值语句，并替换掉，再判断是否包含key,避免将方法中的赋值语句也视作依赖
                const reg = new RegExp(`${key}[\\w\\d.]*[^!><=]?(?=(=[^=]))`, 'g');
                let str = this.propsFunctionText.replace(reg, '');
                return str.indexOf(key) != -1;
            });
            if (watchKeys.length) {
                this.$watch(
                    function () {
                        return watchKeys.map((key) => this.globalVar[key]);
                    },
                    async () => {
                        this.excEvalFunction();
                    },
                    { deep: true }
                );
            }
        },
        async excEvalFunction() {
            if (this.propsFunctionText) {
                const globalVar = this.globalVar;
                this.domAttrs = await ExecFunctionStr(this.globalVar, this, this.propsFunctionText);
            } else {
                this.domAttrs = {};
            }
        }
    }
};
</script>
<style lang="scss" scoped></style>

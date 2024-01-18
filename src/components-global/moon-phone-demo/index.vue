<template>
    <div class="moon-phone-demo">
        <iframe class="iframe" scrolling="auto" frameborder="0" :src="src" :srcdoc="htmlDom" marginwidth="0" marginheight="0"></iframe>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: 'MoonPhoneDemo',
    props: {
        src: {
            type: String
        },
        srcdoc: {
            type: String
        }
    },
    components: {},
    created() {},
    mounted() {},
    data() {
        return {};
    },
    watch: {},
    computed: {
        htmlDom() {
            return this.srcdoc
                ? `
        <!DOCTYPE html>
        <html lang="zh-CN">
	    <head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport"
			content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <style type="text/css">
            body,html{
                margin:0;
                padding:0;
                user-select: none;
                width: 100%;
                height: 100%;
                font-size: 14px;
            }
            div{
                line-height: 1.8;
            }
            .head {
                height: 44px;
                padding: 7px 3px;
                overflow: hidden;
                box-sizing: border-box;
                z-index: 998;
                color: #fff;
                background-color: #000;
                transition-property: all;
                text-align: center;
                background-color: rgb(27, 96, 198);
                color: rgb(255, 255, 255);
                font-size: 16px;
                opacity: 1;
            }
        </style>
	    </head>
	    <body>
            <div class="head">
                 标题栏
            </div>
            <div id="app">
                </div>
            <script src="https://cdn.jsdelivr.net/npm/vue@2.7.10/dist/vue.js"><` +
                      '/script>' +
                      `
            <script>
            //console.log(Vue)
                new Vue({
                    el:"#app",
                    data() {
                        return { placeholder: '',entity:{} };
                    },
                    render(createElement) {
                        const template = \`<div style="margin-top:10px">
                            ${this.srcdoc.replace(/\$\.?/g, 'this.entity.').replace(/<\//g, '{{placeholder}}</').replace(/\./g, '?.')}
                            </div>\`;
                        return Vue.compile(template).render.apply(this, arguments)
                    }
                })
                <` +
                      '/script>' +
                      `
        </body>
        </html>
`
                : undefined;
        }
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
.moon-phone-demo {
    font-size: 16px;
    background-color: #fff;
    width: 375px;
    height: 667px;
    background-image: url('./iPhone13.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 30px;
    padding: 48px 13px 25px;
    .iframe {
        height: 100%;
        width: 100%;
    }
}
</style>

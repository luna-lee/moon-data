<template>
    <div class="moon-monaco-editor" v-resize="handolerResize" ref="box">
        <div ref="monaco">
            <div v-show="isFullScreen" class="monaco-fullscreen-move-left-border" ref="leftborder"></div>
            <i v-if="isFullScreen" class="el-icon-rank btn-fullscreen" title="还原" @click="minEditor"></i>
            <i v-else class="el-icon-full-screen btn-fullscreen" title="全屏" @click="maxEditor"></i>
            <i v-if="trigger == 'blur'" class="el-icon-position btn-blur" title="提交"></i>

            <!-- <i class="el-icon-tickets fromat-code" title="格式化" @click="formatData"></i> -->
        </div>
    </div>
</template>
<script>
import { resize } from '../directives.js';

import * as monaco from 'monaco-editor';
import { debounce } from 'lodash';
import beautify from 'js-beautify';
import { equalsString } from '../utils';
import { language } from 'monaco-editor/esm/vs/basic-languages/javascript/javascript.js';
export default {
    inheritAttrs: false,
    name: 'MoonMonacoEditor',
    directives: { resize },
    props: {
        value: {
            type: String,
            default: ''
        },
        mode: {
            type: Object,
            default() {
                return {};
            }
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        jsHighlightCode: {
            type: Array,
            default: () => [] // [[/curl/, { token: 'type.identifier' }]]
        },
        fullscreenWidth: {
            type: String,
            default: '100%'
        },
        trigger: {
            type: String,
            default: 'immediate' //返回输入值触发方式。immediate/blur,
        }
    },
    components: {},
    created() {},
    mounted() {
        // 防止开发过程中由于bug导致页面缓存遗留
        let domList = document.getElementsByClassName('moon-monaco-editor-fullscreen');
        for (let i = 0; i < domList.length; i++) {
            domList[i].remove();
        }
        if (this.inner_mode.language == 'javascript')
            monaco.languages.setMonarchTokensProvider('javascript', {
                ...language,
                // ignoreCase: true, // 忽略大小写
                tokenizer: {
                    ...language.tokenizer,
                    root: [...this.jsHighlightCode, ...language.tokenizer.root]
                }
            });
        const debounceGetValue = debounce(this.getValue, 300);
        this.monacoInstance = monaco.editor.create(this.$refs.monaco, this.inner_mode);

        // this.monacoInstance.onDidContentSizeChange();
        if (this.trigger == 'immediate') this.monacoInstance.onDidChangeModelContent(debounceGetValue);
        if (this.trigger == 'blur')
            this.monacoInstance.onDidBlurEditorText(() => {
                this.getValue();
            });
        this.setValue();
        this.monacoInstance.addAction({
            id: 'format-code',
            label: 'format-code',
            keybindings: [monaco.KeyMod.chord(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KEY_F)],
            run: this.formatData
        });
        if (this.readOnly) this.changeOptions({ readOnly: this.readOnly });
        this.moveBorder();
    },
    data() {
        return {
            inner_value: '',
            monacoInstance: null,
            isFullScreen: false,
            defaultMode: {
                value: '',
                language: 'javascript',
                autoIndent: true,
                theme: 'vs-dark'
            }
        };
    },
    watch: {
        value() {
            this.setValue();
        },
        readOnly() {
            this.changeOptions({ readOnly: this.readOnly });
        },
        inner_mode: {
            handler() {
                monaco.editor.setModelLanguage(this.monacoInstance.getModel(), this.inner_mode.language);
            },
            deep: true
        }
    },
    computed: {
        inner_mode() {
            return { ...this.defaultMode, ...this.mode };
        },
        needUpdate() {
            return !equalsString(this.inner_value, this.value);
        }
    },
    methods: {
        moveBorder() {
            let disX = 0; //鼠标按下时光标的X值
            let disY = 0; //鼠标按下时光标的Y值
            let disW = 0; //拖拽前div的宽
            let disH = 0; // 拖拽前div的高
            let box = this.$refs.monaco;
            let _this = this;
            this.$refs.leftborder.onmousedown = function (ev) {
                console.log(box.offsetHeight);

                ev = ev || window.event;
                disX = ev.clientX; // 获取鼠标按下时光标x的值
                disY = ev.clientY; // 获取鼠标按下时光标Y的值
                disW = box.offsetWidth; // 获取拖拽前div的宽
                disH = box.offsetHeight; // 获取拖拽前div的高
                document.onmousemove = function (ev) {
                    ev = ev || window.event;
                    //拖拽时为了对宽和高 限制一下范围，定义两个变量
                    let W = disX - ev.clientX + disW;
                    box.style.width = W + 'px'; // 拖拽后物体的宽
                    _this.monacoInstance.layout({
                        width: W - 10,
                        height: disH
                    });
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
        },
        frozen(editor) {
            // 获取第一行和最后一行的位置信息
            const lastLine = editor.getModel().getLineCount();
            // 定义第一行和最后一行的装饰器
            const decorations = [
                // 冻结第一行
                {
                    range: new monaco.Range(1, 1, 1, 1),
                    options: {
                        isWholeLine: true,
                        stickiness: true,
                        className: 'moon-monaco-editor-frozen-line',
                        minimap: { color: '#ccc' }
                    }
                },
                // 冻结最后一行
                {
                    range: new monaco.Range(lastLine, 1, lastLine, 1),
                    options: {
                        isWholeLine: true,
                        stickiness: true,
                        className: 'moon-monaco-editor-frozen-line',
                        minimap: { color: '#ccc' }
                    }
                }
            ];
            // 添加装饰器
            const frozenLines = editor.deltaDecorations([], decorations);
            editor.onDidChangeCursorPosition(({ position: { lineNumber } }) => {
                const readOnlyLines = [1, editor.getModel().getLineCount()]; // 指定不能获取光标的行号
                if (readOnlyLines.includes(lineNumber)) {
                    editor.setPosition({ column: 1, lineNumber: 2 });
                }
            });
        },
        handolerResize(e) {
            if (e.offsetHeight && !this.isFullScreen) {
                this.monacoInstance.layout({
                    height: e.offsetHeight,
                    width: e.offsetWidth
                });
            }
        },
        changeOptions(options) {
            this.monacoInstance.updateOptions(options);
        },
        getValue() {
            this.inner_value = this.monacoInstance.getValue();
            if (this.needUpdate) this.$emit('input', this.inner_value);
        },
        setValue() {
            if (this.needUpdate) {
                this.inner_value = this.value;
                if (['css', 'less', 'scss'].includes(this.inner_mode.language) || this.inner_mode.language == 'html') {
                    if (['css', 'less', 'scss'].includes(this.inner_mode.language))
                        this.inner_value = beautify.css(this.value, {
                            tab_size: 1
                        });
                    if (this.inner_mode.language == 'html')
                        this.inner_value = beautify.html(this.value, {
                            tab_size: 1
                        });
                }
                if (this.inner_mode.language == 'javascript')
                    this.inner_value = beautify(this.value, {
                        tab_size: 1
                    });
                this.monacoInstance.setValue(this.inner_value);
                setTimeout(() => {
                    this.monacoInstance.getAction(['editor.action.formatDocument'])._run();
                }, 20);
            }
            /*          setTimeout(() => {
                this.frozen(this.monacoInstance);
            }, 200); */
        },
        formatData() {
            if (['css', 'less', 'scss'].includes(this.inner_mode.language) || this.inner_mode.language == 'html') {
                let value = this.monacoInstance.getValue();
                if (['css', 'less', 'scss'].includes(this.inner_mode.language))
                    value = beautify.css(value, {
                        tab_size: 1
                    });
                if (this.inner_mode.language == 'html')
                    value = beautify.html(value, {
                        tab_size: 1
                    });
                this.monacoInstance.setValue(value);
            } else this.monacoInstance.getAction(['editor.action.formatDocument'])._run();
        },
        // 放大
        maxEditor() {
            this.isFullScreen = true;
            let dom = this.$refs.monaco;
            this.originSize = {
                width: dom.clientWidth,
                height: dom.clientHeight
            };
            dom.classList.add('moon-monaco-editor-fullscreen');
            dom.style.width = this.fullscreenWidth;
            document.body.firstElementChild.appendChild(dom);
            dom = this.$refs.monaco;
            this.monacoInstance.layout({
                height: dom.clientHeight - 10,
                width: dom.clientWidth
            });
            /*    window.onresize = () => {
                this.monacoInstance.layout({
                    height: dom.clientHeight - 10,
                    width: dom.clientWidth
                });
            }; */
        },
        // 缩小
        minEditor() {
            this.isFullScreen = false;
            let dom = this.$refs.monaco;
            dom.classList.remove('moon-monaco-editor-fullscreen');
            dom.style.width = '100%';

            this.monacoInstance.layout({
                height: this.originSize.height,
                width: this.originSize.width
            });
            this.$el.appendChild(dom);
        }
    },

    beforeDestroy() {
        this.monacoInstance.dispose();
    }
};
</script>
<style lang="scss">
.moon-monaco-editor-frozen-line {
    // background: rgba(255,255,255,0.5);
    z-index: 9999999;
}
.moon-monaco-editor-fullscreen {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 99999;
    color: #fff;
    .btn-fullscreen {
        position: absolute;
        z-index: 99999;
        font-size: 20px;
        top: 5px;
        left: 5px;
    }
    .btn-blur {
        position: absolute;
        z-index: 1000;
        font-size: 20px;
        top: 35px;
        left: 5px;
    }
    .monaco-fullscreen-move-left-border {
        position: absolute;
        width: 0;
        height: 100%;
        left: 0;
        border: 5px solid transparent;
        cursor: w-resize;
        z-index: 99999999;
    }
}
</style>
<style lang="scss" scoped>
.moon-monaco-editor {
    height: 100%;
    width: 100%;
    position: relative;
    color: #fff;

    .btn-fullscreen {
        position: absolute;
        z-index: 1000;
        font-size: 20px;
        top: 5px;
        left: 5px;
    }
    .btn-blur {
        position: absolute;
        z-index: 1000;
        font-size: 20px;
        top: 35px;
        left: 5px;
    }
    .fromat-code {
        position: absolute;
        z-index: 1000;
        font-size: 20px;
        top: 35px;
        left: 5px;
    }
}
</style>

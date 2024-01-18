<template>
    <div class="common">
        <moon-form-template :offset="0" :span="24" labelWidth="4rem">
            <el-collapse :value="Array.from({ length: 10 }, (value, key) => key + 1 + '')">
                <el-collapse-item title="区域" name="1" v-if="isPageCell && isMainWorkspace">
                    <el-form-item label="等比缩放" labelWidth="5rem">
                        <el-switch :value="screamscale" @input="changescreamscale"> </el-switch>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="锁定(不能修改尺寸位置及删除)" name="2" v-if="!isEffectWorkspacePageCell">
                    <el-form-item label="锁定" labelWidth="3rem">
                        <el-switch :value="config.lock" @input="changelock"> </el-switch>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="尺寸" name="3" v-if="!isEffectWorkspacePageCell">
                    <div slot="title">
                        尺寸 <span style="font-size: 10px; color: #ff3333">(若宽度高度同时设置为0，则脱离布局控制。如：渲染全屏组件)</span>
                    </div>
                    <el-form-item label="宽度">
                        <el-input
                            :disabled="config.lock"
                            :value="config.width"
                            @input="setWidth"
                            type="number"
                            min="0"
                            :max="pWidth"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="高度">
                        <el-input
                            :disabled="config.lock"
                            :value="config.height"
                            @input="setHeight"
                            type="number"
                            min="0"
                            :max="pHeight"
                        ></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="位置" name="4" v-if="!isPageCell">
                    <el-form-item label="x轴">
                        <el-input :disabled="config.lock" :value="config.x" @input="setX" type="number" v-bind="xRound"></el-input>
                    </el-form-item>
                    <el-form-item label="y轴">
                        <el-input :disabled="config.lock" :value="config.y" @input="setY" type="number" v-bind="yRound"></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="层级" name="5" v-if="!isEffectWorkspacePageCell">
                    <el-form-item label="层级">
                        <el-input
                            :disabled="cell.id == pageCellId"
                            :value="config.zIndex"
                            @input="setZIndex"
                            type="number"
                            min="1"
                        ></el-input>
                    </el-form-item>
                </el-collapse-item>

                <el-collapse-item name="7" v-if="!isPageCell && !isToolCell">
                    <div slot="title">显隐</div>
                    <code-monaco-editor
                        :value="showhiddenFunctionText"
                        @input="setShowhiddenFunctionText"
                        style="height: 70px"
                        :readOnly="config.lock"
                    ></code-monaco-editor>
                </el-collapse-item>
                <el-collapse-item title="样式" name="6" v-if="!isToolCell" style="position: relative">
                    <el-tabs type="border-card" v-model="tabStyle">
                        <el-tab-pane label="Class(lang=less)" name="class">
                            <code-monaco-editor
                                :value="config.class"
                                @input="changClass"
                                style="height: 300px"
                                :mode="{ language: 'less' }"
                            ></code-monaco-editor>
                        </el-tab-pane>
                        <el-tab-pane label="Style" name="style">
                            <code-monaco-editor
                                :value="config.style"
                                @input="changStyle"
                                style="height: 300px"
                                :mode="{ language: 'json' }"
                            ></code-monaco-editor>
                        </el-tab-pane>
                    </el-tabs>
                </el-collapse-item>
            </el-collapse>
        </moon-form-template>
    </div>
</template>
<script>
import { debounce } from 'lodash';
import { updateCellDataView, equalsString, willChangeGlabalVar } from '@/views/moon-datav/utils';
import CodeMonacoEditor from './_c/code-monaco-editor.vue';

export default {
    inheritAttrs: false,
    name: '',
    inject: ['getTransformPlugin', 'getWorkspace', 'pageCellId'],
    props: ['cell', 'graph'],
    components: { CodeMonacoEditor },
    created() {},
    mounted() {},
    data() {
        return {
            xRound: {
                min: 0,
                max: 1920
            },
            yRound: {
                min: 0,
                max: 1080
            },
            widthRound: {
                min: 0,
                max: 1920
            },
            heightRound: {
                min: 0,
                max: 1080
            },
            screamscale: false,
            config: {
                x: 0,
                y: 0,
                width: 1920,
                height: 1080,
                zIndex: 0,
                style: '{}',
                class: '',
                lock: false
            },
            tabStyle: 'class',
            pWidth: 1920,
            pHeight: 1080,
            debounce_getSize: debounce(this.getSize, 300),
            debounce_getPosition: debounce(this.getPosition, 300),
            showhiddenFunctionText: '()=>{return true}'
        };
    },
    watch: {
        'cell.id': {
            handler() {
                this.init();
            },
            immediate: true
        }
    },
    computed: {
        workspace() {
            return this.getWorkspace();
        },
        isMainWorkspace() {
            return this.workspace.id == this.workspace.mainWorkspaceId;
        },
        isPageCell() {
            return this.cell.id == this.pageCellId;
        },
        // 副工作空间pageCell
        isEffectWorkspacePageCell() {
            return !this.isMainWorkspace && this.isPageCell;
        },
        isToolCell() {
            return this.cell.getData().type.includes('moon-dv-tool-');
        }
    },
    methods: {
        init() {
            const zIndex = this.cell.getZIndex();
            this.config.zIndex = zIndex;
            this.config.lock = !!this.cell.getAttrs()?.config?.lock;
            this.config.class = `.moon-datav-${this.cell.id}{}`;
            if (this.cell.id != this.pageCellId) {
                const page = this.graph.getCellById(this.pageCellId);
                const { width: pWidth, height: pHeight } = page.size();
                this.pWidth = pWidth;
                this.pHeight = pHeight;
            }

            const { width, height } = this.cell.size();
            this.getSize({ width, height });
            this.cell.on('change:size', ({ current }) => {
                //console.log('change:size');
                //this.debounce_getSize(current);
                this.getSize(current);
            });
            this.cell.on('change:attrs', ({ current }) => {
                //console.log('change:size');
                //this.debounce_getSize(current);
                this.config.lock = !!current?.config?.lock;
            });
            const { x, y } = this.cell.position();
            this.getPosition({ x, y });
            this.cell.on('change:position', ({ current }) => {
                //console.log('change:position');
                //this.debounce_getPosition(current);
                this.getPosition(current);
            });
            this.cell.on('change:zIndex', ({ current }) => {
                // console.log('change:zIndex');
                if (this.config.zIndex != current) this.config.zIndex = current;
            });
            const cellData = this.cell.getData();
            this.showhiddenFunctionText = cellData.showhiddenFunctionText || '()=>{return true}';

            if (cellData?.attrs?.style) {
                let style = { ...cellData.attrs.style };
                delete style.width;
                delete style.height;
                this.config.style = JSON.stringify(style);
            }
            if (cellData?.attrs?.class) {
                this.config.class = cellData.attrs.class || `.moon-datav-${this.cell.id}{\n\n}`;
            }
            if (cellData?.attrs?.screamscale) this.screamscale = cellData.attrs.screamscale;
        },
        mathRound(num) {
            return Math.round(num);
        },
        setSize() {
            this.cell.size(this.config.width, this.config.height);
        },
        setWidth(e) {
            e = this.mathRound(e);
            if (e <= this.widthRound.max && e >= this.widthRound.min) {
                this.config.width = e;
                this.setSize();
            }
            if (e > this.widthRound.max && e <= this.pWidth) {
                this.config.width = e;
                this.config.x = this.pWidth - e;
                this.setPosition();
                this.setSize();
            }
        },
        setHeight(e) {
            e = this.mathRound(e);
            if (e <= this.heightRound.max && e >= this.heightRound.min) {
                this.config.height = e;
                this.setSize();
            }
            if (e > this.heightRound.max && e <= this.pHeight) {
                this.config.height = e;
                this.config.y = this.pHeight - e;
                this.setPosition();
                this.setSize();
            }
        },
        setPosition() {
            const { x, y } = this.cell.position();
            this.cell.translate(this.config.x - x, this.config.y - y);
            // this.cell.position(this.config.x, this.config.y);
        },
        setX(e) {
            e = this.mathRound(e);
            if (e <= this.xRound.max && e >= this.xRound.min) {
                this.config.x = e;
                this.setPosition();
            }
        },
        setY(e) {
            e = this.mathRound(e);
            if (e <= this.yRound.max && e >= this.yRound.min) {
                this.config.y = e;
                this.setPosition();
            }
        },
        setZIndex(e) {
            e = this.mathRound(e);
            if (e < 1) e = 1;
            if (this.config.zIndex == e) return;
            this.config.zIndex = e;
            this.cell.setZIndex(e);
        },
        changStyle(e) {
            let flag = true;
            let json = {};
            this.config.style = e ? e : '{}';
            try {
                json = JSON.parse(this.config.style);
            } catch (error) {
                flag = false;
            }
            const data = this.cell.getData();
            if (flag && JSON.stringify(data.attrs.style) != JSON.stringify(json)) {
                if (data.attrs) data.attrs.style = json;
                else
                    data.attrs = {
                        style: json
                    };
                updateCellDataView(this.cell, data);
            }
        },
        async setShowhiddenFunctionText(e) {
            if (equalsString(e, this.showhiddenFunctionText)) return;

            this.showhiddenFunctionText = e ? e : this.$options.data().showhiddenFunctionText;
            this.getTransformPlugin().clearWidgets();

            // 禁止在函数中改变自定义全局变量值
            if (willChangeGlabalVar(this.graph, this.showhiddenFunctionText, this.pageCellId)) {
                this.$message.error('禁止在函数中修改自定义全局变量值！');
                const cellData = this.cell.getData();
                this.showhiddenFunctionText = cellData.showhiddenFunctionText || '()=>{return true}';
                flag = false;
            } else {
                const data = this.cell.getData();
                data.showhiddenFunctionText = this.showhiddenFunctionText;
                updateCellDataView(this.cell, data);
            }
        },
        changescreamscale(e) {
            this.screamscale = e;
            this.cell.setData(
                {
                    attrs: { screamscale: e }
                },
                {
                    silent: true
                }
            );
        },
        changelock() {
            this.config.lock = !this.config.lock;
            if (this.config.lock) this.getTransformPlugin().clearWidgets();
            this.cell.setAttrs({
                config: {
                    lock: this.config.lock
                }
            });
        },
        changClass(e) {
            if (e) {
                this.config.class = e;
            } else this.config.class = `.moon-datav-${this.cell.id}{\n\n}`;

            const data = this.cell.getData();
            if (equalsString(data.attrs.class, this.config.class)) return;
            if (data.attrs) data.attrs.class = this.config.class;
            else
                data.attrs = {
                    class: this.config.class
                };
            updateCellDataView(this.cell, data);
        },
        getPosition({ x, y }) {
            this.widthRound.max = this.pWidth - this.mathRound(x);
            this.heightRound.max = this.pHeight - this.mathRound(y);
            this.config.x = this.mathRound(x);
            this.config.y = this.mathRound(y);
        },
        getSize({ width, height }) {
            this.xRound.max = this.pWidth - this.mathRound(width);
            this.yRound.max = this.pHeight - this.mathRound(height);
            this.config.width = this.mathRound(width);
            this.config.height = this.mathRound(height);
        }
    }
};
</script>
<style lang="scss" scoped></style>

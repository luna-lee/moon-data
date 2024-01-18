<template>
    <div class="attrsdata">
        <div v-if="cell.getData().isCustom" style="display: flex; align-items: center; margin: 10px 0">
            <span style="color: #fff; font-size: 10px; width: 7rem"> 自定义组件名 </span
            ><el-input :value="custom" @input="onChangeCustom"></el-input>
        </div>
        <el-tabs type="border-card" v-model="tabDataItem">
            <el-tab-pane label="数据项" v-if="!isPageCell">
                <code-monaco-editor :value="propsFunctionText" @input="changePropsFunctionText" style="height: 70vh"></code-monaco-editor>
            </el-tab-pane>
            <el-tab-pane label="子节点(Vue template)" v-if="!isPageCell">
                <div style="color: red; font-size: 10px">
                    可通过 <span style="color: rgb(156, 159, 17)">bindData.XX</span> 的形式获取传入的数据项。只读！
                </div>
                <code-monaco-editor
                    :value="slotDom"
                    @input="changeSlotDom"
                    :mode="{ language: 'html' }"
                    style="height: 70vh"
                ></code-monaco-editor>
            </el-tab-pane>
            <el-tab-pane label="全局变量">
                <globalVarTable />
            </el-tab-pane>
            <el-tab-pane label="自定义全局变量">
                <template v-if="isPageCell">
                    <template v-if="isMainWorkspace">
                        <div style="color: #fff; padding: 10px 0; font-size: 12px">
                            自定义全局变量(JSON) <span style="font-size: 10px; color: red">命名格式：globalVar_*</span>
                        </div>
                        <code-monaco-editor
                            :value="globalVarDefaultValue"
                            style="height: 80vh"
                            @input="changeGlobalVar"
                            :mode="{ language: 'json' }"
                        ></code-monaco-editor>
                    </template>
                    <template v-else>
                        <globalVarCustomTable
                            :data="globalVarCustomTableData.filter((v) => v.name.includes('globalVar_'))"
                        ></globalVarCustomTable>
                        <div style="color: #fff; padding: 10px 0; font-size: 12px">
                            自定义工作空间全局变量(JSON) <span style="font-size: 10px; color: red">命名格式：workspaceVar_*</span>
                        </div>
                        <code-monaco-editor
                            :value="workspaceGlobalVarDefaultValue"
                            style="height: 70vh"
                            @input="changeGlobalVar"
                            :mode="{ language: 'json' }"
                        ></code-monaco-editor>
                    </template>
                </template>
                <template v-else>
                    <globalVarCustomTable :data="globalVarCustomTableData"></globalVarCustomTable>
                </template>
            </el-tab-pane>

            <!-- </el-collapse-item> -->
            <!-- <el-collapse-item name="2" v-if="isPageCell"> -->
            <!-- <div slot="title" >预执行函数</div> -->
            <el-tab-pane label="预执行函数" v-if="isPageCell">
                <code-monaco-editor
                    :value="prepareFunctionText"
                    @input="changePrepareFunctionText"
                    style="height: 80vh"
                ></code-monaco-editor>
            </el-tab-pane>
        </el-tabs>

        <!-- </el-collapse-item> -->
        <!-- </el-collapse> -->
    </div>
</template>
<script>
import { updateCellDataView, equalsString, ExecFunctionStr, ReplaceGlobalVarName } from '@/views/moon-datav/utils';
import { isType } from '@/components-global/utils.js';
import globalVarCustomTable from './_c/globalVarCustomTable.vue';
import globalVarTable from './_c/globalVarTable.vue';
import CodeMonacoEditor from './_c/code-monaco-editor.vue';
import { cloneDeepWith, cloneDeep } from 'lodash';

export default {
    inheritAttrs: false,
    name: '',
    inject: ['getTransformPlugin', 'getWorkspace', 'pageCellId'],
    props: ['cell', 'graph'],
    components: { globalVarCustomTable, globalVarTable, CodeMonacoEditor },
    created() {},
    mounted() {
        const cellData = this.cell.getData();
        this.propsFunctionText = cellData?.attrs?.propsFunctionText || this.$options.data().propsFunctionText;
        this.slotDom = cellData?.attrs?.slotDom || this.$options.data().slotDom;
        this.custom = cellData.type;
        this.getDefaultGlobalVar();
        if (this.cell.id == this.pageCellId) {
            this.cell.on('change:data', () => {
                this.getDefaultGlobalVar();
                this.cell.off('change:data');
            });
        }
    },
    data() {
        return {
            willChangeProxyData: false,
            tabDataItem: '0',
            tab: '0',
            globalVarDefaultValue: '{}',
            workspaceGlobalVarDefaultValue: '{}',
            globalVarCustomTableData: [],
            propsFunctionText: `
            async ()=>{
                return {
                    value:""
                }
            }`,
            slotDom: `<template>\n</template>`,
            custom: 'div',
            prepareFunctionText: `async ()=>{
                console.log('prepare Function')
            }`
        };
    },
    watch: {},
    computed: {
        workspace() {
            return this.getWorkspace();
        },
        isMainWorkspace() {
            return this.workspace.id == this.workspace.mainWorkspaceId;
        },
        isPageCell() {
            return this.cell.id == this.pageCellId;
        }
    },
    methods: {
        getDefaultGlobalVar() {
            const pageCellData = this.graph.getCellById(this.pageCellId).getData();
            this.prepareFunctionText = pageCellData.prepareFunctionText || this.$options.data().prepareFunctionText;
            const globalVarObj = pageCellData.globalVar || {};
            const globalVarDefaultValueObj = pageCellData.globalVarDefaultValue || {};
            this.globalVarCustomTableData = Object.keys(globalVarObj).map((key) => {
                return {
                    name: key,
                    value: typeof globalVarObj[key] == 'function' ? globalVarObj[key].toString() : JSON.stringify(globalVarObj[key])
                };
            });
            const isGlobalDefault = {};
            const isWorkspaceDefault = {};
            Object.keys(globalVarDefaultValueObj).map((key) => {
                if (/globalVar_/gi.test(key)) {
                    isGlobalDefault[key] = typeof globalVarDefaultValueObj[key] == 'function' ? null : globalVarDefaultValueObj[key];
                }
                if (/workspaceVar_/gi.test(key)) {
                    isWorkspaceDefault[key] = typeof globalVarDefaultValueObj[key] == 'function' ? null : globalVarDefaultValueObj[key];
                }
            });
            this.globalVarDefaultValue = JSON.stringify(isGlobalDefault);
            this.workspaceGlobalVarDefaultValue = JSON.stringify(isWorkspaceDefault);
        },
        onChangeCustom(e) {
            if (equalsString(this.custom, e)) return;
            this.custom = e;
            const data = this.cell.getData();
            data.type = this.custom;
            updateCellDataView(this.cell, data);
        },
        changeSlotDom(e) {
            if (equalsString(this.slotDom, e)) return;
            this.slotDom = e ? e : this.$options.data().slotDom;
            const data = this.cell.getData();
            data.attrs.slotDom = this.slotDom;
            updateCellDataView(this.cell, data);
        },
        async changePropsFunctionText(e) {
            if (equalsString(this.propsFunctionText, e)) return;
            this.propsFunctionText = e ? e : this.$options.data().propsFunctionText;

            // 禁止在函数中改变自定义全局变量值
            const pageCellData = this.graph.getCellById(this.pageCellId).getData();
            this.willChangeProxyData = false;

            const globalVar = this.ProxyObjValue(pageCellData.globalVar || {});
            await ExecFunctionStr(globalVar, this, ReplaceGlobalVarName(this.propsFunctionText));

            if (this.willChangeProxyData) {
                this.$message.error('禁止在数据项中修改自定义全局变量值！');
                const cellData = this.cell.getData();
                this.propsFunctionText = cellData?.attrs?.propsFunctionText || this.$options.data().propsFunctionText;
            } else {
                const data = this.cell.getData();
                if (data.attrs) data.attrs.propsFunctionText = this.propsFunctionText;
                else
                    data.attrs = {
                        propsFunctionText: this.propsFunctionText
                    };
                updateCellDataView(this.cell, data);
            }
        },
        changePrepareFunctionText(e) {
            if (equalsString(this.prepareFunctionText, e)) return;
            this.prepareFunctionText = e ? e : this.$options.data().prepareFunctionText;
            const data = this.cell.getData();
            data.prepareFunctionText = this.prepareFunctionText;
            updateCellDataView(this.cell, data);
        },
        ProxyObjValue(objSource) {
            let _this = this;
            function setProxy(obj) {
                Object.keys(obj).map((key) => {
                    if (isType(obj[key], ['Object', 'Array'])) {
                        obj[key] = new Proxy(cloneDeep(obj[key]), {
                            get: function (target, key, receiver) {
                                return Reflect.get(target, key, receiver);
                            },
                            set(target, key, value, receiver) {
                                const oldVal = Reflect.get(target, key, receiver);
                                if (typeof oldVal == 'object' && Object.prototype.toString.call(oldVal) != '[object Proxy]')
                                    return Reflect.set(target, key, value, receiver);
                                else {
                                    _this.willChangeProxyData = true;
                                    throw '禁止在数据项中修改自定义全局变量值！';
                                }
                            }
                        });
                        setProxy(obj[key]);
                    }
                });
            }
            setProxy(objSource);
            return new Proxy(objSource, {
                get: function (target, key, receiver) {
                    return Reflect.get(target, key, receiver);
                },
                set(target, key, value, receiver) {
                    _this.willChangeProxyData = true;
                    throw '禁止在数据项中修改自定义全局变量值！';
                }
            });
        },
        changeGlobalVar(e) {
            if (this.isMainWorkspace) {
                if (equalsString(this.globalVarDefaultValue, e)) return;
                this.globalVarDefaultValue = e ? e : '{}';
            } else {
                if (equalsString(this.workspaceGlobalVarDefaultValue, e)) return;
                this.workspaceGlobalVarDefaultValue = e ? e : '{}';
            }
            let flag = true;
            let json = {};

            try {
                json = {
                    ...JSON.parse(this.globalVarDefaultValue),
                    ...JSON.parse(this.workspaceGlobalVarDefaultValue)
                };
            } catch (error) {
                flag = false;
            }
            if (flag) {
                const data = this.cell.getData();
                data.globalVar = JSON.parse(JSON.stringify(json));
                data.globalVarDefaultValue = JSON.parse(JSON.stringify(json));
                updateCellDataView(this.cell, data);
                /*       const keys = Object.keys(json);
                this.graph.getCells().forEach((cell) => {
                    const data = cell.getData();
                    const propsFunctionText = data.attrs.propsFunctionText;
                    // 更新涉及使用自定义全局变量的组件
                    if (cell.id != this.pageCellId && propsFunctionText) {
                        const watchKeys = keys.some((key) => propsFunctionText.indexOf(key) != -1);
                        if (watchKeys) {
                            data.globalVar = json;
                            updateCellDataView(cell, data);
                        }
                    }
                }); */
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.attrsdata {
}
</style>

<script>
import { flatToTree } from '@/components-global/utils';
import { cloneDeep } from 'lodash';
import less from 'less';
import { getCellsByWorkSpaceId, getWorkSpaceListByProjectId } from '@/service/index.js';
import { ExecFunctionStr, ExecFunctionStrSync, GetFunctionFromFunStr, ReplaceGlobalVarName } from '@/views/moon-datav/utils';
export default {
    inheritAttrs: false,
    name: '',
    props: {
        projectId: {
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: '100vh'
        },
        className: {
            type: String,
            default: ''
        },
        styleObj: {
            type: Object,
            default: () => ({})
        }
    },
    provide() {
        return {
            getPage: () => this.domList.find((i) => i.id == this.pageCellId)
        };
    },
    components: {},
    beforeCreate() {},
    created() {},
    render() {
        let _this = this;
        function iteratorDom(domList) {
            return domList.map((dom) => {
                return (
                    <moon-transition
                        {...{
                            attrs: dom.data?.animation || {}
                        }}
                    >
                        {_this.domShowHidden[dom.id]() && dom.data.type.indexOf('moon-dv-tool-') == -1 ? (
                            <moon-dv-custom
                                name={dom.data.type}
                                style={{
                                    ...(dom.data.type == 'moon-dv-page' ? _this.styleObj : {}),
                                    ..._this.getStyle(dom)
                                }}
                                class={dom.data.className + ' ' + (dom.data.type == 'moon-dv-page' ? _this.className : '')}
                                globalVar={_this.globalVar}
                                bindAttrs={dom.data.attrs}
                                bindOnStr={_this.domListeners[dom.id]}
                                key={dom.id}
                                {...{ on: { ..._this.$listeners } }}
                            >
                                {dom.children.length ? iteratorDom(dom.children) : ''}
                                {/* 组件slots，排除moon-dv-page与moon-dv-container*/}
                                {dom.data.type != 'moon-dv-page' && dom.data.type != 'moon-dv-container'
                                    ? Object.keys(_this.$slots).map((slotName) => <div slot={slotName}>{_this.$slots[slotName]}</div>)
                                    : ''}
                            </moon-dv-custom>
                        ) : (
                            ''
                        )}
                    </moon-transition>
                );
            });
        }
        let dom = '';
        if (this.domList.length && !this.loading) {
            if (this.screamscale) {
                dom = iteratorDom(this.domList)[0];
            } else {
                //  prettier-ignore
                dom = <moon-scroll
                     style={{height: this.height }}>
                    {iteratorDom(this.domList)[0]}
                </moon-scroll>
            }
        }
        return dom;
    },
    async mounted() {
        if (!this.projectId) return;
        this.loading = true;
        this.pageCellId = this.projectId;
        let { data: workspaceList } = await getWorkSpaceListByProjectId({ id: this.projectId });
        let dagJson = [];
        let workspaceCellList = await Promise.all(
            workspaceList.map(async (workspace) => {
                // 获取当前的工作空间，
                let { data } = await getCellsByWorkSpaceId({ id: workspace.id });
                const { mainWorkspaceId, id: workspaceId } = data;
                // 判断是否是主工作空间
                const isMainWorkspace = mainWorkspaceId == workspaceId;
                this.initworkspaceConfig(workspaceId);
                // 遍历工作空间中的组件
                return (
                    data.cellList
                        // // 过滤副工作空间中的全局视图和透传视图
                        .filter(({ cellId, isPublic, pushWorkspaceId }) => {
                            if (isMainWorkspace) {
                                return true;
                            } else {
                                if (cellId == this.pageCellId) return true;
                                else {
                                    // 过滤副工作空间中的全局视图和透传视图
                                    if (isPublic == '1' || pushWorkspaceId) return false;
                                    else return true;
                                }
                            }
                        })
                        .map((cell) => {
                            // 将当前的工作空间数据挂载到每个cell中
                            let parseCell = JSON.parse(cell.jsonStr);
                            parseCell.bussinessData = cell;
                            parseCell.bussinessData.mainWorkspaceId = mainWorkspaceId;
                            //将所有工作空间的自定义全局变量整合，同时将key上加上当前工作空间Id，获取子空间的显隐函数，执行所有预执行函数
                            if (parseCell.id == this.pageCellId) {
                                let globalVar = parseCell.data.globalVar;
                                // 将每个工作空间中的自定义全局变量存入globalVar
                                Object.keys(globalVar).map((key) => {
                                    // 主空间全部放入
                                    if (isMainWorkspace) {
                                        this.$set(this.globalVar, ReplaceGlobalVarName(key, workspaceId, ''), globalVar[key]);
                                    } else {
                                        //子空间只加载workspaceVar_
                                        if (key.startsWith('workspaceVar_')) {
                                            this.$set(this.globalVar, ReplaceGlobalVarName(key, workspaceId, ''), globalVar[key]);
                                            this.workspaceConfig[workspaceId].workspaceGlobalVar[
                                                ReplaceGlobalVarName(key, workspaceId, '')
                                            ] = cloneDeep(globalVar[key]);
                                        }
                                    }
                                });
                                // 获取子工作空间的显隐函数
                                if (isMainWorkspace) {
                                    const subWorkspaceShowHiddenConfig = parseCell.data.subWorkspaceShowHidden || {};
                                    Object.keys(subWorkspaceShowHiddenConfig).forEach((key) => {
                                        // 初始化workspaceConfig对象
                                        this.initworkspaceConfig(key);
                                        this.workspaceConfig[key].showHiddenFunText = ReplaceGlobalVarName(
                                            subWorkspaceShowHiddenConfig[key],
                                            key
                                        );
                                    });
                                }
                                // 获取所有page中的预执行函数
                                this.workspaceConfig[workspaceId].prepareFunctionText = ReplaceGlobalVarName(
                                    parseCell.data.prepareFunctionText,
                                    workspaceId
                                );
                            }
                            //将所有函数字符串中的涉及到的自定义全局变量名前加上对应当前工作空间Id
                            parseCell.data.showhiddenFunctionText = ReplaceGlobalVarName(
                                parseCell.data.showhiddenFunctionText,
                                workspaceId
                            );
                            parseCell.data.attrs.propsFunctionText = ReplaceGlobalVarName(
                                parseCell.data.attrs.propsFunctionText,
                                workspaceId
                            );
                            parseCell.data.attrs.listenerFunctionText = ReplaceGlobalVarName(
                                parseCell.data.attrs.listenerFunctionText,
                                workspaceId
                            );
                            parseCell.data.attrs.slotDom = ReplaceGlobalVarName(parseCell.data.attrs.slotDom, workspaceId);
                            return parseCell;
                        })
                );
                // dagJson = [...dagJson, ...JSON.parse(workspace.strJson)];
            })
        );
        // 作为组件时，可以通过props修改this.globalVar中的globalVar_*相同变量名的变量值
        this.$watch(
            () => this.$attrs,
            () => {
                Object.keys(this.$attrs).map((key) => {
                    if (Object.hasOwn(this.globalVar, 'globalVar_' + key)) {
                        this.globalVar['globalVar_' + key] = this.$attrs[key];
                    }
                });
            },
            {
                deep: true,
                immediate: true
            }
        );

        this.execWorkspacePrepareFunctionAndRestWorkspaceGlobalVarByShowHidden();
        if (!workspaceCellList.length) return;
        //合并节点信息
        dagJson = workspaceCellList.reduce((arr, cells) => {
            arr = [
                ...arr,
                ...cells.filter((cell) => {
                    return !(cell.bussinessData.workspaceId != cell.bussinessData.mainWorkspaceId && cell.id == this.pageCellId);
                })
            ];
            return arr;
        }, []);
        let formatDagJson = dagJson.map((dom) => {
            const data = dom.data;
            const attrs = dom.data.attrs;
            // dom.data.styleObject = attrs.style || {};
            dom.data.className = 'moon-datav-' + dom.id;
            this.insertClass(data.className, attrs.class || '');
            this.setDomListeners(dom.id, attrs.listenerFunctionText);
            this.setDomShowHidden(
                dom.id,
                dom.data.showhiddenFunctionText,
                dom.bussinessData.workspaceId,
                dom.bussinessData.mainWorkspaceId
            );
            // delete attrs.style;
            delete attrs.class;
            delete attrs.listenerFunctionText;
            dom.children = [];
            return dom;
        });
        const { objById, treeData } = flatToTree(formatDagJson, 'id', 'parent');
        // treeData 只会有一层，将多余的转入到page节点中，因为传视图被删除导致
        treeData.forEach((cell, index) => {
            if (index == 0) {
                this.domList = [cell];
            } else {
                cell.parent = this.pageCellId;
                this.domList[0].children.push(cell);
            }
        });
        this.domList = treeData;
        this.objById = objById;
        let pageCell = this.objById[this.projectId];
        this.screamscale = pageCell.data.attrs.screamscale;
        this.loading = false;
    },
    data() {
        return {
            loading: false,
            objById: {},
            domList: [],
            globalVar: {},
            domListeners: {},
            domShowHidden: {},
            workspaceConfig: {}, //{ 'workSpackeId':{showHiddenFunText:'',prepareFunctionText:'',workspaceGlobalVar:{}}}
            screamscale: false, //缩放则不在el-scrollbar中渲染
            pageCellId: 'page'
        };
    },
    watch: {},
    computed: {},
    methods: {
        execWorkspacePrepareFunctionAndRestWorkspaceGlobalVarByShowHidden() {
            //工作空间显示时执行预执行函数，隐藏时恢复工作空间中本空间的全局变量值
            Object.keys(this.workspaceConfig).map((workspaceId) => {
                const keys = Object.keys(this.globalVar);
                const watchKeys = keys.filter((key) => this.workspaceConfig[workspaceId].showHiddenFunText.indexOf(key) != -1);
                if (watchKeys.length) {
                    this.$watch(
                        function () {
                            return watchKeys.map((key) => this.globalVar[key]);
                        },
                        async (val) => {
                            if (ExecFunctionStrSync(this.globalVar, this, this.workspaceConfig[workspaceId].showHiddenFunText)) {
                                ExecFunctionStr(this.globalVar, this, this.workspaceConfig[workspaceId].prepareFunctionText);
                            } else {
                                Object.keys(this.workspaceConfig[workspaceId].workspaceGlobalVar).map((key) => {
                                    this.$set(this.globalVar, key, cloneDeep(this.workspaceConfig[workspaceId].workspaceGlobalVar[key]));
                                });
                            }
                        },
                        { deep: true, immediate: true }
                    );
                } else {
                    ExecFunctionStr(this.globalVar, this, this.workspaceConfig[workspaceId].prepareFunctionText);
                }
            });
        },
        initworkspaceConfig(workspaceId) {
            if (!this.workspaceConfig[workspaceId]) {
                this.workspaceConfig[workspaceId] = {
                    showHiddenFunText: '',
                    prepareFunctionText: '',
                    workspaceGlobalVar: {}
                };
            }
        },
        setDomShowHidden(id, showhiddenFunctionText, workspaceId, mainWorkspaceId) {
            this.$set(this.domShowHidden, id, () => {
                if (workspaceId == mainWorkspaceId) return ExecFunctionStrSync(this.globalVar, this, showhiddenFunctionText);
                else
                    return (
                        ExecFunctionStrSync(this.globalVar, this, showhiddenFunctionText) &&
                        ExecFunctionStrSync(this.globalVar, this, this.workspaceConfig[workspaceId].showHiddenFunText)
                    );
            });
        },
        setDomListeners(id, listenerFunctionText) {
            try {
                this.$set(this.domListeners, id, listenerFunctionText);
            } catch (error) {
                console.log(error);
            }
        },
        getStyle(dom) {
            const top = dom.parent ? dom.position.y - this.objById[dom.parent].position.y : dom.position.y;
            const left = dom.parent ? dom.position.x - this.objById[dom.parent].position.x : dom.position.x;
            // 若宽度高度同时设置为0 则脱离布局控制
            if (dom.size.width == 0 && dom.size.height == 0) return {};
            return {
                //根节点relative
                position: dom.id != this.projectId ? 'absolute' : 'relative',
                width: dom.size.width + 'px',
                height: dom.size.height + 'px',
                top: top + 'px',
                left: left + 'px',
                zIndex: dom.zIndex,
                boxSizing: 'border-box'
            };
        },
        insertClass(id, classDom) {
            let dom = document.getElementById(id);
            less.render(classDom, (e, output) => {
                const css = output ? output.css : '';
                if (!dom) {
                    const styleDom = document.createElement('style');
                    styleDom.setAttribute('id', id);
                    styleDom.innerHTML = css;
                    document.head.appendChild(styleDom);
                } else dom.innerHTML = css;
            });
        }
    }
};
</script>
<style></style>
<style lang="scss" scoped></style>

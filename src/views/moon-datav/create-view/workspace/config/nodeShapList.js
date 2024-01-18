/* 
interface cell={
    shape:stirng,
    data:{
        type:string
        label:string
        labelStyle:{},
        isCustom:false,
        globalVar:{},
        globalVarDefaultValue:{},//globalVar默认值
        animation: {},
        prepareFunctionText:"",
        mainWorkspacePrepareFunctionText："",//主工作空间的预执行函数，用于子空间获取全局变量真实值
        showhiddenFunctionText:"",
        subWorkspaceShowHidden: {},//workspaceId:functionText
        // 绑定到组件上的attrs
        attrs:{
            style:{},
            class:string,
            propsFunctionText:'',
            listenerFunctionText:"",
            slotDom:'',//控件插槽,只有通用组件用到该属性
        },
    },
    attrs:{
        style:{
            graph:{},  // 绘图画布展示样式,与data.attrs.style合并后的到值
            stencil:{} // 工具画布展示样式
        },
        config:{
            lock:false,// 控件锁定
            stencilImg:''
        },
        //不存储
        bussinessData:{
            id:"",
            jsonStr:"",
            workspaceId:"",
            isPublic:""
        }
    }
}
*/
import { getComponentData } from '@/views/moon-datav/config/index.js';
/* {
    groupname:string,
    list:[cell]
} */
const stringifyFunction = (obj) => {
    let newobj = JSON.parse(JSON.stringify(obj));
    for (let key in obj) {
        if (obj[key] instanceof Function) {
            newobj[key] =
                'function_ ' +
                obj[key]
                    .toString()
                    .replace(/\/\/.*\n/gm, '')
                    .replace(/[\n\t]/g, '')
                    .replace(/undefined/g, 'this') +
                ' function_';
            continue;
        }
        if (obj[key] instanceof Object) {
            newobj[key] = stringifyFunction(obj[key]);
        }
    }
    return newobj;
};

export async function nodeShapList(pageCellId) {
    const ComponentData = await getComponentData(pageCellId);
    const scale = {
        // 以宽450 高270为基进行缩放
        transform: `scale(${200 / 450}, ${80 / 270})`,
        transformOrigin: 'left top',
        width: '450px',
        height: '270px'
    };
    function fillNode(arr) {

        return arr.map(item => {
            if (!item?.children?.length && item?.nodeList?.length) {
                item.nodeList = item.nodeList.map((c) => {
                    const attrs = c.attrs || {};
                    const style = attrs.style || {};
                    const stencilStyle = attrs.stencilStyle || {};
                    const defaultPropsStr = JSON.stringify(stringifyFunction(c.defaultProps || {}))
                        .replaceAll('"function_', '')
                        .replaceAll('function_"', '')
                        .replaceAll('\\"', '"');
                    const stencilImg = c.stencilImg || '';
                    const listenerStr = JSON.stringify(stringifyFunction(c.event || { click: () => { } }))
                        .replaceAll('"function_', '')
                        .replaceAll('function_"', '');
                    return {
                        shape: 'custom-vue-node',
                        data: {
                            type: '',
                            label: '',
                            labelStyle: {},
                            isCustom: false,
                            ...c,
                            prepareFunctionText: 'async ()=>{}',
                            mainWorkspacePrepareFunctionText: 'async ()=>{}',
                            showhiddenFunctionText: '()=>{return true}',
                            globalVar: {},
                            globalVarDefaultValue: {},
                            animation: {},
                            attrs: {
                                style: {},
                                class: '',
                                propsFunctionText: `async ()=>{return ${defaultPropsStr}}`,
                                listenerFunctionText: `()=>{return ${listenerStr} }`,
                                ...attrs
                            }
                        },
                        attrs: {
                            style: {
                                graph: { width: '100%', height: '100%', ...style }, // 绘图画布展示样式,与data.attrs.style合并后的到值
                                stencil: c.type.startsWith('dv-')
                                    ? { ...style, ...scale, ...stencilStyle }
                                    : { width: '100%', height: '100%', ...style, ...stencilStyle } // 工具画布展示样式
                            },
                            config: {
                                lock: false, // 控件锁定
                                stencilImg
                            },
                            bussinessData: {
                                id: '',
                                jsonStr: '',
                                workspaceId: '',
                                isPublic: '',
                                cellId: '',
                                pushWorkspaceId: ''
                            }
                        }
                    };
                })
            }
            if (item.children) {
                item.children = fillNode(item.children)
            }
            return item
        })

        /*  return arr.reduce((obj, key) => {
             obj[key] = {
                 groupname: sourceObj[key].groupname,
                 children: sourceObj[key].children ? fillNode(sourceObj[key].children) : undefined,
                 list: sourceObj[key].list ? sourceObj[key].list.map((c) => {
                     const attrs = c.attrs || {};
                     const style = attrs.style || {};
                     const stencilStyle = attrs.stencilStyle || {};
                     const defaultPropsStr = JSON.stringify(stringifyFunction(c.defaultProps || {}))
                         .replaceAll('"function_', '')
                         .replaceAll('function_"', '')
                         .replaceAll('\\"', '"');
                     const stencilImg = c.stencilImg || '';
                     const listenerStr = JSON.stringify(stringifyFunction(c.event || { click: () => { } }))
                         .replaceAll('"function_', '')
                         .replaceAll('function_"', '');
                     return {
                         shape: 'custom-vue-node',
                         data: {
                             type: '',
                             label: '',
                             labelStyle: {},
                             isCustom: false,
                             ...c,
                             prepareFunctionText: 'async ()=>{}',
                             mainWorkspacePrepareFunctionText: 'async ()=>{}',
                             showhiddenFunctionText: '()=>{return true}',
                             globalVar: {},
                             globalVarDefaultValue: {},
                             animation: {},
                             attrs: {
                                 style: {},
                                 class: '',
                                 propsFunctionText: `async ()=>{return ${defaultPropsStr}}`,
                                 listenerFunctionText: `()=>{return ${listenerStr} }`,
                                 ...attrs
                             }
                         },
                         attrs: {
                             style: {
                                 graph: { width: '100%', height: '100%', ...style }, // 绘图画布展示样式,与data.attrs.style合并后的到值
                                 stencil: c.type.startsWith('dv-')
                                     ? { ...style, ...scale, ...stencilStyle }
                                     : { width: '100%', height: '100%', ...style, ...stencilStyle } // 工具画布展示样式
                             },
                             config: {
                                 lock: false, // 控件锁定
                                 stencilImg
                             },
                             bussinessData: {
                                 id: '',
                                 jsonStr: '',
                                 workspaceId: '',
                                 isPublic: '',
                                 cellId: '',
                                 pushWorkspaceId: ''
                             }
                         }
                     };
                 }) : []
             };
             return obj;
         }, {}); */
    }
    const nodeList = fillNode(ComponentData)
    return JSON.parse(JSON.stringify(nodeList));
}
export const pageNode = {
    id: 'page',
    shape: 'custom-vue-node',
    width: 1920,
    height: 1080,
    x: 0,
    y: 0,
    zIndex: 0,
    data: {
        type: 'moon-dv-page',
        label: '页面',
        labelStyle: { display: 'none' },
        globalVar: {},
        globalVarDefaultValue: {},
        animation: {},
        prepareFunctionText: 'async ()=>{}',
        mainWorkspacePrepareFunctionText: 'async ()=>{}',
        showhiddenFunctionText: '()=>{return true}',
        attrs: {
            class: '',
            propsFunctionText: 'async ()=>{return{}}',
            listenerFunctionText: '()=>{return {click:()=>{}}}',
            // 屏幕等比缩放
            screamscale: true,
            style: {
                backgroundColor: '#0D2A43' //#c7e2f5'
            }
        },
        // 只有在主工作空间，page页中才能配置
        subWorkspaceShowHidden: {}
    },
    attrs: {
        style: {
            graph: {}, // 绘图画布展示样式,与data.attrs.style合并后的到值
            stencil: {}
        },
        config: {
            lock: true, // 控件锁定
            stencilImg: ''
        },
        bussinessData: {
            id: '',
            jsonStr: '',
            workspaceId: '',
            isPublic: '',
            cellId: '',
            pushWorkspaceId: ''
        }
    }
};

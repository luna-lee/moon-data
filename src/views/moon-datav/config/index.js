import echartsGraph from './echartsGraph/index';
import listGraph from './listGraph/index';
import reportGraph from './reportGraph/index';
import { getProjectListAll, getProjectGroup } from '@/service/index.js';
import { flatToTree } from '@/components-global/utils.js';
export const getComponentData = async (pageCellId) => {
    let {
        data: { list }
    } = await getProjectListAll({ type: 'component' });
    let { data } = await getProjectGroup({ type: 'component' });
    data = data.map(item => {
        return {
            ...item,
            groupName: item.name,
            icon: item.icon,
            nodeList: list.filter(v => v.groupId == item.id).map((v) => {
                return {
                    type: 'moon-dv-id-' + v.id,
                    label: v.name,
                    stencilImg: v.icon
                };
            })
        }
    })
    let { treeData } = flatToTree(data, 'id', 'parent');
    treeData.push({
        parent: "",
        groupName: '未分类',
        id: "",
        nodeList: list.filter(v => !v.groupId).map((item) => {
            return {
                type: 'moon-dv-id-' + item.id,
                label: item.name,
                stencilImg: item.icon
            };
        })
    })
    let customComponent = [];
    // 若当前项目为组件，为避免嵌套引用引起死循环，组件项目不显示自定义组件，
    let findCurrentProject = list.find((v) => v.id == pageCellId);
    if (!findCurrentProject) {
        customComponent.push({
            groupName: '自定义',
            icon: "el-icon-date",
            children: treeData/* list.map((item) => {
                return {
                    type: 'moon-dv-id-' + item.id,
                    label: item.name,
                    stencilImg: item.icon
                };
            }) */
        });
    }
    return [
        {
            groupName: '通用',
            icon: "el-icon-date",
            nodeList: [
                {
                    type: 'div',
                    label: '自定义组件',
                    isCustom: true,
                    defaultProps: {},
                    attrs: {
                        style: { border: '1px solid #b3b3b3' }
                    }
                },
                {
                    type: 'moon-dv-text',
                    label: '文本',
                    defaultProps: { value: '文本' },
                    stencilImg: '/static/img/文本.png',
                    attrs: {
                        style: {
                            display: 'flex',
                            'justify-content': 'center',
                            'align-items': 'center'
                        }
                    }
                },
                {
                    type: 'moon-dv-container',
                    label: '容器',
                    attrs: {
                        style: {
                            border: '1px dashed #b3b3b3'
                        }
                    }
                },

                {
                    type: 'dv-digital-flop',
                    label: '数字翻牌器',
                    stencilImg: '/static/img/数字翻牌器.png',
                    attrs: {
                        stencilStyle: { border: '1px solid #b3b3b3' },
                        propsFunctionText: `  async () => {
                        let props = {
                            "config": {
                                "number": [0],
                                "content": "{nt}个"
                            }
                        };
                        setTimeout(() => {
                            props.config = {
                                "number": [100],
                                "content": "{nt}个"
                            }
                        });
                        
                        return props
                    }`
                    }
                }
            ]

        },
        ...customComponent,
        {
            groupName: '图表',
            icon: "el-icon-date",
            nodeList: echartsGraph
        },
        {
            groupName: '报表',
            icon: "el-icon-date",
            nodeList: reportGraph
        },
        {
            groupName: '列表',
            icon: "el-icon-date",
            nodeList: listGraph
        },
        {
            groupName: '边框',
            icon: "el-icon-date",
            nodeList: Array.from({ length: 13 }).map((val, index) => {
                return {
                    type: `dv-border-box-${index + 1}`,
                    label: `边框${index + 1}`
                };
            })
        },
        {
            groupName: '装饰',
            icon: "el-icon-date",
            nodeList: Array.from({ length: 11 }).map((val, index) => {
                return {
                    type: `dv-decoration-${index + 1}`,
                    label: `装饰${index + 1}`
                };
            })
        },
        {
            groupName: '辅助',
            icon: "el-icon-date",
            nodeList: [
                {
                    type: `moon-dv-tool-line`,
                    label: `辅助线-x`,
                    attrs: {
                        direction: 'x'
                    }
                },
                {
                    type: 'moon-dv-tool-line',
                    label: `辅助线-y`,
                    attrs: {
                        direction: 'y'
                    }
                }
            ]
        }
    ]
}
/* 
    {
        base: {
            groupName: '通用',
                nodeList: [
                    {
                        type: 'div',
                        label: '自定义组件',
                        isCustom: true,
                        defaultProps: {},
                        attrs: {
                            style: { border: '1px solid #b3b3b3' }
                        }
                    },
                    {
                        type: 'moon-dv-text',
                        label: '文本',
                        defaultProps: { value: '文本' },
                        stencilImg: '/static/img/文本.png',
                        attrs: {
                            style: {
                                display: 'flex',
                                'justify-content': 'center',
                                'align-items': 'center'
                            }
                        }
                    },
                    {
                        type: 'moon-dv-container',
                        label: '容器',
                        attrs: {
                            style: {
                                border: '1px dashed #b3b3b3'
                            }
                        }
                    },

                    {
                        type: 'dv-digital-flop',
                        label: '数字翻牌器',
                        stencilImg: '/static/img/数字翻牌器.png',
                        attrs: {
                            stencilStyle: { border: '1px solid #b3b3b3' },
                            propsFunctionText: `  async () => {
                        let props = {
                            "config": {
                                "number": [0],
                                "content": "{nt}个"
                            }
                        };
                        setTimeout(() => {
                            props.config = {
                                "number": [100],
                                "content": "{nt}个"
                            }
                        });
                        
                        return props
                    }`
                        }
                    }
                ]
        },
        ...customComponent,
    graph: {
    groupName: '图表',
        nodeList: echartsGraph
},
report: {
    groupName: '报表',
        nodeList: reportGraph
},
listGraph: {
    groupName: '列表',
        nodeList: listGraph
},
border: {
    groupName: '边框',
        nodeList: Array.from({ length: 13 }).map((val, index) => {
            return {
                type: `dv-border-box-${index + 1}`,
                label: `边框${index + 1}`
            };
        })
},
decoration: {
    groupName: '装饰',
        nodeList: Array.from({ length: 11 }).map((val, index) => {
            return {
                type: `dv-decoration-${index + 1}`,
                label: `装饰${index + 1}`
            };
        })
},
tools: {
    groupName: '辅助',
        nodeList: [
            {
                type: `moon-dv-tool-line`,
                label: `辅助线-x`,
                attrs: {
                    direction: 'x'
                }
            },
            {
                type: 'moon-dv-tool-line',
                label: `辅助线-y`,
                attrs: {
                    direction: 'y'
                }
            }
        ]
}
    };
};
 */
# moon-menu

### 作者：闰月飞鸟；时间：2022/08/09

### 开发目的

-   扩展 el-menu 功能，新增额外的样式修改属性。对过长的标题进行省略展示，同时鼠标悬停显示全部内容
-   继承 el-menu 所有属性,事件和方法
-   继承 SubMenu 非数据关联的所有属性。如 popper-class show-timeout

### Props

| 参数                         | 说明                                                                                            | 类型    | 可选值 | 默认值                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------- | ------- | ------ | ---------------------------------------------------- |
| el-menu 所有属性             | -                                                                                               | -       | -      | -                                                    |
| hoverBgColor                 | 菜单 hover 背景颜色                                                                             | String  | -      | 默认 element-ui 颜色                                 |
| activeBgColor                | 菜单 active 背景颜色                                                                            | String  | -      | 默认 element-ui 颜色                                 |
| openBgColor                  | 菜单展开 open 背景颜色                                                                          | String  | -      | 默认 element-ui 颜色                                 |
| openTextColor                | 菜单展开 open 字体颜色                                                                          | String  | -      | 默认 element-ui 颜色                                 |
| itemStyle                    | 菜单内联样式                                                                                    | Object  | -      | {}                                                   |
| subMenu 非数据关联的所有属性 | -                                                                                               | -       | -      | -                                                    |
| menuList                     | 菜单数据                                                                                        | Array   | -      | []                                                   |
| isFalt                       | 菜单数据是否是扁平化的树层级数据，true 时组件会自动将 menuList 格式化为需要的树数据，否则不处理 | Boolean | -      | true                                                 |
| showEllipsisTip              | 当文字过长时是否出现省略号，鼠标悬停是否以 tip 的形式显示全名                                   | Boolean | -      | true                                                 |
| options                      | 组件 props 属性对应数据中的属性字段,以及构建树形数据的id，pId，和展示的name                                                             | Object  | -      | { index: 'id', route: 'route', disabled: 'disabled'， id: 'id', pId: 'pId', name: 'name'},其中，index,route,disabled, name 指定的属性可以是路径，如name:"meta.title"|

### Slot

| 名称 | 说明           | 参数         |
| ---- | -------------- | ------------ |
| icon | 图表作用域插槽 | 当前节点对象 |

### Event
| 名称 | 说明           | 参数         |
| ---- | -------------- | ------------ |
| menu-click | 菜单点击事件 | 当前节点对象 |



```
 <template>
    <div style="width: 100%">
        <moon-menu
            class="el-menu-horizontal-demo"
            background-color="#3c7ec3"
            hoverBgColor="#3c7ec3"
            text-color="#fff"
            active-text-color="#fff"
            activeBgColor="#2066b0"
            :collapse="isCollapse"
            :menuList="navList"
            :itemStyle="{ border: 'none', padding: '40px 30px', fontSize: '15px' }"
            mode="horizontal"
        >
            <template #icon="{ node }">
                <icon-svg v-if="node.icon" :name="node.icon" style="margin-right: 10px"></icon-svg>
            </template>
        </moon-menu>
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>

        <moon-menu
            class="el-menu-vertical-demo"
            background-color="#3c7ec3"
            hoverBgColor="#3c7ec3"
            text-color="#fff"
            active-text-color="#fff"
            activeBgColor="#2066b0"
            :menuList="menu"
            :collapse="isCollapse"
        >
            <template #icon="{ node }">
                <icon-svg v-if="node.icon" :name="node.icon" style="margin-right: 10px"></icon-svg>
            </template>
        </moon-menu>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: '',
    props: {},
    components: {   },
    created() {},
    mounted() {},
    data() {
        return {
            isCollapse: false,
            menu: [
                {
                    id: 'dddd',
                    pId: '',
                    name: 'xxxx'
                },
                {
                    id: '6d9af07d8b374d3988eaaf5e9556e0b0',
                    pId: '4c8dfabeea4f4189b5bc3e8d54f93483',
                    name: '工作台',
                    icon: ''
                },
                {
                    id: '038fd2bcdfbe4cdd80d8e9806f786f1c',
                    pId: 'e2eedba3f5e4497c94874a102392016d',
                    name: '企业综合查询',
                    icon: 'chaxun'
                },
                {
                    id: '2d360e3b46e844319c8027eed10ad9f0',
                    pId: '63dcaeddef534f589b7f2331b18b240b',
                    name: '企业总览',
                    icon: ''
                },
                {
                    id: '54e27e0f5e76401eb093b02e3c4922ee',
                    pId: 'e9b967530096444db095ffef70a57d3f',
                    name: '企业分类评价列表',
                    icon: ''
                },
                {
                    id: '66ab363e48e240ce8870a60e11e1b233',
                    pId: '42bf0246e4344e54ac9edd483929a18d',
                    name: '培育企业管理',
                    icon: 'chaxun'
                },
                {
                    id: '88221e5e2e3f473dadc8db4e73fe5249',
                    pId: '67a29d39f5e211eca43e00ff4184a389',
                    name: '监测概览',
                    icon: ''
                },
                {
                    id: 'e2eedba3f5e4497c94874a102392016d',
                    pId: '4c8dfabeea4f4189b5bc3e8d54f93483',
                    name: '企业综合管理',
                    icon: 'system'
                },
                {
                    id: '6a03bb7ce1024ca7835cdb881b8207ea',
                    pId: '63dcaeddef534f589b7f2331b18b240b',
                    name: '重点企业分析',
                    icon: ''
                },
                {
                    id: '79316763f5e311eca43e00ff4184a389',
                    pId: '42bf0246e4344e54ac9edd483929a18d',
                    name: '科小备案管理',
                    icon: 'chaxun'
                },
                {
                    id: 'b5f775a3f5e311eca43e00ff4184a389',
                    pId: '67a29d39f5e211eca43e00ff4184a389',
                    name: '监测动态信息',
                    icon: ''
                },
                {
                    id: 'b9563880f5e211eca43e00ff4184a389',
                    pId: 'e2eedba3f5e4497c94874a102392016d',
                    name: '企业云图',
                    icon: 'corpUserNum'
                },
                {
                    id: 'e9b967530096444db095ffef70a57d3f',
                    pId: '4c8dfabeea4f4189b5bc3e8d54f93483',
                    name: '企业分类评价',
                    icon: 'building'
                },
                {
                    id: 'f010023d6ace4abc91653ebe2566e870',
                    pId: 'e9b967530096444db095ffef70a57d3f',
                    name: '企业分类评价统计',
                    icon: ''
                },
                {
                    id: '5c085d2b79884e5c86a124ed0491e8da',
                    pId: '63dcaeddef534f589b7f2331b18b240b',
                    name: '能耗分析',
                    icon: ''
                },
                {
                    id: '63dcaeddef534f589b7f2331b18b240b',
                    pId: '4c8dfabeea4f4189b5bc3e8d54f93483',
                    name: '企业专题分析',
                    icon: 'building'
                },
                {
                    id: '793167adf5e311eca43e00ff4184a389',
                    pId: '42bf0246e4344e54ac9edd483929a18d',
                    name: '快审备案管理',
                    icon: 'config'
                },
                {
                    id: '8127fa16777d470487fec51ca86eac51',
                    pId: 'e2eedba3f5e4497c94874a102392016d',
                    name: '企业标签管理',
                    icon: 'corpUserNum'
                },
                {
                    id: 'b5f775c0f5e311eca43e00ff4184a389',
                    pId: '67a29d39f5e211eca43e00ff4184a389',
                    name: '企业监测设置',
                    icon: ''
                },
                {
                    id: '2deaccf499ee4bdc93fdeeaba10c02d6',
                    pId: '63dcaeddef534f589b7f2331b18b240b',
                    name: '科创能力分析',
                    icon: ''
                },
                {
                    id: '42bf0246e4344e54ac9edd483929a18d',
                    pId: '4c8dfabeea4f4189b5bc3e8d54f93483',
                    name: '高成长型企业识别',
                    icon: 'sousuo'
                },
                {
                    id: '793167c9f5e311eca43e00ff4184a389',
                    pId: '42bf0246e4344e54ac9edd483929a18d',
                    name: '推荐培育识别',
                    icon: 'copy'
                },
                {
                    id: 'b5f775d1f5e311eca43e00ff4184a389',
                    pId: '67a29d39f5e211eca43e00ff4184a389',
                    name: '异常企业分析',
                    icon: ''
                },
                {
                    id: '67a29d39f5e211eca43e00ff4184a389',
                    pId: '4c8dfabeea4f4189b5bc3e8d54f93483',
                    name: '企业监测预警',
                    icon: 'sousuo'
                },
                {
                    id: '793167d8f5e311eca43e00ff4184a389',
                    pId: '42bf0246e4344e54ac9edd483929a18d',
                    name: '推荐培育识别配置',
                    icon: 'config'
                },
                {
                    id: 'ab89d99bfc2447ca83dcd680b951b675',
                    pId: '63dcaeddef534f589b7f2331b18b240b',
                    name: '税收分析',
                    icon: ''
                },
                {
                    id: 'c409e99f888e40378afd09053f055ba1',
                    pId: '63dcaeddef534f589b7f2331b18b240b',
                    name: '财政补贴分析',
                    icon: ''
                }
            ],
            navList: [
                {
                    name: '蜀心办',
                    applicationCode: 'SSGRID_WEB',
                    url: '',
                    icon: 'xiangqu',
                    moduleStatus: '1006_NORMAL',
                    orderNum: 1,
                    target: '0',
                    isFullScreen: '0',
                    isShowNav: '1',
                    appPath: '',
                    buttonList: null,
                    id: 'cc3857711dfe421bb4c8622216d73bc2',
                    isDel: 0,
                    creator: '1',
                    createdTime: '2022-08-05 10:22:32',
                    lastUpdatedBy: '1',
                    lastUpdatedTime: '2022-08-05 10:31:03',
                    createdUnit: '4855ba5babad493f81650c80d5e282c0',
                    lastUpdatedUnit: '4855ba5babad493f81650c80d5e282c0'
                },
                {
                    name: '企业监测',
                    applicationCode: 'SSGRID_WEB',
                    url: '',
                    icon: 'pop',
                    moduleStatus: '1006_NORMAL',
                    orderNum: 2,
                    target: '1',
                    isFullScreen: '0',
                    isShowNav: '0',
                    appPath: '',
                    buttonList: null,
                    id: '4c8dfabeea4f4189b5bc3e8d54f93483',
                    isDel: 0,
                    creator: '1',
                    createdTime: '2022-06-09 11:35:35',
                    lastUpdatedBy: '1',
                    lastUpdatedTime: '2022-07-05 10:31:55',
                    createdUnit: '4855ba5babad493f81650c80d5e282c0',
                    lastUpdatedUnit: '4855ba5babad493f81650c80d5e282c0'
                },
                {
                    name: '资源管理',
                    applicationCode: 'SSGRID_WEB',
                    url: '',
                    icon: 'qsy',
                    moduleStatus: '1006_NORMAL',
                    orderNum: 3,
                    target: '0',
                    isFullScreen: '0',
                    isShowNav: '1',
                    appPath: 'zjgResource',
                    buttonList: null,
                    id: '6a145f36154e4abd8f016424a7e9e733',
                    isDel: 0,
                    creator: '1',
                    createdTime: '2022-06-27 13:29:36',
                    lastUpdatedBy: '1',
                    lastUpdatedTime: '2022-08-03 15:00:55',
                    createdUnit: '4855ba5babad493f81650c80d5e282c0',
                    lastUpdatedUnit: '4855ba5babad493f81650c80d5e282c0'
                },
                {
                    name: '产业发展',
                    applicationCode: 'SSGRID_WEB',
                    url: '',
                    icon: 'mudedi',
                    moduleStatus: '1006_NORMAL',
                    orderNum: 4,
                    target: '0',
                    isFullScreen: '0',
                    isShowNav: '1',
                    appPath: '',
                    buttonList: null,
                    id: '8eda2c2c1582425bacc5a287b6c4bc85',
                    isDel: 0,
                    creator: '1',
                    createdTime: '2022-06-27 13:29:58',
                    lastUpdatedBy: '1',
                    lastUpdatedTime: '2022-07-05 10:31:05',
                    createdUnit: '4855ba5babad493f81650c80d5e282c0',
                    lastUpdatedUnit: '4855ba5babad493f81650c80d5e282c0'
                },
                {
                    name: '数智招商',
                    applicationCode: 'SSGRID_WEB',
                    url: '',
                    icon: 'money',
                    moduleStatus: '1006_NORMAL',
                    orderNum: 5,
                    target: '0',
                    isFullScreen: '0',
                    isShowNav: '1',
                    appPath: '',
                    buttonList: null,
                    id: '9e00c1f47fee43adb570cebd3f6bf912',
                    isDel: 0,
                    creator: '1',
                    createdTime: '2022-06-27 13:30:13',
                    lastUpdatedBy: '1',
                    lastUpdatedTime: '2022-07-05 10:31:31',
                    createdUnit: '4855ba5babad493f81650c80d5e282c0',
                    lastUpdatedUnit: '4855ba5babad493f81650c80d5e282c0'
                },
                {
                    name: '惠企赋能',
                    applicationCode: 'SSGRID_WEB',
                    url: '',
                    icon: 'xz',
                    moduleStatus: '1006_NORMAL',
                    orderNum: 6,
                    target: '0',
                    isFullScreen: '0',
                    isShowNav: '1',
                    appPath: '',
                    buttonList: null,
                    id: '6aa1182341074f1b8fee79c0188cd84e',
                    isDel: 0,
                    creator: '1',
                    createdTime: '2022-06-27 13:30:28',
                    lastUpdatedBy: '1',
                    lastUpdatedTime: '2022-07-05 10:32:20',
                    createdUnit: '4855ba5babad493f81650c80d5e282c0',
                    lastUpdatedUnit: '4855ba5babad493f81650c80d5e282c0'
                },
                {
                    name: '经济服务',
                    applicationCode: 'SSGRID_WEB',
                    url: '',
                    icon: 'usersc',
                    moduleStatus: '1006_NORMAL',
                    orderNum: 7,
                    target: '0',
                    isFullScreen: '0',
                    isShowNav: '1',
                    appPath: '',
                    buttonList: null,
                    id: '62854e7643364741a9ec5ec03158da36',
                    isDel: 0,
                    creator: '1',
                    createdTime: '2022-06-27 13:30:43',
                    lastUpdatedBy: '1',
                    lastUpdatedTime: '2022-07-05 10:32:44',
                    createdUnit: '4855ba5babad493f81650c80d5e282c0',
                    lastUpdatedUnit: '4855ba5babad493f81650c80d5e282c0'
                },
                {
                    name: '系统管理',
                    applicationCode: 'SSGRID_WEB',
                    url: '',
                    icon: 'system',
                    moduleStatus: '1006_NORMAL',
                    orderNum: 8,
                    target: '1',
                    isFullScreen: '1',
                    isShowNav: '1',
                    appPath: 'system',
                    buttonList: null,
                    id: '546183f15bd04059aaa139ff538d12a6',
                    isDel: 0,
                    creator: '1',
                    createdTime: '2022-06-27 13:31:38',
                    lastUpdatedBy: '1',
                    lastUpdatedTime: '2022-07-05 10:33:03',
                    createdUnit: '4855ba5babad493f81650c80d5e282c0',
                    lastUpdatedUnit: '4855ba5babad493f81650c80d5e282c0'
                }
            ]
        };
    },
    watch: {},
    computed: {},
    methods: {
        change(e) {},
        handleOpen(key, keyPath) {
            //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            //console.log(key, keyPath);
        }
    }
};
</script>
<style lang="less" scoped>
.div {
    float: right;
    padding: 10px;
    border: 1px solid red;
}
.clear-float {
    &::before,
    &::after {
        content: 'ddddd';
        display: block;
        height: 0;
        visibility: hidden;
        clear: both;
    }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 240px;
}
.el-menu-horizontal-demo {
    width: 100%;
}
</style>


```

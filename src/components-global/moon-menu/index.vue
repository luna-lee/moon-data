<script>
import { resize } from '@/components-global/directives.js';
import { flatToTree } from '@/components-global/utils.js';
import { cloneDeep, get } from 'lodash';
import { Menu, Submenu, MenuItem } from 'element-ui';
delete Menu._Ctor;
delete MenuItem._Ctor;
delete Submenu._Ctor;
//props添加菜单hover背景颜色,默认element-ui颜色
Menu.props.hoverBgColor = { type: String, default: '' };
//props添加菜单active背景颜色,默认element-ui颜色
Menu.props.activeBgColor = { type: String, default: '' };
//props添加菜单展开open背景颜色,默认element-ui颜色
Menu.props.openBgColor = { type: String, default: '' };
Menu.props.openTextColor = { type: String, default: '' };
// 单元内联样式
Menu.props.itemStyle = { type: Object, default: () => ({}) };

Menu.computed.hoverBackground = function () {
    if (this.hoverBgColor) return this.hoverBgColor;
    else return this.backgroundColor ? this.mixColor(this.backgroundColor, 0.2) : '';
};
MenuItem.computed.backgroundColor = function () {
    if (this.active && this.rootMenu.activeBgColor) return this.rootMenu.activeBgColor;
    return this.rootMenu.backgroundColor || '';
};
MenuItem.computed.itemStyle = function () {
    const style = {
        color: this.active ? this.activeTextColor : this.textColor
    };
    if (this.mode === 'horizontal' && !this.isNested) {
        style.borderBottomColor = this.active ? (this.rootMenu.activeTextColor ? this.activeTextColor : '') : 'transparent';
    }

    return { ...style, ...this.rootMenu.itemStyle };
};

Submenu.computed.titleStyle = function () {
    if (this.mode !== 'horizontal') {
        return {
            color: this.textColor
        };
    }
    return {
        borderBottomColor: this.active ? (this.rootMenu.activeTextColor ? this.activeTextColor : '') : 'transparent',
        color: this.active ? this.activeTextColor : this.textColor,
        ...this.rootMenu.itemStyle
    };
};

Submenu.methods.handleTitleMouseenter = function () {
    if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
    const title = this.$refs['submenu-title'];
    if (this.opened && this.rootMenu.openBgColor) title && (title.style.backgroundColor = this.rootMenu.openBgColor);
    else title && (title.style.backgroundColor = this.rootMenu.hoverBackground);
};
Submenu.methods.handleTitleMouseleave = function () {
    const title = this.$refs['submenu-title'];
    if (this.opened && this.rootMenu.openBgColor) title && (title.style.backgroundColor = this.rootMenu.openBgColor);
    else title && (title.style.backgroundColor = this.rootMenu.backgroundColor);
};
//重写submenu组件中opened监听函数，
Submenu.watch.opened = function (val) {
    if (this.isMenuPopup) {
        this.$nextTick(() => {
            this.updatePopper();
        });
    }
    const title = this.$refs['submenu-title'];
    if (val) {
        title && this.rootMenu.openBgColor && (title.style.backgroundColor = this.rootMenu.openBgColor);
        title && this.rootMenu.openTextColor && (title.style.color = this.rootMenu.openTextColor);
    } else {
        title && (title.style.backgroundColor = this.rootMenu.backgroundColor);
        title && (title.style.color = this.rootMenu.textColor);
    }
};
export default {
    inheritAttrs: false,
    name: 'MoonMenu',
    beforeCreate() {},
    props: {
        menuList: {
            type: Array,
            default: () => []
        },
        isFalt: { type: Boolean, default: true },
        //当文字过长时会出现省略号，鼠标悬停是否以tip的形式显示全名
        showEllipsisTip: {
            type: Boolean,
            default: true
        },
        //组件props属性对应数据中的属性字段
        options: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        CustomMenu: Menu,
        Submenu,
        MenuItem
    },
    created() {},
    directives: {
        resize
    },
    mounted() {},
    data() {
        return {
            inner_menu: []
        };
    },
    watch: {
        menuList: {
            handler() {
                if (this.isFalt) {
                    let { treeData } = flatToTree(cloneDeep(this.menuList), this.inner_options['id'], this.inner_options['pId']);
                    this.inner_menu = treeData;
                } else {
                    this.inner_menu = cloneDeep(this.menuList);
                }
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        inner_options() {
            return { index: 'id', route: 'route', disabled: 'disabled', id: 'id', pId: 'pId', name: 'name', ...this.options };
        }
    },
    render() {
        let _this = this;
        const iconNode = (node) => {
            return _this.$scopedSlots?.icon?.({ node });
        };
        const titleNode = (node) => {
            return (
                <el-tooltip slot="title" effect="dark" content={node.name} placement="top-end" disabled={node.__hiddenToolTip__ || node.__hiddenToolTip__ === undefined || !_this.showEllipsisTip}>
                    <span v-resize={(el) => _this.handleEllipsis(el, node)} class="item-title-text">
                        {get(node, _this.inner_options.name)}
                    </span>
                </el-tooltip>
            );
        };
        const createMenuItem = (nodeList) => {
            return nodeList.map((node) => {
                if (node.children && node.children.length) {
                    if (node.isGroup)
                        return (
                            <el-menu-item-group>
                                {titleNode(node)}
                                {createMenuItem(node.children)}
                            </el-menu-item-group>
                        );
                    else
                        return (
                            <Submenu
                                index={get(node, _this.inner_options.index, '')}
                                popper-class={`sub-menu-popper-class ${_this.$attrs['popper-class'] || ''}`}
                                disabled={get(node, _this.inner_options.disabled, false)}
                                show-timeout={_this.$attrs['show-timeout'] || 300}
                                hide-timeout={_this.$attrs['hide-timeout'] || 300}
                            >
                                <template slot="title">
                                    {iconNode(node)}
                                    {titleNode(node)}
                                </template>
                                {createMenuItem(node.children)}
                            </Submenu>
                        );
                } else
                    return (
                        <MenuItem
                            index={get(node, _this.inner_options.index)}
                            route={get(node, _this.inner_options.route, '')}
                            disabled={get(node, _this.inner_options.disabled, false)}
                            onClick={(el) => {
                                _this.handlerMenuItemClick(el, node);
                            }}
                        >
                            {iconNode(node)}
                            {titleNode(node)}
                        </MenuItem>
                    );
            });
        };
        return (
            <CustomMenu
                ref="CustomMenu"
                {...{
                    attrs: { ...this.$attrs },
                    on: { ...this.$listeners }
                }}
            >
                {createMenuItem(this.inner_menu)}
            </CustomMenu>
        );
    },
    methods: {
        handlerMenuItemClick(el, menu) {
            this.$emit('menu-click', menu);
        },
        handleEllipsis(el, node) {
            setTimeout(() => {
                this.$set(node, '__hiddenToolTip__', el.offsetWidth >= el.scrollWidth);
            }, this.$attrs['show-timeout'] || 300);
        },
        open(index) {
            this.$refs.CustomMenu.open(index);
        },
        close(index) {
            this.$refs.CustomMenu.close(index);
        }
    }
};
</script>
<style lang="scss">
// popper-class由于挂载到body中，所以此clas需要写在全局
.sub-menu-popper-class {
    width: 0;
    .el-submenu__title,
    .el-menu-item,
    .el-menu-item-group__title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
}
</style>
<style lang="scss" scoped>
::v-deep(.el-submenu__title),
.el-menu-item,
.el-menu-item-group__title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.item-title-text {
    // 水平模式可以通过修改这个width调节宽度
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}
.el-menu.el-menu--horizontal {
    border-bottom: none;
}
</style>

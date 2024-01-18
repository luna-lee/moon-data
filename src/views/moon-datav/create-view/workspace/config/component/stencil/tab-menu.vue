<script>
import { cloneDeep } from 'lodash';

export default {
    inheritAttrs: false,
    name: '',
    props: {
        height: {
            type: String,
            default: '100vh'
        },
        menuList: {
            type: Array,
            default: () => []
        },
        autoSelect: {
            type: Boolean,
            default: true
        }
    },
    components: {},
    render() {
        let _this = this;
        let creatDom = (arr, level) => {
            return (
                <moon-scroll class="list" style={{ height: _this.height }}>
                    {arr.map((item) => (
                        <div
                            class={'item ' + (_this.current.includes(item) ? 'selected' : '')}
                            title={item.groupName}
                            onclick={() => _this.onSelect(item, level)}
                        >
                            <i class={(item.icon ? item.icon : 'el-icon-date') + ' icon'}></i>
                            <div class="name">{item.groupName}</div>
                        </div>
                    ))}
                </moon-scroll>
            );
        };

        return (
            <div class="tab-menu">
                {this.list.map((o, index) => {
                    return creatDom(o.children || [], index);
                })}
            </div>
        );
    },
    created() {},
    mounted() {},
    data() {
        return {
            current: [],
            currentOldValue: [],
            list: [
                {
                    // 传入的list
                    children: []
                }
            ]
        };
    },
    watch: {
        menuList: {
            handler() {
                this.list = this.$options.data().list;
                this.list[0].children = cloneDeep(this.menuList);
                // 默认选择第一个
                this.onSelect(this.menuList[0], 0);
            },
            deep: true,
            immediate: true
        },
        current: {
            handler() {
                // 只有当新旧不一样时才触发chang事件
                let flag = this.current.some((v, i) => {
                    return v != this.currentOldValue[i];
                });
                if (flag) {
                    this.currentOldValue = [...this.current];
                    this.$emit('change', cloneDeep(this.current));
                }
            },
            deep: true
        }
    },
    computed: {},
    methods: {
        onSelect(item, index) {
            if (item?.children?.length) {
                if (index != this.list.length - 1) {
                    if (this.current[index] != item) {
                        this.list = this.list.slice(0, index + 1);
                        this.current = this.current.slice(0, index + 1);
                        this.list.push(item);
                        this.setSubList(item);
                    }
                } else {
                    this.list.push(item);
                    this.setSubList(item);
                }
            } else {
                if (index != this.list.length - 1) {
                    this.list = this.list.slice(0, index + 1);
                    this.current = this.current.slice(0, index + 1);
                }
            }
            this.current.splice(index, 1, item);
            // 自动选中子节点的第一个
            this.setSubSelect(item);
        },
        setSubSelect(item) {
            if (item?.children?.length && this.autoSelect) {
                let subItem = item.children[0];
                // 所有子节点都不在选中队列中时才处理
                if (!item.children.some((v) => this.current.includes(v))) {
                    this.current.push(subItem);
                    this.setSubSelect(subItem);
                }
            }
        },
        setSubList(item) {
            if (item?.children?.length && this.autoSelect) {
                let subItem = item.children[0];
                // 只有拥有子节点时才push
                if (!this.list.includes(subItem) && subItem?.children?.length) {
                    this.list.push(subItem);
                    this.setSubList(subItem);
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.tab-menu {
    display: flex;
}
.list {
    background-color: inherit;
    .item {
        width: 3rem;
        height: 4.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        cursor: pointer;
        color: #fff;
        &.selected {
            color: #409eff;
        }
        .icon {
            font-size: 18px;
            margin-bottom: 10px;
        }
        .name {
            width: 3rem;
            flex-shrink: 0;
            font-size: 12px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: center;
        }
    }
}
</style>

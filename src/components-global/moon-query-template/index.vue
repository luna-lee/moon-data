<script>
import { setEventListener } from '../utils';
export default {
    name: 'MoonQueryTemplate',
    inheritAttrs: false,
    props: {
        //设置默认展示的区域的宽度，不设置时使用一行中所有html元素的默认宽度的总和值作为宽度
        width: String,
        // 默认视图与折叠视图是否对齐排序，对齐排序则所有折叠的视图展示时都不会超出按钮所占垂直区域
        isAlign: {
            type: Boolean,
            default: true
        },
        // 键盘回车触发查询事件
        keyEnterQuery: {
            type: Boolean,
            default: true
        }
    },
    components: {},
    created() {
        if (this.keyEnterQuery) {
            let _this = this;
            setEventListener(window, this, 'keyup', (e) => {
                e.key == 'Enter' && _this.onQuery();
            });
        }
    },
    data() {
        return {
            queryShow: false //默认折叠 收起
        };
    },
    render() {
        return this.isAlign ? (
            <div {...{ style: { width: this.width, display: 'flex' } }}>
                <div {...{ style: { flex: 1 } }}>
                    <moon-form-template {...{ attrs: { ...this.$attrs } }}>{this.renderCell()}</moon-form-template>
                    <el-collapse-transition>
                        <moon-form-template v-show={this.queryShow} {...{ attrs: { ...this.$attrs } }}>
                            {this.renderCell(true)}
                        </moon-form-template>
                    </el-collapse-transition>
                </div>
                <div {...{ style: { minWidth: this.isShowFold() ? '170px' : '85px' } }}>
                    <el-button type="primary" class="button" icon="el-icon-search" onClick={this.onQuery}>
                        查询
                    </el-button>
                    {this.isShowFold() && (
                        <el-button class="button" icon={this.queryShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'} onClick={this.changeFold}>
                            {this.queryShow ? '收起' : '展开'}
                        </el-button>
                    )}
                    {this.$slots.button && this.$slots.button}
                </div>
            </div>
        ) : (
            <div>
                <div style="width:100%;display:flex">
                    <moon-form-template {...{ attrs: { ...this.$attrs } }} {...{ style: { width: this.width } }}>
                        {this.renderCell()}
                    </moon-form-template>
                    <div {...{ style: { minWidth: this.isShowFold() ? '170px' : '85px' } }}>
                        <el-button type="primary" class="button" icon="el-icon-search" onClick={this.onQuery}>
                            查询
                        </el-button>
                        {this.isShowFold() && (
                            <el-button class="button" icon={this.queryShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'} onClick={this.changeFold}>
                                {this.queryShow ? '收起' : '展开'}
                            </el-button>
                        )}
                        {this.$slots.button && this.$slots.button}
                    </div>
                </div>
                <el-collapse-transition>
                    <moon-form-template v-show={this.queryShow} {...{ attrs: { ...this.$attrs } }}>
                        {this.renderCell(true)}
                    </moon-form-template>
                </el-collapse-transition>
            </div>
        );
    },
    computed: {},
    watch: {},
    methods: {
        isShowFold() {
            //是否显示折叠按钮，依据slot中有没有 带有br属性的元素
            let fistBrIndex = this.fistBrIndex();
            let sum = this.$slots.default?.length;
            if (fistBrIndex != sum) return true;
            else return false;
        },
        changeFold() {
            this.queryShow = !this.queryShow;
        },
        onQuery() {
            this.$emit('onQuery');
        },
        renderCell(isFold = false) {
            let vnodeList = this.$slots.default;
            if (!vnodeList) return;
            let cutIndex = this.fistBrIndex();
            //isFold 加载折叠区域的slot
            if (!isFold) return vnodeList.slice(0, cutIndex);
            else return vnodeList.slice(cutIndex);
        },
        //在格式化后的VnodeList上查找到第一个br的位置，用于截取出折行的VnodeList和不折行的VnodeList
        fistBrIndex() {
            let vnodeList = this.$slots.default;
            if (!vnodeList) return;
            let fistBrIndex = vnodeList.length;
            vnodeList.some((vnode, index) => {
                if (vnode?.data?.attrs?.br || vnode?.data?.attrs?.br === '') {
                    fistBrIndex = index;
                    return true;
                }
            });
            return fistBrIndex;
        }
    }
};
</script>
<style lang="less" scoped>
//表单样式微调
::v-deep(.el-form-item) {
    margin-bottom: 10px;
    // .el-form-item__label {
    //     padding: 0;
    // }
}

.button {
    margin-left: 10px;
    padding: 10px;
}

::v-deep(.el-select) {
    width: 100%;
}
</style>

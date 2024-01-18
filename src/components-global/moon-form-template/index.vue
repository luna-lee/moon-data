<script>
import { getUUID } from '../utils';
export default {
    inheritAttrs: false,
    name: 'moon-form-template',
    props: {
        //设置全局间隔，参考el-row el-col <el-form-item>上也能传offset，用于指定改元素的间隔
        offset: {
            type: [String, Number],
            default: 0
        },
        //设置全局尺寸，参考el-row el-col。 <el-form-item>上也能传span，用于指定改元素的尺寸

        //设置全局间隔，参考el-row el-col
        gutter: {
            type: [String, Number],
            default: 0
        },
        layout: {
            //布局方式，多行布局rows、单行浮动布局row
            type: String,
            default: 'row'
        }
    },
    components: {},
    created() {},
    mounted() {},
    data() {
        return {
            ref: getUUID(),
            //表单默认配置
            formDefaultProps: {
                'label-position': 'right',
                'label-width': '8rem',
                'show-message': false
            }
        };
    },
    render() {
        return (
            <el-form
                class="moon-form-template"
                {...{
                    attrs: { ...this.formDefaultProps, ...this.$attrs },
                    on: { ...this.$listeners }
                }}
                ref={this.ref}
            >
                {this.layout == 'float' ? (
                    <el-row gutter={this.gutter}>
                        {this.renderCell().map((list) => {
                            return list.map((vnode) => {
                                return (
                                    <el-col
                                        {...{
                                            attrs: {
                                                offset: this.offset,
                                                ...this.$attrs,
                                                ...(vnode.data && vnode.data.attrs)
                                            }
                                        }}
                                    >
                                        {vnode}
                                    </el-col>
                                );
                            });
                        })}
                    </el-row>
                ) : (
                    this.renderCell().map((list) => {
                        return (
                            <el-row gutter={this.gutter}>
                                {list.map((vnode) => {
                                    return (
                                        <el-col
                                            {...{
                                                attrs: {
                                                    offset: this.offset,
                                                    ...this.$attrs,
                                                    ...(vnode.data && vnode.data.attrs)
                                                }
                                            }}
                                        >
                                            {vnode}
                                        </el-col>
                                    );
                                })}
                            </el-row>
                        );
                    })
                )}
            </el-form>
        );
    },
    watch: {},
    computed: {},
    methods: {
        //父组件通过ref方法次方法
        validate() {
            let flag = false;
            this.$refs[this.ref].validate((valid) => {
                if (valid) {
                    flag = true;
                }
            });
            return flag;
        },
        //返回一个校验结果对象 flag是否成功，fields：不成功的属性以及错误提示
        validate_cb() {
            let res = {
                flag: true, //结果标记
                fields: null //错误对应的属性集
            };
            this.$refs[this.ref].validate((valid, fields) => {
                if (valid) {
                    res.flag = true;
                } else {
                    res = {
                        flag: false,
                        fields
                    };
                }
            });
            return res;
        },
        renderCell() {
            //判断是否传递了slot
            if (!this.$slots.default) return [];
            //span 累计24 或 带有br属性的 换行
            let colSpan = 0;
            let res = this.$slots.default.reduce(
                (list, vnode) => {
                    colSpan += vnode?.data?.attrs?.span || this.$attrs?.span || 24;
                    if (vnode?.data?.attrs?.br || vnode?.data?.attrs?.br === '' || colSpan > 24) {
                        list.push([vnode]);
                        colSpan = vnode?.data?.attrs?.span || this.$attrs?.span || 24;
                    } else {
                        list[list.length - 1].push(vnode);
                    }
                    return list;
                },
                [[]]
            );
            return res;
        },
        clearValidate() {
            this.$refs[this.ref].clearValidate();
        },
        resetFields() {
            this.$refs[this.ref].resetFields();
        }
    }
};
</script>
<style lang="less" scoped>
// 设置 表单is-disabled 时的状态
.moon-form-template {
    ::v-deep(.is-disabled) {
        .el-input__inner,
        .el-textarea__inner {
            background-color: #fff !important;
            color: #303133;
        }

        .el-input__suffix {
            display: none !important;
        }

        input::-webkit-input-placeholder {
            opacity: 0;
        }

        textarea::-webkit-input-placeholder {
            opacity: 0;
        }
    }

    ::v-deep(.is-disabled:not(.border-normal)) {
        .el-input__inner,
        .el-textarea__inner {
            border-color: #fff !important;
        }
    }

    ::v-deep(.el-form-item) {
        margin-bottom: 10px;
    }

    ::v-deep(.el-form-item.is-error) {
        // border 1后，由于margin-bottom: 10px；导致样式会变形，需要重新修改margin-bottom
        margin-bottom: 10px;

        .el-form-item__content {
            border: 1px solid #f56c6c;
            border-radius: 5px;

            .el-input__inner,
            .el-input__inner:focus,
            .el-textarea__inner,
            .el-textarea__inner:focus,
            .el-message-box__input input.invalid,
            .el-message-box__input input.invalid:focus {
                border: none !important;
            }
        }
    }
}
</style>

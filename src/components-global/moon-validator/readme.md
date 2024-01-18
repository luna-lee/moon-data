# moon-validator
### 作者：闰月飞鸟；时间：2022年07月27日13:41:08
### 开发目的
- 对对象数据，对象数组，数组对象类型的数据进行检验，同时将将校验结果反馈到数据对应的dom元素上

### Props 
参数 |说明|类型|可选值|默认值
---|---|---|---|---
mode|校验的对象|Boolean，Array| -|{}
rules|校验规则，参考[async-validator](https://github.com/yiminghe/async-validator)|Object|-|{}
showErrorMsgTip|是否以tip的形式显示校验错误信息|Boolean|-|true


 ###  Slot
  名称 |说明| 参数
---|---|---|
defautl|-|-


### Slot-Dom
|说明| 
---|
将mode中需要校验的属性的路径，绑定到需要与之对应的dom节点上validate-prop属性中即可，可以同时绑定在多个元素上|
例：mode={a:"",c:{e:'e',d:[{f:'f'}]}}  mode.a的路径就是'a'。mode.c.e=>'c.e',mode.c.d[0].f=>'c.d.0.f' |

 ###  Methods
  名称 |说明| 参数|返回值
---|---|---|---|
validate|校验整个对象。并返回校验结果|showMessage：Boolean,是否用message抛出第一个错误信息。|{flag,errors,fields,fieldKeys} flag：校验结果，true成功，false失败。errors，fields，失败后返回数据，参考[async-validator](https://github.com/yiminghe/async-validator)，fieldKeys：校验单元对应的key值
reload|重载配置，在数组只是元素交换位置时，需要调用该方法。重置校验配置，如配合拖拽组件时，拖拽成功后需要调用此方法|-|-
# Example
``` javascript
<template>
    <div>
        <el-divider>moon-validator数据视图校验器</el-divider>
        <p>moon-validator支持对象与数组，校验结果同时展示在所validate-prop属性值的元素上 若组件嵌套。对内嵌的moon-validator中的内容不做校验</p>
        <moon-validator ref="moonValidator1" :mode="mode" :rules="rules">
            <div>
                姓名
                <el-input v-model="mode.name" validate-prop="name"></el-input>
            </div>
            <div v-for="(value, index) in mode.family" :key="index">
                {{ value.label }} <el-input v-model="value.name" :validate-prop="`family.${index}.name`"></el-input>
                <el-button @click="mode.family.splice(index, 1)">remove</el-button>
            </div>
            <el-button @click="validate(1)">验证表单1</el-button>
            <el-button @click="clear(1)">清除表单1验证css</el-button>
            <el-button @click="mode.family.push({ label: Math.random(10), name: '' })">add</el-button>

            <div>
                <el-divider>moon-validator内嵌</el-divider>
                <moon-validator ref="moonValidator2" :mode="mode2" :rules="rules">
                    <div validate-prop="name">
                        姓名
                        <el-input v-model="mode2.name" disabled></el-input>
                        <el-select v-model="mode2.name" placeholder="请选择" clearable>
                            <el-option label="item.label" value="item.value"> </el-option>
                            <el-option label="item.label1" value="item.value2"> </el-option>
                        </el-select>
                        <el-button>dd</el-button>
                    </div>
                    <div v-for="(value, index) in mode2.family" :key="index">{{ value.label }} <el-input v-model="value.name" :validate-prop="`family.${index}.name`"></el-input></div>
                </moon-validator>
            </div>
        </moon-validator>
        <el-button @click="validate(2)">验证表单2</el-button>
        <el-button @click="clear(2)">清除表单2验证css</el-button>
        <el-divider>moon-validator 数组对象</el-divider>
        <moon-validator ref="moonValidator3" :mode="range" :rules="rangeRules">
            开始
            <el-input v-model="range[0].begin" validate-prop="0.begin"></el-input>
            结束
            <el-input v-model="range[0].end" validate-prop="0.end"></el-input>
        </moon-validator>
        <el-button @click="validate(3)">验证表单3</el-button>
        <el-button @click="clear(3)">清除表单3验证css</el-button>
        <el-divider>moon-validator 数组</el-divider>
        <moon-validator ref="moonValidator4" :mode="range2" :rules="rangeRules2">
            开始
            <el-input v-model="range2[0]" validate-prop="0"></el-input>
            结束
            <el-input v-model="range2[1]" validate-prop="1"></el-input>
        </moon-validator>
        <el-button @click="validate(4)">验证表单3</el-button>
        <el-button @click="clear(4)">清除表单3验证css</el-button>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: '',
    props: {},
    components: {},
    created() {},
    mounted() {},
    data() {
        return {
            mode: {
                name: '',
                family: [
                    {
                        label: '父亲',
                        name: ''
                    },
                    {
                        label: '母亲',

                        name: ''
                    },
                    {
                        label: '子女',
                        name: ''
                    }
                ]
            },
            mode2: {
                name: '',
                family: [
                    {
                        label: '父亲',
                        name: ''
                    },
                    {
                        label: '母亲',

                        name: ''
                    },
                    {
                        label: '子女',
                        name: ''
                    }
                ]
            },
            rules: {
                name: [
                    {
                        type: 'string',
                        required: true,
                        message: '请输入姓名'
                    }
                ],
                family: [
                    {
                        type: 'array',
                        defaultField: {
                            type: 'object',
                            required: true,
                            fields: {
                                name: [
                                    {
                                        type: 'string',
                                        required: true,
                                        // message: '家庭姓名不能为空',
                                        validator(rule, value, callback, source, options) {
                                            if (!value) {
                                                callback(source.label + '姓名不能为空');
                                            } else {
                                                callback();
                                            }
                                        }
                                    },
                                    {
                                        validator(rule, value, callback, source, options) {
                                            if (value.length < 4) {
                                                callback('名字长度不能小于4');
                                            } else {
                                                callback();
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            },
            range: [{ begin: '', end: '' }],
            rangeRules: {
                defaultField: {
                    type: 'object',
                    required: true,
                    fields: {
                        begin: { required: true, message: '请输入开始' },
                        end: { required: true, message: '请输入结束' }
                    }
                }
            },
            range2: ['', ''],
            rangeRules2: {
                /* fields: {
                    0: { required: true, message: '请输入开始区间' },
                    1: { required: true, message: '请输入结束区间' },
                }, */
                defaultField: {
                    required: true,
                    message: '不能为空'
                }
            }
        };
    },
    watch: {},
    computed: {},
    methods: {
        validate(n) {
            this.$refs[`moonValidator${n}`].validate();
        },
        clear(n) {
            this.$refs[`moonValidator${n}`].clearValidate();
        }
    }
};
</script>
<style lang="less" scoped></style>


```
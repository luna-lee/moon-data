<template>
    <div class="moon-validator" :id="el_id">
        <slot></slot>
    </div>
</template>
<script>
import { debounce } from 'lodash';
import Schema from 'async-validator';
import { isType, getUUID, setEventListener } from '../utils';
Schema.warning = function () {};
export default {
    inheritAttrs: false,
    name: 'MoonValidator',
    props: {
        mode: {
            type: [Object, Array],
            default: () => ({})
        },
        rules: {
            type: Object,
            default: () => ({})
        },
        showErrorMsgTip: {
            type: Boolean,
            default: true
        }
    },
    components: {},
    created() {},
    mounted() {
        this.handlerMouseClick();
        this.$watch(
            function () {
                return this.mode;
            },
            () => {
                this.changeModeData_debounce();
            },
            {
                deep: true,
                immediate: true
            }
        );
    },
    data() {
        return {
            changeModeData_debounce: debounce(this.changeModeData, 300),
            el_id: getUUID('moon-validate-'),
            validator: undefined,
            oldPathValue: undefined,
            validatePropNodeValueObj: {}
        };
    },
    watch: {
        inner_rules: {
            handler(rules) {
                if (isType(rules, 'Object')) this.validator = new Schema(rules);
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        inner_mode() {
            return { mode: this.mode };
        },
        inner_rules() {
            let type = isType(this.mode, 'Array') ? 'array' : 'object';
            let _rules = {
                mode: {
                    require: true,
                    type
                }
            };
            if (type === 'array') {
                _rules.mode = { ..._rules.mode, ...this.rules };
            } else {
                _rules.mode.fields = this.rules;
            }
            return _rules;
        }
    },
    methods: {
        validate(showMessage = false) {
            // //清楚class
            this.clearValidate();
            let { flag, errors, fields, fieldKeys } = this.getValidate();
            if (!flag) this.seErrorView(fieldKeys, errors, showMessage);
            return {
                flag,
                errors,
                fields,
                fieldKeys
            };
        },
        changeModeData() {
            if (!this.mode || !(this.mode.length || Object.keys(this.mode).length)) return;
            if (!isType(this.mode, ['Object', 'Array'])) {
                console.error('moon-validator 传入的mode必须是对象或数组');
                return;
            }
            if (!this.oldPathValue) {
                this.oldPathValue = this.getPathValue(this.mode);
                this.$nextTick(() => {
                    this.setValidatePropNodeValueObj();
                });
                return;
            }
            let newPathValue = this.getPathValue(this.mode);
            let oldKeys = Object.keys(this.oldPathValue);
            let newKeys = Object.keys(newPathValue);
            let newObj = [];
            let changeValueObj = [];
            let deleteObj = [];
            // 数据新增
            newKeys.map((key) => {
                if (!oldKeys.includes(key)) {
                    newObj.push(key);
                } else {
                    if (newPathValue[key] !== this.oldPathValue[key]) changeValueObj.push(key);
                }
            });
            // 数据删除
            oldKeys.map((key) => {
                if (!newKeys.includes(key)) {
                    deleteObj.push(key);
                }
            });
            this.oldPathValue = newPathValue;
            // 数据新增删除，重新获取dom,needReload外部控制重载，用于数组元素交换位置的视图交互
            if (newObj.length || deleteObj.length || this.needReload) {
                this.setValidatePropNodeValueObj();
                this.clearValidate();
                this.needReload = false;
                return;
            }
            // 数据改变
            if (changeValueObj.length) {
                let { fieldKeys, errors } = this.getValidate();
                changeValueObj.forEach((key) => {
                    if (fieldKeys.includes(key))
                        this.seErrorView(
                            [key],
                            errors.filter((e) => e.field === 'mode.' + key)
                        );
                    else this.removeErrorView([key]);
                });
            }
        },
        seErrorView(keys, errors, showErrorMsg = false) {
            keys.forEach((key) => {
                this.validatePropNodeValueObj[key]?.map((node) => {
                    if (!node?.classList?.contains('error-validate')) node?.classList.add('error-validate');
                    this.createErrorTipView(
                        node,
                        errors.filter((e) => e.field === 'mode.' + key)
                    );
                });
            });
            if (showErrorMsg) this.$message.error(errors[0].message);
        },
        createErrorTipView(node, errors) {
            if (!this.showErrorMsgTip || !node || !errors || !errors.length) return;
            // 添加错误dom时，若当前dom为input元素则添加到其父元素上
            if (node.tagName === 'INPUT') {
                node = node.parentNode;
            }
            let parentNode = node.parentNode;
            let nextNode = node.nextElementSibling;
            // 添加错误哦dom时将当前dom节点上添加一个data-validate-key标记。用于后面的移除
            let bindKey = node?.getAttributeNode?.('data-validate-key')?.value;
            if (!bindKey) {
                bindKey = getUUID('data-validate-');
                node.setAttribute('data-validate-key', bindKey);
            }
            // 判断是否已经有错误dom，若有则不添加
            if (node?.getAttributeNode?.('data-validate-key')?.value) {
                let childrenNodes = parentNode.children;
                let flag = false;
                for (let i = 0, len = childrenNodes.length; i < len; i++) {
                    if (node.getAttributeNode('data-validate-key')?.value === childrenNodes[i]?.getAttributeNode?.('data-validate-from-key')?.value) {
                        flag = true;
                        break;
                    }
                }
                if (flag) return;
            }

            let div = document.createElement('div');
            div.classList.add('error-tip');
            div.setAttribute('data-validate-from-key', bindKey);
            div.innerHTML = errors[0].message;
            if (nextNode) parentNode.insertBefore(div, nextNode);
            else parentNode.appendChild(div);
        },
        removeErrorTipView(nodes) {
            if (!isType(nodes, 'Array')) return;
            nodes.map((node) => {
                if (!node) return;
                if (node.tagName === 'INPUT') {
                    node = node.parentNode;
                }
                if (node?.getAttributeNode?.('data-validate-key')?.value) {
                    let parentNode = node.parentNode;
                    let childrenNodes = parentNode.children;
                    for (let i = 0, len = childrenNodes.length; i < len; i++) {
                        if (node.getAttributeNode('data-validate-key').value === childrenNodes[i]?.getAttributeNode?.('data-validate-from-key')?.value) {
                            parentNode.removeChild(childrenNodes[i]);
                        }
                    }
                }
            });
        },
        removeErrorView(keys) {
            keys.forEach((key) => {
                this.validatePropNodeValueObj[key]?.map((node) => node?.classList.remove('error-validate'));
                this.removeErrorTipView(this.validatePropNodeValueObj[key]);
            });
            this.$message.close();
        },
        getPathValue(source, prix_path = '') {
            let result = {};
            function fetchPathValue(obj, receiveObj, path = '') {
                if (Array.isArray(obj)) {
                    let _obj = obj.reduce((o, item, index) => {
                        o[index] = item;
                        return o;
                    }, {});
                    Object.keys(_obj).map((key) => {
                        fetchPathValue(_obj[key], receiveObj, path ? path + '.' + key : key);
                    });
                } else {
                    if (Object.prototype.toString.call(obj) === '[object Object]') {
                        Object.keys(obj).map((key) => {
                            fetchPathValue(obj[key], receiveObj, path ? path + '.' + key : key);
                        });
                    } else {
                        receiveObj[path] = obj;
                    }
                }
            }
            fetchPathValue(source, result, prix_path);
            return result;
        },
        getValidate() {
            //flag , errors, fields, fieldKeys
            let res = {
                flag: true, //结果标记
                errors: null, //错误集
                fields: null, //错误对应的属性集
                fieldKeys: [] //错误对应的属性集key
            };
            if (isType(this.mode, ['Object', 'Array']))
                this.validator.validate(this.inner_mode, (errors, fields) => {
                    if (errors && fields) {
                        res = { flag: false, errors, fields, fieldKeys: Object.keys(fields).map((field) => field.split('mode.')[1]) };
                    }
                });

            return res;
        },
        clearValidate() {
            this.removeErrorView(Object.keys(this.validatePropNodeValueObj));
        },
        reload() {
            this.needReload = true;
        },
        setValidatePropNodeValueObj() {
            let result = {};
            let node = document.getElementById(this.el_id);
            function getValidatePropNode(nodeList, obj) {
                for (let i = 0, len = nodeList.length; i < len; i++) {
                    let el = nodeList[i];
                    if (!el) return;
                    //排除嵌套的moon-validator组件
                    if (el.classList?.contains('moon-validator')) continue;
                    if (el.getAttributeNode?.('validate-prop')?.value) {
                        if (!obj[el.getAttributeNode('validate-prop').value]) obj[el.getAttributeNode('validate-prop').value] = [];
                        obj[el.getAttributeNode('validate-prop').value].push(el);
                    }
                    if (el.childNodes && el.childNodes.length) getValidatePropNode(el.childNodes, obj);
                }
            }
            getValidatePropNode(node.childNodes, result);
            this.validatePropNodeValueObj = result;
        },

        handlerMouseClick() {
            let _this = this;
            // 给予获取当前焦点的控件，并添加失焦事件
            let mousedownCheckActiveElementBlur = () => {
                let target = document.activeElement;
                let rootNode = document.getElementById(this.el_id);
                if (!target || !rootNode.contains(target)) return;
                let nodeList = Object.keys(_this.validatePropNodeValueObj)
                    .map((key) => _this.validatePropNodeValueObj[key])
                    .reduce((arr, _arr) => {
                        arr = [...arr, ..._arr];
                        return arr;
                    }, []);
                for (let i = 0, len = nodeList.length; i < len; i++) {
                    let node = nodeList[i];
                    if (node.contains(target)) {
                        target.onblur = () => {
                            setTimeout(() => {
                                let key = node?.getAttributeNode?.('validate-prop')?.value;
                                if (!key) return;
                                let { fieldKeys, errors } = _this.getValidate();
                                if (fieldKeys.includes(key))
                                    _this.seErrorView(
                                        [key],
                                        errors.filter((e) => e.field === 'mode.' + key)
                                    );
                            }, 300);
                        };
                    }
                }
            };
            setEventListener(document, this, 'mousedown', mousedownCheckActiveElementBlur);
        }
    }
};
</script>
<style lang="less" scoped>
::v-deep(.error-validate ){
    border: 1px solid red;
    border-radius: 5px;
}

::v-deep(.error-tip ){
    color: red;
    text-align: left;
}
</style>

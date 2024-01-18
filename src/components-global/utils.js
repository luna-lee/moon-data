import { cloneDeep, flattenDeep } from 'lodash';
import Schema from 'async-validator';
import { nanoid } from 'nanoid';
/**
 * @description 类型判断
 * @author 闰月飞鸟
 * @param obj 校验对象
 * @param type 校验类型，可以是字符串或数组，数组为或结果。值为所有类型的实例化名。如Object，Number...
 *  */
export const isType = (obj, type) => {
    if (typeof type === 'string') return Object.prototype.toString.call(obj) == `[object ${type}]`;
    if (Array.isArray(type)) return type.some((t) => Object.prototype.toString.call(obj) == `[object ${t}]`);
};
/**
 * @description 利用nanoID得到一个uuid
 * @param prefix id前缀
 *  */
export const getUUID = (prefix = 'uuid') => {
    return prefix + nanoid();
};

/**
 * @description 设置window 或document事件监听,同时当所在的vue实例销毁时自动移除监听
 * @author 闰月飞鸟
 * @param binder 指定window 或document  必传
 * @param vm vue实例 必传
 * @param evtName  事件名 必传
 * @param listener  监听函数 必传
 * @param options 监听本身参数
 * @return 返回一个移除监听函数
 *  */
export const setEventListener = (binder, vm, evtName, listener, options) => {
    if (!binder || !vm || !evtName || !listener) {
        return;
    }
    // 只有在当前视图下的vm才触发响应
    const _listener = (...arg) => {
        let { width, height } = vm.$el.getBoundingClientRect();
        if (!width || !height) return;
        listener(...arg);
    };
    const remove = () => {
        binder.removeEventListener(evtName, _listener);
    };
    const add = () => {
        remove();
        binder.addEventListener(evtName, _listener, options);
    };
    add();
    vm.$on('hook:mounted', add);
    vm.$on('hook:activated', add);
    vm.$on('hook:deactivated', remove);
    vm.$once('hook:beforeDestroy', () => {
        remove();
    });
    return remove;
};

/**
 * @description  树形数据格式化
 * @author 闰月飞鸟
 * @param {*} id
 * @param {*} pId
 * @param {*} children
 * @return {treeData,leafs,objById,flatData}
 * @description  treeData 格式化后的树数据
 * @description  leafs 所有叶子节点
 * @description  objById 以id为key的对象
 * @description  flatData  原始扁平数组，由于格式化是同一个引用，扁平数组中也有层级
 * @return  返回的数组对象中，对象属性新增两个属性
 * @return {track} 所有当前节点的父节点id，包括自身ID
 * @return {trigger} 所有当前节点的子节点id，不包含自身ID
 */
export const flatToTree = (source, id = 'id', pId = 'pId', children = 'children') => {
    if (!isType(source, 'Array')) {
        console.error('数据源必须是数组');
        return;
    }
    let flatData = cloneDeep(source);
    let treeData = flatData.reduce((arr, item) => {
        item[children] = item[children] || [];
        item.track = [item[id]];
        item.trigger = item.trigger || [];
        let parent = flatData.find((node) => node[id] == item[pId]);
        if (!parent) arr.push(item);
        else {
            // track:所有父id，包括自己
            parent.track = parent.track || [];
            item.track = [...parent.track, ...item.track];
            // trigger:所有子id
            parent.trigger = parent.trigger || [];
            parent.trigger.push(item[id]);
            parent.trigger.push(item.trigger);
            parent[children] = parent[children] ? [...parent[children], item] : [item];
        }
        return arr;
    }, []);
    let leafs = [];
    // id 为key的对象。将trigger扁平化,获取所有子节点
    let objById = flatData.reduce((obj, item) => {
        item.trigger = flattenDeep(item.trigger);
        obj[item[id]] = item;
        if (!item[children].length) leafs.push(item);
        return obj;
    }, {});

    return {
        treeData,
        leafs,
        objById,
        flatData
    };
};

/**
 * @description   拷贝扁平化的树形结构数据,即更新id与pId
 * @author 闰月飞鸟
 * @param {*} id
 * @param {*} pId
 * @param {*} defaultPid 默认pid,当pid不是当前数组中任何一个对象时设置默值。
 * @param {*} custom 自定义替换对象
 * @param {*} customFunction 自定义替换函数
 *
 */
export const copyFlatData = ({ source, id = 'id', pId = 'pId', defaultPid = '', custom = {}, customFunction }) => {
    if (!isType(source, 'Array')) {
        console.error('数据源必须是数组');
        return;
    }
    let flatData = cloneDeep(source);
    // get id  newId map
    let idMap = flatData.reduce((obj, item) => {
        obj[item[id]] = getUUID();
        return obj;
    }, {});
    idMap = { ...idMap, ...custom };
    return flatData.map((v) => {
        let oldObj = cloneDeep(v);
        v[id] = idMap[v[id]];
        if (v[pId] && idMap[v[pId]]) v[pId] = idMap[v[pId]];
        else v[pId] = defaultPid;
        if (customFunction) customFunction({ current: v, oldObj, idMap });
        return v;
    });
};
/**
 * @description  校验目标对象是否符合输入的校验规则
 * @return function  返回回调函数
 *      @param targetObject 必选，目标对象 object
 *      @param rules 必选，校验规则 object
 *      @param validateCallback   可选，校验回调返回函数,errors,fields，两个参数， （errors, fields）=>{}
 *      @return 校验结果
 */

export const InstanceValidate = () => {
    let validateObject_validator = null;
    let validateObject_rules = null;
    return function (targetObject, rules, validateCallback) {
        let flag = true;
        //类型检查
        if (isType(targetObject, 'Object') && isType(rules, 'Object')) {
            // validateObject_validator为null是，或校验规则改变后需要重新实例化Schema
            if (!validateObject_validator || rules != validateObject_rules) {
                validateObject_rules = rules;
                validateObject_validator = new Schema(rules);
            }
            validateObject_validator.validate(targetObject, (errors, fields) => {
                if (errors && fields) flag = false;
                validateCallback && validateCallback(errors, fields);
            });
        } else throw '校验类型和校验规则必须为一个Object对象';
        return flag;
    };
};

/**
 * @description  移除两个字符串的空格换行符tab符号后判断是否相等。
 * @author 闰月飞鸟
 * @param {*} str1 string
 * @param {*} str1 string
 * @return Boolean
 */
export const equalsString = (str1, str2) => {
    return (
        isType(str1, 'String') && isType(str2, 'String') && str1.replace(/\s|\\n|\\r|\\t/gms, '') == str2.replace(/\s|\\n|\\r|\\t/gms, '')
    );
};

//
/**
 * @description  异步添加dom元素
 * @author 闰月飞鸟
 * @param {*} el 元素名
 * @param {*} attrs  元素属性
 * @param {*} appendToElement  添加到的目标元素,默认document.head
 * @return Boolean
 */
export const asyncLoadElement = (elementName, attrs, appendToElement = document.head) => {
    let id = attrs.id;
    if (!elementName || (id && document.getElementById(id))) {
        return false;
    }
    return new Promise((resolve) => {
        let el = document.createElement(elementName);
        Object.keys(attrs).map((key) => {
            el.setAttribute(key, attrs[key]);
        });
        appendToElement.appendChild(el);
        el.onload = () => {
            resolve(true);
        };
    });
};

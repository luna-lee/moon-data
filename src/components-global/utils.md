### isType

-   类型判断
-   @param obj 校验对象
-   @param type 校验类型，可以是字符串或数组，数组为或结果。值为所有类型的实例化名。如 Object，Number...

```javascript
isType(obj, 'Array');
```

### getUUID

-   得到一个 uuid
-   @param prefix id 前缀

```javascript
getUUID('moon-validate-');
```

### setEventListener

-   @description 设置 window 或 document 事件监听,同时当所在的 vue 实例销毁时自动移除监听
-   @param binder 指定 window 或 document 必传
-   @param vm vue 实例 必传
-   @param evtName 事件名 必传
-   @param listener 监听函数 必传
-   @param options 监听本身参数
-   @return 返回一个移除监听函数

```javascript
setEventListener(window, this, 'click', function () {});
```

### flatToTree

-   @description 树形数据格式化
-   @param {\*} id
-   @param {\*} pId
-   @param {\*} children
-   @return {treeData,leafs,objById,flatData} treeData,leafs,objById,flatData 中的对象的引用都相同
-   @description treeData 格式化后的树数据
-   @description leafs 所有叶子节点
-   @description objById 以 id 为 key 的对象
-   @description flatData 扁平化树数据
-   @return 返回的数组对象中，对象属性新增两个属性
-   @return {track} 所有当前节点的父节点 id，包括自身 ID
-   @return {trigger} 所有当前节点的子节点 id，不包含自身 ID

```javascript
let { treeData } = flatToTree(data, 'id', 'pId', 'children');
```

### InstanceValidate

-   @description 校验目标对象是否符合输入的校验规则
-   @return function 返回回调函数
-                                @param targetObject 必选，目标对象 object
-                                @param rules 必选，校验规则 object
-                                @param validateCallback   可选，校验回调返回函数,errors,fields，两个参数， （errors, fields）=>{}
-                                @return 校验结果

```javascript
const form = {
    catalogId: ''
};
const rules = {
    catalogId: [
        {
            required: true,
            message: '请选择资源目录'
        }
    ]
};
InstanceValidate()({}, rules, (e) => {
    console.log(e);
});
```

### equalsString

-   @description 移除两个字符串的空格换行符 tab 符号后判断是否相等。
-   @author 闰月飞鸟
-   @param {\*} str1 string
-   @param {\*} str1 string
-   @return Boolean

```javascript
equalsString(str1, str2);
```

### copyFlatData

-   @description 拷贝扁平化的树形结构数据,即更新 id 与 pId
-   @author 闰月飞鸟
-   @param {\*} option :id:string;pId:string;defaultPid:string;custom:Object,customFunction:({current:Object,oldObj:Object,idMap:Object})=>{}
    -   @param {\*} id
    -   @param {\*} pId
    -   @param {\*} defaultPid 默认 pid,当 pid 不是当前数组中任何一个对象时设置默值。
    -   @param {\*} custom 自定义替换
    -   @param {\*} customFunction 自定义替换函数 ({current:Object,oldObj:Object,idMap:Object})=>{}

```javascript
copyFlatData({
    source: jsonText.moonDvClipboardJsonStr,
    id: 'id',
    pId: 'parent',
    defaultPid: 'page',
    customFunction: ({ current, idMap }) => {
        if (current.children) current.children = current.children.map((id) => idMap[id]).filter(Boolean);
    }
});
```

### asyncLoadElement

-   @description 异步添加 dom 元素
-   @author 闰月飞鸟
-   @param {\*} el 元素名
-   @param {\*} attrs 元素属性
-   @param {\*} appendToElement 添加到的目标元素,默认 document.head
-   @return Boolean

```javascript
asyncLoadElement('script',{src;'',id:'xx'});
```

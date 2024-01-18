# moon-phone-demo

### 作者：闰月飞鸟；时间：2020/09/06

### 开发目的

- 用于 pc 端展示手机端页面
- 可以直接传入一个链接，也能传入一个template模板代码

### Props

| 参数 | 说明           | 类型   | 可选值 | 默认值 |
| ---- | -------------- | ------ | ------ | ------ |
| src  | 手机端页面 url | string | -      | -      |
|srcdoc| iframe属性。srcdoc优先src，接受html代码。或vue模版代码| string | -      | -      |
```
        <moon-phone-demo src="https://cn.vuejs.org/index.html"></moon-phone-demo>

```

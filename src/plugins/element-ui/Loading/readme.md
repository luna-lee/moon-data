# elementUI Loading 重写
### 作者：闰月飞鸟；时间：2022/09/15
### 开发目的
- 实现loading样式统一，统一指令与服务的样式。当一个页面多个loading时，若元素重叠则只显示最大的那个。
- export同时vue实例上新增openLoading方法，返回一个关闭函数
- export同时vue实例上新增closeLoading方法，参数target为默认值defaultOptions中的target
- 其余的方法全部继承 elementUI Loading

# Methods
| 方法   | 参数 | 说明 |  
| ------- | ------------------  | ------ |  
| (this.$)openLoading | [参考elementUI loading中的 Options 配置 ](https://element.eleme.cn/#/zh-CN/component/loading)| - |
| (this.$)closeLoading  | target |     [参考elementUI loading中的 Options 中的target配置 ](https://element.eleme.cn/#/zh-CN/component/loading)    |

``` javascript
this.$openLoading()
this.$closeLoading()
this.$closeLoading('.target')
```
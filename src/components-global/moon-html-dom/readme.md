# moon-html-dom

### 作者：闰月飞鸟；时间：2020/09/07

### 开发目的
-将字符串 dom 转译成 vue 模板。字符串 dom 支持 vue 的所有模板语法

### Props

| 参数    | 说明                                                                                    | 类型   | 可选值 | 默认值 |
| ------- | --------------------------------------------------------------------------------------- | ------ | ------ | ------ |
| htmlDom | 字符 dom,与 vue 模板语法一致，只是变量前缀属性用$符代替，组件会用传入的实体属性进行替换 | String | -      | -      |
| entity  | 字符 dom 中，变量的前缀对象                                                             | Object | -      | -      |

```javascript
  <MoonHtmlDom :htmlDom="htmlDom" :entity="formData"></MoonHtmlDom>

  <script>
        export default{
            data(){
                return {
                    htmlDom:'<div>$m><div>',
                    formData:{
                        m:'xxx'
                    }
                }
            }
        }
  </script>

```

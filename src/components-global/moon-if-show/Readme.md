# moon-if-show

### 作者：闰月飞鸟；时间：2021/11/23
### 开发目的
- 实现组件缓存
- tab标签内容，初次加载页面时，只渲染对应下标的tab页面，
- 凡是渲染过的tab页，下次打开则不在重新渲染
 

### Props 
参数 |说明|类型|可选值|默认值
---|---|---|---|--- 
show|组件显示隐藏|Boolean|-|false 
delay|第一次延时渲染时间|Number|-|0 

 
 ### slot
 参数 |说明
 ---|---
 default|-
 
``` javascript

<moon-if-show :show='show'>xxxx</moon-if-show>

```

 


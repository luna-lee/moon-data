
# moon-query-template

### 作者：闰月飞鸟；时间：2020/04/02
### 开发目的
- 统一查询视图风格，


### moon-query-template Props 
参数 |说明|类型|可选值|默认值
---|---|---|---|---
moon-form-template 所有属性| -|-|-|-
width|设置默认展示区区域的宽度，若isAlign为true也是隐藏视图宽度。不设置时使用一行中所有html元素的默认宽度的总和值作为宽度|-|-|-
isAlign|默认视图与折叠视图是否对齐排序，对齐排序则所有折叠的视图展示时都不会超出按钮所占垂直区域|-|-|-
br|收起 第一个带有br属性且值为truely的slot元素以及之后的所有元素 |-|-|-
span|所有元素累计的span为24时会在最后元素上加上br作为默认展示的视图，若br设置在span小于24，则重新累计 |-|-|-
keyEnterQuery|是否开启键盘回车触发查询事件|Boolean|-|true
 ###  Slot
  名称 |说明| 参数
---|---|---|
defautl|el-form-item组件|-
button|按钮插槽|-

### Event
名称 |说明| 参数
---|---|---|
onQuery|查询按钮点击事件，同时响应键盘回车键|-
 
 ```
<template>
  <div class="queryCondition">
    <moon-query-template width="90%" @onQuery="onQuery" :span="8" labelWidth="80px">
      <el-form-item label="网点名称：">
        <el-input clearable v-model="queryConditionEntity.networkName"></el-input>
      </el-form-item>
      <el-form-item label="所属地区：">
        <areaCityToCommunity v-model="queryConditionEntity.areaId"></areaCityToCommunity>
      </el-form-item>
      <el-form-item label="网点级别：">
        <selectCode code="20" v-model="queryConditionEntity.networkLevel"></selectCode>
      </el-form-item>
      <el-form-item label="网点类型：">
        <selectCode code="21" v-model="queryConditionEntity.networkType"></selectCode>
      </el-form-item>
      <el-form-item label="建设形式：" br>
        <selectCode code="22" v-model="queryConditionEntity.networkBuildForm"></selectCode>
      </el-form-item>
    </moon-query-template>
  </div>
</template>
<script>
export default {
  props: {
    queryConditionEntity: {
      type: Object,
      required: true
    }
  },
  components: {
  },

  mounted() {},
  data() {
    return {
      //网点字典 动态获取
      queryShow: false
    };
  },
  computed: {},
  methods: {
    onQuery() {
      this.$emit("onQuery");
    }
  }
};
</script>
<style lang='less' scoped>
</style> 
```
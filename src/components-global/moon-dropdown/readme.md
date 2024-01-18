# moon-dropdown

### 作者：闰月飞鸟；时间：2020/09/02

### 开发目的

-   将 el-dropdown 组件封装，统一条件，将非业务的逻辑提取出来。
-   简化其单元项的触发方式。 直接通过绑定响应事件来实现触发。页面中不需要通过 command 来触发

### Props

| 参数                 | 说明             | 类型 | 可选值 | 默认值 |
| -------------------- | ---------------- | ---- | ------ | ------ |
| el-dropdown 所有属性 | -                | -    | -      | -      |
| trigger              | 默认设置为 click | -    | -      | click  |

### Slot

-   el-dropdown-menu
-   el-dropdown-item 点击事件直接通过@click 来绑定即可

```
   <moon-dropdown style="margin-left: 10px">
                        <el-button type="text">更多<i class="el-icon-arrow-down"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click="test(scope.row)"><el-button type="text">功能测试</el-button> </el-dropdown-item>
                            <el-dropdown-item @click="getAddress(scope.row)"> <el-button type="text">配置地址 </el-button></el-dropdown-item>
                            <el-dropdown-item @click="handleDelete(scope.row)"> <el-button type="text">删除 </el-button></el-dropdown-item>
                        </el-dropdown-menu>
                    </moon-dropdown>
```

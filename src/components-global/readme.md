# 组件更新日志
### 2022年09月08日10:15:08
-moon-table-pagination 新增loading props属性，外部控制表格显示loading
-新增moon-if-show组件
### 2022年09月07日15:45:26
- 新增moon-html-dom组件，
- moon-table-pagination当总条数小于页面最小展示条数时，不显示分页组件
### 2022年09月06日11:43:09
- 薪资moon-phone-demo组件
### 2022年09月02日15:32:39
- moon-table-pagination 增加顶部按钮配置。topButtonList。
- 新增moon-dropdown组件

### 2022年08月15日11:08:20
- moon-table-pagination 为getDataList方法增加防抖
### 2022年08月10日09:14:40
- 新增moon-menu组件
### 2022年08月02日14:36:52
- 代码整理与优化和完善
###  2022年08月01日15:34:06
 - moon-form-template 新增validate_cb方法。返回校验结果的同时将错误对象也返回,完善md文档
 - moon-query-template 添加keyEnterQuery属性，用户控制键盘回车键是否对查询事件的响应 
### 2022年08月01日13:43:51
 - moon-table-pagination sortableOptions中的函数属性自动加上当前表格数据参数

### 2022年07月30日23:06:46
- 组件代码整理优化
- moon-table-pagination 新增表格拖拽排序属性draggable，以及配置属性sortableOptions，新增响应拖拽结束后事件drag-end
### 2022年07月29日22:40:08
-moon-validator组件改进 validate-prop属性可以同时绑定在多个元素上
### 2022年07月29日14:07:22
- moon-table-pagination props新增data，用于外部传入表格数据。当掺入data时，分页器将不再起作用，
- moon-validator 组件新增reload方法，用于配合拖拽组件。

### 2022年07月29日10:31:33
- 新增moon-validator组件
### 2022年07月27日14:29:39
- moon-form-template  disabled的字体颜色改成#303133

### 2022年07月27日11:50:02
- moon-table-pagination 设置show-overflow-tooltip默认为true
- moon-form-template 当br值为falsely时不再换行，空字符串区除外
- moon-query-template 中br的作用也通moon-form-template一样，只有在br值不为falsely时起作用，空字符串区除外
### 2022年07月26日18:48:58
-  新增moon-transition组件 
-  优化moon-query-template 移除响应式代码
-  优化moon-form-template  元素的span累计24后重新用el-row渲染后面的元素

### 组件更名初始化 2022年07月26日14:32:52
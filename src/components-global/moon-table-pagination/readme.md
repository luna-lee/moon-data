# moon-table-pagination

### 作者：闰月飞鸟；时间：2020/04/02

### 开发目的

-   将 table 组件和 pagination 封装在一起，让 pagination 的逻辑从业务逻辑中独立出来。当总条数小于页面最小展示条数时，不显示分页组件
-   为 table-tree 字节点添加前端懒加载

### Props

| 参数               | 说明                                                                                                                                                                                                                                                                                                                               | 类型            | 可选值                             | 默认值                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| --                 | el-table 组件自带的 props                                                                                                                                                                                                                                                                                                          | Object          | -                                  | -                                                                                    |
| --                 | el-pagination 组件自带的 props                                                                                                                                                                                                                                                                                                     | -               | -                                  | -                                                                                    |
| data               | el-table 的 data 传值，若外部传入 data 则使用外部传入的 data 渲染 dom，同时内置的分页组件禁用                                                                                                                                                                                                                                      | Array           | -                                  | []                                                                                   |
| dataInterface      | 获取数据的接口, 可以是的 Url, 或者 http 函数接口，                                                                                                                                                                                                                                                                                 | string/function | -                                  | ''                                                                                   |
| pagination         | 是否展示分页组件                                                                                                                                                                                                                                                                                                                   | Boolean         | true/false                         | true                                                                                 |
| condition          | 数据接口参数                                                                                                                                                                                                                                                                                                                       | Object          | -                                  | {}                                                                                   |
| tableWidth         | 表宽                                                                                                                                                                                                                                                                                                                               | String          | -                                  | auto                                                                                 |
| responseType       | 数据返回格式,项目里要统一                                                                                                                                                                                                                                                                                                          | Object          | -                                  | { list: 'data.page.list', totalCount: 'data.page.totalCount' //当不分页时可以不指定} |
| treeOptions        | 渲染table-tree，树形结构数据配置，只有指定的，id与parentId都在数据项中时才渲染为table-tree段                                                                                                                                                                                                                                                                                          | Object          | -                                  | {id: 'id', parentId: 'parentId'}                                                     |
| draggable          | 表格是否可以拖拽排序                                                                                                                                                                                                                                            | Boolean         | -                                  | false                                                                                |
| orderAttrName      | 开启拖拽排序时，用于将当前排序号赋值到当前数据对象中 orderAttrName 所指定的属性字段上                                                                                                                                                                                                                                              | String          | -                                  | orderNum                                                                             |
| sortableOptions    | 拖拽排序库配置项 [Sortable](https://github.com/SortableJS/Sortable)，onEnd 属性函数默认自动转换表格数据位置并发起 drag-end 事件，若 sortableOptions 传入，则执行 sortableOptions 传入的 onEnd 函数， 每个传入的函数加上当前列表数据作为参数，例如：onEnd: function (evt，listData) onMove: function ( evt, originalEvent,listData) | Object          | -                                  | {}                                                                                   |
| topButtonList      | 顶部按钮列表，                                                                                                                                                                                                                                                                                                                     | Array           | ['add','delete','import','export'] | []                                                                                   |
| loading            | 外部控制表格显示 loading                                                                                                                                                                                                                                                                                                           | Boolean         | -                                  | true                                                                                 |
| paginationPosition | pagination 位置                                                                                                                                                                                                                                                                                                                    | Array           | ['bttom/top','left/center/right']  | ['bottom','center']                                                                  |

### Slot

| 名称            | 说明                                                                                     | 作用域参数            |
| --------------- | ---------------------------------------------------------------------------------------- | --------------------- |
| defalut         | el-table 的 slot                                                                         | -                     |
| list            | 作用域 slot 接受当前列表数据，可用于非表格布局                                           | -                     |
| btn-add-text    | 顶部新增按钮文字                                                                         | -                     |
| btn-delete-text | 顶部删除按钮文字                                                                         | -                     |
| btn-export-text | 顶部导出按钮文字                                                                         | -                     |
| btn-import-text | 顶部导入按钮文字                                                                         | -                     |
| btn-left        | 顶部左侧，                                                                               | 表格统计的 total 数据 |
| btn-right       | 顶部右侧                                                                                 | 表格统计的 total 数据 |
| drag-left       | 当开启排序时有效，用于展示排序列左边的列，应用场景：当同时有 select 列且需要放在最左侧时 | -                     |

### Event

| 名称                  | 说明                                                                                                       | 参数             |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------- |
| --                    | el-table 所有事件                                                                                          | -                |
| response              | 接口返回所有数据                                                                                           | -                |
| response-data         | 接口返回数据                                                                                               | -                |
| view-data             | 当前视图展示的数据。当非 table-tee 时，返回的数据与 response-data 一致                                     | -                |
| total                 | 返回总数                                                                                                   | -                |
| drag-end              | 返回拖拽排序后表格中的数据,若 moon-table-pagination 包含在 moon-validate 中，会自动刷新 moon-validate 配置 | tableData:Array  |
| update:table-selected | 当有 select 项时，返回当前选择的数据项，selection-change 的 sync 语法糖                                    | 当前选择的数据项 |
| btn-add               | 触发顶部新增按钮事件                                                                                       | -                |
| btn-delete            | 触发顶部删除按钮事件                                                                                       | 当前选择的数据项 |
| btn-export            | 触发顶部导出按钮事件                                                                                       | -                |
| btn-import            | 触发顶部导入按钮事件                                                                                       | -                |
| update:loading        | 当内部 onloading 改变时触发外部 loading 改变                                                               | -                |
| order-change          | 拖拽排序时触发                                                                                             | scope            |

### Methods

| 名称          | 说明                                        | 参数 |
| ------------- | ------------------------------------------- | ---- |
| getDataList   | 刷新 table                                  | -    |
| getTableVnode | 获取 table 实例，用于调佣 el-table 实例方法 | -    |

# css

| 名称               | 说明                                                 | 参数 |
| ------------------ | ---------------------------------------------------- | ---- |
| .slot-header-style | 为自定义标题名称的元素提供 class;为 flex，上下布局。 | -    |

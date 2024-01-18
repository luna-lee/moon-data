/**
 * UI组件, 统一使用饿了么桌面端组件库(https://github.com/ElemeFE/element）
 *
 * 使用:
 *  1. 项目中需要的组件进行释放(解开注释)
 *
 * 注意:
 *  1. 打包只会包含释放(解开注释)的组件, 减少打包文件大小
 */
import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { DatePicker, TimePicker, TimeSelect, Input } from 'element-ui';
import './Loading/index';
import updateTable from './Table/index.js';
// 全部引入
Vue.use(Element, { size: 'small', zIndex: 3000 });
//-------修复element ui 日期时间组件bug---------
delete DatePicker.mixins[0].mixins[1].props.placement;
delete TimePicker.mixins[0].mixins[1].props.placement;
delete TimeSelect.mixins[0].mixins[1].props.placement;
//---------end--------------
let { Table, TableColumn } = updateTable;
// input clearable 默认为true
Input.props.clearable.default = true;
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(TimeSelect);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);

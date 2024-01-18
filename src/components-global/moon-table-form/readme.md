
# moon-table-form

### 作者：闰月飞鸟；时间：2022/08/17
### 开发目的
- 用表格布局展示表单视图。并且表单单元内容可以随意合并

### Props 
参数 |说明|类型|可选值|默认值
---|---|---|---|---
--|el-table组件自带的props|Object|-|-
constructData|form表单构造对象， [{  id: '255d2557c336494bb75a97ab92436bfb',  reportFieldName: 'creditCode', reportFieldText: '统一社会信用代码',  spanRow: '1', spanCol: '1'   }]|Array|-|必填
columnNum|表单列数|Number, String|-|6,最大20列
options|form表单构造对象中rowspan，colspan对应的属性名|Object|-|{rowspan: 'rowspan'， colspan: 'colspan'}
labelFun|设置label单元属性对象,value为当前form单元构造实例对象|Function|-|(value) => { return { text: value };}
valueFun|设置value单元属性对象，value为当前form单元构造实例对象|Function|-|(value) => { return { text: value };}
labelCellStyle|设置label单元样式,优先级大于cellStyle|Object|-|{}
valueCellStyle|设置label单元样式,优先级大于cellStyle|Object|-|{}
border|表单边框|String|-|1px solid #ebeef5
borderInner|表单内边框|String|-|1px solid #ebeef5

###  Slot
  名称 |说明| 参数
---|---|---|
defautl|作用插槽，接受列数组对象 tableColumn|<template slot-scope="{ tableColumn }"></template>

 
```
  <template>
    <div>
        <el-row>
            <el-col> 列数<el-input v-model="columnNum" type="number"></el-input> </el-col>
            <el-col> 边框<el-input v-model="border"></el-input> </el-col>
            <el-col> 内边框<el-input v-model="borderInner"></el-input></el-col>
        </el-row>

        <moon-table-form
            :constructData="defineInfo.columnList"
            :columnNum="columnNum"
            :options="{ rowspan: 'spanRow', colspan: 'spanCol' }"
            :labelFun="labelFun"
            :valueFun="valueFun"
            :labelCellStyle="{ backgroundColor: ' #f2f9fc', fontWeight: 'bolder' }"
            :border="border"
            :borderInner="borderInner"
        >
            <template slot-scope="{ tableColumn }">
                <el-table-column v-for="{ columnKey, hasLabelCell } in tableColumn" :width="hasLabelCell ? '200' : 'auto'" :key="columnKey" :align="hasLabelCell ? 'left' : 'left'" :label="columnKey">
                    <template slot-scope="scope">
                        {{ scope.row[columnKey]?.text || '' }}
                    </template>
                </el-table-column>
            </template>
        </moon-table-form>
    </div>
</template>
<script>
import { getGeneralDataList, tableBySql } from '@/services/dynamic/dynamic.js';
import dataObj from './data.js';
export default {
    inheritAttrs: false,
    name: '',
    props: {
        reportCode: {
            type: String,
            default: ''
        },
        params: {
            type: Object,
            default: () => ({})
        },
        dynamicComponentMap: {
            type: Object,
            default: () => ({})
        }
    },
    components: {},
    created() {},
    mounted() {},
    data() {
        return {
            defineInfo: { columnList: [], conditionList: [] },
            queryCondition: {},
            columnNum: 6,
            formData: {},
            border: '1px solid  ',
            borderInner: '1px solid  '
        };
    },
    watch: {
        columnNum: {
            async handler() {
                // let {
                //     data: { list, defineInfo }
                // } = await getGeneralDataList(this.condition);
                let { list, defineInfo } = dataObj;
                this.formData = list && list.length ? list[0] : {};
                this.defineInfo = defineInfo;
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        condition() {
            return {
                reportCode: this.reportCode,
                params: { ...this.params, ...this.queryCondition }
            };
        }
    },
    methods: {
        labelFun(value) {
            return { text: value.reportFieldText };
        },
        valueFun(value) {
            return { text: this.formData[value.reportFieldName + 'Desc'] || this.formData[value.reportFieldName] };
        },
        async getDictDataBySql({ id, dictSql }) {
            let dictDataProp = [];
            if (!dictSql) return dictDataProp;
            //执行实时查询并将对应的字段ID塞进store中
            const res = await tableBySql(id);
            if (res.data.code === 200) {
                dictDataProp = res.data.data;
            }
            return dictDataProp;
        }
    }
};
</script>
<style lang="less" scoped>
.queryView {
    ::v-deep .el-form-item {
        margin-bottom: 0;
    }
}
</style>

```


###  data.js
```
export default {
    msg: 'success',
    code: 200,
    defineInfo: {
        id: '36524efcfea248259b6ed9807a4d7616',
        isDel: 0,
        creator: '1',
        createdTime: '2022/08/08 14:15:43',
        lastUpdatedBy: '1',
        lastUpdatedTime: '2022/08/16 00:37:22',
        createdUnit: '4855ba5babad493f81650c80d5e282c0',
        lastUpdatedUnit: '4855ba5babad493f81650c80d5e282c0',
        tenantCode: 'SSJKQ',
        reportCode: 'dwb_corp_basic',
        reportName: '工商信息',
        databaseId: 'e51078c716e211eda43e00ff4184a389',
        remark: '',
        version: 24,
        querySql: '',
        databaseName: '',
        columnList: [
            {
                id: '255d2557c336494bb75a97ab92436bfb',
                reportFieldName: 'creditCode',
                reportFieldText: '统一社会信用代码',
                spanRow: '1',
                spanCol: '1'
            },
            {
                id: '49513185d49a4a08a7f33946c14d50bd',
                reportFieldName: 'corpName',
                reportFieldText: '企业名称',
                spanRow: '2',
                spanCol: '3'
            },
            {
                id: '8ee09cc22d8047c4807cad0844d07d84',
                reportFieldName: 'legalName',
                reportFieldText: '法定代表人',
                spanRow: '2',
                spanCol: '1'
            },
            {
                id: '4d6eba9c070b499d932d23b9b2aabae5',
                reportFieldName: 'regStatusCode',
                reportFieldText: '登记状态',
                spanRow: '3',
                spanCol: ''
            },
            {
                id: '7ea19ca516194a8496edd84d1292d564',
                reportFieldName: 'regCaptal',
                reportFieldText: '注册资本',
                spanRow: '',
                spanCol: ''
            },
            {
                id: '92e0b77e063a44878ff7feaf4a519d9f',
                reportFieldName: 'paidInCaptal',
                reportFieldText: '实缴资本',
                spanRow: '',
                spanCol: ''
            },
            {
                id: '07608e4b3d63469087e432acff0c65ed',
                reportFieldName: 'establishDate',
                reportFieldText: '成立日期',
                spanRow: '',
                spanCol: ''
            },
            {
                id: 'cfb648bdcd7e4ddb942ae1de56694daf',
                reportFieldName: 'approvalDate',
                reportFieldText: '核准日期',
                spanRow: '',
                spanCol: ''
            },
            {
                id: '74f67209237d4dfab5afc5d3ec398f31',
                reportFieldName: 'orgGovCode',
                reportFieldText: '组织机构代码',
                spanRow: '',
                spanCol: ''
            },
            {
                id: '5cd37ff0995943aaaeb73cebd7dc805e',
                reportFieldName: 'businessRegNo',
                reportFieldText: '工商注册号',
                spanRow: '',
                spanCol: ''
            },
            {
                id: '2f8b81218731470eb1cfbd03b289eaed',
                reportFieldName: 'taxOrgCode',
                reportFieldText: '纳税人识别号',
                spanRow: '',
                spanCol: ''
            },
            {
                id: '28976451955b497d9dc9839ca0cdb40a',
                reportFieldName: 'regTypeCode',
                reportFieldText: '企业类型',
                spanRow: '',
                spanCol: ''
            },
            {
                id: 'f22247ed1cee4dce9744e0db6735d030',
                reportFieldName: 'operTerm',
                reportFieldText: '营业期限',
                spanRow: '',
                spanCol: ''
            },
            {
                id: 'd7eb5454ac1c44e790526a920a318e15',
                reportFieldName: 'industryTypeCode',
                reportFieldText: '所属行业',
                spanRow: '',
                spanCol: ''
            },
            {
                id: 'cbed37aced984480a29c1d50bc5a884b',
                reportFieldName: 'importExportRegNo',
                reportFieldText: '进出口企业代码',
                spanRow: '',
                spanCol: ''
            },
            {
                id: '0bb89fc5209541abb20f813b45216a71',
                reportFieldName: 'corpPeopleRange',
                reportFieldText: '人员规模',
                spanRow: '',
                spanCol: ''
            },
            {
                id: '8d6a27bbda07410d81e197d96f6feba1',
                reportFieldName: 'joinInsured',
                reportFieldText: '参保人数',
                spanRow: '',
                spanCol: ''
            },
            {
                id: '4f0b3d01fdea4c1c8317aa028af765a1',
                reportFieldName: 'oldCorpName',
                reportFieldText: '曾用名',
                spanRow: '',
                spanCol: ''
            },
            {
                id: 'ab324efc64d849b0b030b17941caa287',
                reportFieldName: 'corpEnlishName',
                reportFieldText: '英文名',
                spanRow: '',
                spanCol: '2'
            },
            {
                id: '11a40ccfb17741e2af9e3e3879c3e851',
                reportFieldName: 'regAddress',
                reportFieldText: '注册地址',
                spanRow: '',
                spanCol: '3'
            },
            {
                id: '485bb51fa330485c9a29079e81a0ee99',
                reportFieldName: 'businessScope',
                reportFieldText: '经营范围',
                spanRow: '',
                spanCol: '5'
            }
        ],
        conditionList: []
    },
    list: [
        {
            paidInCaptal: '实缴资本Text',
            approvalDate: '核准日期Text',
            taxOrgCode: '纳税人识别号Text',
            importExportRegNo: '进出口企业代码Text',
            joinInsured: '参保人数Text',
            businessRegNo: '工商注册号Text',
            corpPeopleRange: '人员规模Text',
            oldCorpName: '曾用名Text',
            regTypeCode: '10',
            businessScope:
                '苏州市张家港市乐之学家政服务有限公司苏州市张家港市乐之学家政服务有限公司苏州市张家港市乐之学家政服务有限公司苏州市张家港市乐之学家政服务有限公司苏州市张家港市乐之学家政服务有限公司苏州市张家港市乐之学家政服务有限公司苏州市张家港市乐之学家政服务有限公司苏州市张家港市乐之学家政服务有限公司苏州市张家港市乐之学家政服务有限公司苏州市张家港市乐之学家政服务有限公司',
            corpName: '苏州市张家港市乐之学家政服务有限公司',
            corpEnlishName: '英文名Text',
            establishDate: 1655308800000,
            legalName: '曹雪恒',
            creditCode: '91320582MABP46CH3E',
            regCaptal: 5,
            regStatusCode: 'ON_BUSINESS',
            orgGovCode: '组织机构代码Text',
            industryTypeCode: '所属行业Text',
            regAddress: '注册地址Text',
            operTerm: '营业期限Text'
        }
    ]
};


```


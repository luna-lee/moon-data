export default {
    label: '表单模板2',
    type: 'moon-table-form',
    stencilImg: '/static/img/表单模版2.png',
    defaultProps: {
        constructData: [
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
        columnNum: 6,
        labelCellStyle: { backgroundColor: ' #f2f9fc', fontWeight: 'bolder' },
        options: { rowspan: 'spanRow', colspan: 'spanCol' },
        border: '1px solid ',
        borderInner: '1px solid ',
        labelFun: (value) => {
            return { text: value.reportFieldText };
        },
        valueFun: (value) => {
            return { text: vm.bindData.formData[value.reportFieldName + 'Desc'] || vm.bindData.formData[value.reportFieldName] };
        },
        formData: {
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
    },
    attrs: {
        style: {
            'background-color': '#fff',
            padding: '10px'
        },
        slotDom: ` 
        <template slot-scope="{ tableColumn }">
        <el-table-column
            v-for="{ columnKey, hasLabelCell } in tableColumn"
            :width="hasLabelCell ? '200' : 'auto'"
            :key="columnKey"
            :align="hasLabelCell ? 'left' : 'left'"
            :label="columnKey"
        >
            <template slot-scope="scope">
                {{ scope.row[columnKey]?.text || '' }}
            </template>
        </el-table-column>
    </template>
               `
    }
};

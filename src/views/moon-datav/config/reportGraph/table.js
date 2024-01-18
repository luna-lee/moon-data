export default {
    label: '表格模板',
    type: 'moon-table-pagination',
    stencilImg: '/static/img/表格模板.png',
    defaultProps: {
        data: [
            {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            },
            {
                date: '2016-05-04',
                name: '李四',
                address: '上海市普陀区金沙江路 1517 弄'
            },
            {
                date: '2016-05-01',
                name: '张三',
                address: '上海市普陀区金沙江路 1519 弄'
            },
            {
                date: '2016-05-03',
                name: '赵六',
                address: '上海市普陀区金沙江路 1516 弄'
            }
        ],
        btnClick: (e) => {
            console.log(e);
        }
    },
    attrs: {
        style: {
            'background-color': '#fff',
            padding: '10px'
        },
        slotDom: ` 
        <el-table-column prop="date" label="日期" width="180"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column align="center" width="50">
            <template slot-scope="scope">
                <i class="el-icon-search" style="cursor: pointer" @click="btnClick(scope.row.name)" />
            </template>
        </el-table-column>
               `
    }
};

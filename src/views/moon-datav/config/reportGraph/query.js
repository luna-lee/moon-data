export default {
    label: '查询模板',
    type: 'moon-query-template',
    stencilImg: '/static/img/查询模板.png',
    defaultProps: {
        width: '90%',
        span: 8,
        labelWidth: '120px',
        form:{
            networkName:"",
            networkLeave:"",
            networkType:"",
            networkState:"",
        }
    },
    event: {
        onQuery: () => {
            console.log('查询按钮被点击');
        }
    },
    attrs: {
        style: {
            'background-color': '#fff',
            padding: '10px'
        },
        slotDom: ` 
            <el-form-item label="网点名称：">
                <el-input clearable v-model="bindData.form.networkName"></el-input>
            </el-form-item>
            <el-form-item label="网点级别：">
                 <el-input clearable v-model="bindData.form.networkLeave"></el-input>
            </el-form-item>
            <el-form-item label="网点类型：">
                 <el-input clearable v-model="bindData.form.networkType"></el-input>
            </el-form-item>
            <el-form-item label="建设形式：" br>
                <el-input clearable v-model="bindData.form.networkState"></el-input>
            </el-form-item>
               `
    }
};

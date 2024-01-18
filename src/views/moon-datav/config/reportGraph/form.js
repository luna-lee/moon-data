export default {
    label: '表单模板',
    type: 'moon-form-template',
    stencilImg: '/static/img/表单模板.png',
    defaultProps: {
        span: 12,
        model: {},
        labelWidth: '8rem',
        offset: 0,
        form:{
            username:"",
            password:"",
            trueName:"",
            employeeNumber:"",
        }
    },
    attrs: {
        style: {
            'background-color': '#fff',
            padding: '10px'
        },
        slotDom: ` 
                    <el-form-item label="用户名：" prop="username">
                        <el-input v-model="bindData.form.username" ></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="bindData.form.password" ></el-input>
                    </el-form-item>
                    <el-form-item label="姓名：" prop="trueName">
                        <el-input v-model="bindData.form.trueName" ></el-input>
                    </el-form-item>
                    <el-form-item label="用户编号：" prop="employeeNumber">
                        <el-input v-model="bindData.form.employeeNumber" ></el-input>
                    </el-form-item>
               `
    }
};


# moon-form-template

### 作者：闰月飞鸟；时间：2020/04/02
### 开发目的
- 将el-row 组件封装到el-from中，减少表单页面布局的复杂性。实现风格的统一性

### moon-form-template Props 
参数 |说明|类型|可选值|默认值
---|---|---|---|---
el-form 所有属性| -|-|-|-
el-col 所有属性| -|-|-|-
offset|设置全局间隔，参考el-row el-col <el-form-item>上也能传offset，用于指定改元素的间隔|String, Number|-|0
gutter|设置全局间隔|String, Number|-|0
layout|布局方式，多行布局row、浮动布局float,当float布局时，指定br换行将失效|String|-|row

### el-form-item Props 
参数 |说明|类型|可选值|默认值
---|---|---|---|---
el-col |所有属性，单独设置属性会覆盖moon-form-template上设置的属性值，如span| -|-|-|-
br|当el-form-item上有br属性为truely时，强制换行换行，当float布局时，br换行将失效| -|-|-|-

 ###  Slot
- el-form-item
  

### Methods
名称 |说明| 参数
---|---|---| 
validate|返回表单校验结果,成功true或失败false|-
validate_cb|返回表单校验结果对象，同时将错误信息返回|-
resetFields|作用通el-form|-
clearValidate|作用通el-form|-
```
<template>
    <div>
        <moon-form-template ref="form" :offset="0" :span="12" :model="userEntity" labelWidth="8rem" :rules="rules">
            <el-form-item label="用户名：" prop="username">
                <el-input v-model="userEntity.username" :readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="userEntity.password" :readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="trueName">
                <el-input v-model="userEntity.trueName" :readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="用户编号：" prop="employeeNumber">
                <el-input v-model="userEntity.employeeNumber" :readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="gender">
                <selectWhether v-model="userEntity.gender" :disabled="readonly" :labels="['男', '女']"></selectWhether>
            </el-form-item>
            <el-form-item label="证件类型：" prop="certificatetypeId">
                <selectCode v-model="userEntity.certificatetypeId" :disabled="readonly" :code="31"></selectCode>
            </el-form-item>
            <el-form-item label="证件号码：" prop="certificateNumber">
                <el-input v-model="userEntity.certificateNumber" :readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="出生日期：" prop="dateOfBirth">
                <el-date-picker v-model="userEntity.dateOfBirth" valueFormat="yyyy-MM-dd" type="date" :disabled="readonly"></el-date-picker>
            </el-form-item>
            <el-form-item label="用户类型：" prop="userType">
                <selectCode v-model="userEntity.userType" :disabled="readonly" :code="17"></selectCode>
            </el-form-item>
            <el-form-item label="用户部门：" prop="unitId">
                <dept v-model="userEntity.unitId" :disabled="readonly"></dept>
            </el-form-item>
            <el-form-item label="用户状态：" prop="userStatus">
                <selectWhether v-model="userEntity.userStatus" :disabled="readonly" :labels="['禁用', '正常']"></selectWhether>
            </el-form-item>
            <el-form-item label="邮箱地址：" prop="email">
                <el-input v-model="userEntity.email" :readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="隶属科室：" prop="sectionId">
                <selectCode v-model="userEntity.sectionId" :disabled="readonly" :code="15"></selectCode>
            </el-form-item>
            <el-form-item label="职位：" prop="positionId">
                <selectCode v-model="userEntity.positionId" :disabled="readonly" :code="16"></selectCode>
            </el-form-item>
            <el-form-item label="人员状态：" prop="accessionState">
                <selectWhether v-model="userEntity.accessionState" :disabled="readonly" :labels="['在职', '离职']"></selectWhether>
            </el-form-item>
            <el-form-item label="角色：" prop="roleIdList" :span="24">
                <roleTransfer v-model="userEntity.roleIdList" :disabled="readonly"></roleTransfer>
            </el-form-item>
            <el-form-item label="备注：" prop="remark" :span="24">
                <el-input v-model="userEntity.remark" :readonly="readonly" type="textarea"></el-input>
            </el-form-item>
        </moon-form-template>
        <div class="buttonGroup" v-if="bus.mode != 'preview'">
            <el-button :disabled="buttonDisabled" type="primary" icon="fa fa-check" @click="onSave">保存</el-button>
            <el-button icon="fa fa-times" @click="onBack">取消</el-button>
        </div>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    name: '',
    props: {},
    created() {},
    mounted() {},
    data() {
        return {
            rules: {
                password: [
                    { required: true, message: '密码必填', trigger: 'blur' },
                    {
                        pattern: /^.*(?=.{8,})(?=.*\d)(?=.*[A-Za-z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/,
                        message: '密码长度至少8位，且包含字母数字符号',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        async onSave() {
            let flag = this.$refs.form.validate();
            if (!flag) return;
            let serviceInterface = this.bus.mode == 'edit' ? this.$service.user.update : this.$service.user.save;
            let res = await serviceInterface(this.userEntity);
            this.$saveMessage(res.status == 200);
            this.onBack();
            this.bus.updateMainView();
        }
    }
};
</script>
<style lang="less" scoped>
}
</style>


```
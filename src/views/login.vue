<template>
    <div style="position: relative">
        <div class="bg"></div>
        <div class="form">
            <moon-form-template ref="ruleFormRef" labelWidth="3rem" :model="formEntity">
                <div style="width: 80%; margin-left: 10%">
                    <el-form-item label="账号" prop="name" style="margin-top: 60px">
                        <el-input v-model="formEntity.userName" placeholder="admin" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password" style="margin-top: 30px">
                        <el-input v-model="formEntity.password" type="password" placeholder="admin"  show-password @keydown.enter.native="submitForm()" />
                    </el-form-item>
                </div>
            </moon-form-template>
            <div style="margin-top: 40px; text-align: center">
                <el-button style="width: 60%" type="primary" @click="submitForm()">登录</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { login } from '@/service/index.js';

export default {
    inheritAttrs: false,
    name: '',
    props: {},
    components: {},
    created() {},
    mounted() {},
    data() {
        return {
            formEntity: {}
        };
    },
    watch: {},
    computed: {},
    methods: {
        async submitForm() {
            let { data } = await login(this.formEntity);
            this.$setStoreValue('user', 'userInfo', data);
            this.$router.replace({ name: 'moon-datav' });
        }
    }
};
</script>
<style lang="scss" scoped>
.bg {
    width: 100%;
    height: 100vh;
    background-image: url('https://www.1724956493.top/files/1680798415610_login-bgm.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transform: scaleX(-1);
}
.form {
    position: absolute;
    padding: 15px;
    background: white;
    border-radius: 5px;
    width: 400px;
    right: 100px;
    top: 0;
    bottom: 0;
    height: 350px;
    margin: auto;
    ::v-deep(.el-form-item__label) {
        font-weight: bold;
    }
}
</style>

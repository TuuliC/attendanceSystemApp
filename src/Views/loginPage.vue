<template>
  <div class="login-container">
    <div class="form-container">
      <h1>欢迎使用</h1>
      <el-form ref="formRef" :model="loginForm" :rules="loginRules" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" @keydown.enter="login">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" @keydown.enter="login">
          <el-input type="text" v-model="loginForm.code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
<!--          <el-checkbox v-model="rememberMe" value="1" label="记住账号" />-->
        </el-form-item>
        <img :src="decodePwd" @click="getVcimg" alt="加载失败" />
      </el-form>
    </div>
  </div>
</template>
<script>
import router from "../router/index";
import {storage} from "../storage/storage";
import {vcimg,doLogin} from "../api/loginApi";
export default {
  data() {
    return {
      formRef: null,
      decodePwd: '',
      rememberMe: [],
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          doLogin(JSON.parse(JSON.stringify({
            username: this.loginForm.username,
            password: this.loginForm.password,
            'remember-me': this.rememberMe[0],
            code: this.loginForm.code
          })))
            .then(res => {
              if (res.data.msg === '验证码不匹配!') {
                this.$notify({
                  title: '验证码不正确',
                  message: '',
                  type: 'warning'
                });
                this.getVcimg();
              }
              if ('data' in res.data) {
                console.log('登录');
                storage.set('isAuthenticated', true);
                storage.set('role', res.data.data.role);
                storage.set('freshRoute', true);
                storage.set('id', res.data.data.id);
                storage.set('username', res.data.data.username);
                if (res.data.data.role==='1')
                  router.push('/home');
                else router.push('/attendance');
              }
            })
            .catch(() => {
              this.$notify({
                title: '登陆失败，请重试',
                message: '',
                type: 'warning'
              });
              this.getVcimg();
            });
        } else {
          this.$notify({
            title: '登陆失败，请重试',
            message: '',
            type: 'warning'
          });
          this.getVcimg();
        }
      });
    },
    getVcimg() {
      vcimg('/api/vcimg')
        .then(res => {
          // console.log(res.data);
          this.decodePwd = 'data:image/jpeg;base64,' + res.data;
        });
    }
  },
  mounted() {
    this.getVcimg();
  }
}
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-container {
  background-image: url('../../static/image/guangyou1.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center center;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
}
.form-container {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: auto;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>

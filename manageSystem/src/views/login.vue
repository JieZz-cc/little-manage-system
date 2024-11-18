<template>
  <div>
    <el-row class="login-page">
      <el-col :span="12" class="bg">
      </el-col>
      <el-col :span="6" :offset="3" class="form">
        <!-- 注册 -->
        <el-form v-if="!data.isLogin" ref="registerForm"  :rules="formRules" size="large" :model="registerData" label-width="auto" style="max-width: 500px">
          <el-form-item>
            <h1>注册</h1>
          </el-form-item>
          <el-form-item prop="user">
            <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
          </el-form-item>
          <el-form-item prop="rePassword">
            <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码" v-model="registerData.rePassword"></el-input>
          </el-form-item>
          <el-button type="primary" @click="register" :loading="data.btnloading" style="width: 100%;">注册</el-button>
          <el-link type="info" :underline="false" style="margin-top: 16px;" @click="showLogin">← 登录</el-link>
        </el-form>

        <!-- 登录 -->
         <el-form v-else size="large" ref="loginForm"  :rules="formRules" :model="loginData" label-width="auto" style="max-width: 500px">
          <el-form-item>
            <h1>登录</h1>
          </el-form-item>
          <el-form-item prop="user">
            <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="flex">
              <el-checkbox v-model="loginData.rememberMe" label="记住我"></el-checkbox>
              <el-link type="primary" :underline="false" >忘记密码？</el-link>
            </div>
          </el-form-item>
          <el-button type="primary" @click="login" :loading="data.btnloading" style="width: 100%;">登录</el-button>
          <el-link type="info" :underline="false" style="margin-top: 16px;" @click="showRegister">注册 →</el-link>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive, getCurrentInstance} from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import {userTokenStore} from '@/store/token.js'
const userToken = userTokenStore()
import {useRouter} from 'vue-router';
const router = useRouter()

const globalProperties = getCurrentInstance().appContext.config.globalProperties
const $http = globalProperties.$http

const data = reactive({
  isLogin: true,
  btnloading: false
})
// 登录表单
const loginData = reactive({
  user: '',
  password: '',
  rememberMe: false
})
// 注册表单
const registerData = reactive({
  user: '',
  password: '',
  rePassword: '',  // 确认密码
})
//自定义确认密码的校验函数
const rePasswordValid = (rule, value, callback) => {
    if (value == null || value === '') {
        return callback(new Error('请再次确认密码'))
    }
    if (registerData.password !== value) {
        return callback(new Error('两次输入密码不一致'))
    }
}
//表单校验
const formRules = {
    user: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '用户名的长度必须为3~10位', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度必须为5~16位', trigger: 'blur' }
    ],
    rePassword: [
        { validator: rePasswordValid, trigger: 'blur' }
    ]
}

const showRegister = () => {
  data.isLogin = false
  registerData.user = ''
  registerData.password = ''
  registerData.rePassword = ''
}

const showLogin = () => {
  data.isLogin = true
  loginData.user = ''
  loginData.password = ''
  loginData.rememberMe = false
}

// 登录
const login = () => {
  data.btnloading = true
  const url = '/user/login'
  const params = {
    username: loginData.user,
    password: loginData.password,
    // isRemember: loginData.rememberMe
  }
  $http('post', url, params, 'urlencoded').then(res => {
    data.btnloading = false
    ElMessage.success('登录成功')
    // 登录成功设置token
    userToken.setToken(res.data)
    router.push('/')
  }).catch(e => {
    data.btnloading = false
  })
}

// 注册
const register = () => {
  data.btnloading = true
  const url = '/user/register'
  const params = {
    username: registerData.user,
    password: registerData.password
  }
  $http('post', url, params, 'urlencoded').then(res => {
    data.btnloading = false
    ElMessage({
      message: res.message,
      type: res.code === 0 ? 'success' : 'error',
    })
    if (res.code === 0) showLogin()
  }).catch(e => {
    data.btnloading = false
    ElMessage({
      message: '操作失败',
      type: 'error',
    })
    console.log(e);
  })
}

</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
                url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    // user-select: none;
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
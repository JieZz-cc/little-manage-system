<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="账户名">
              <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname" required>
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" required>
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import {ref, reactive, getCurrentInstance} from 'vue'
import { userInfoStore } from '@/store/userInfo'
import { ElMessage } from 'element-plus';
import router from '@/router';
const user = userInfoStore()
const userInfo = reactive({...user.info})
const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: '昵称必须是2-10位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
}


const globalProperties = getCurrentInstance().appContext.config.globalProperties
const $http = globalProperties.$http

const updateUserInfo = () => {
  const url = '/user/update'
  const params = {
    id: userInfo.id,
    nickname: userInfo.nickname,
    email: userInfo.email
  }
  $http('put', url, params).then(res => {
    ElMessage.success('修改成功，请重新登录')
    router.push('/login')
  })
}

</script>

<style lang="scss" scoped>

</style>
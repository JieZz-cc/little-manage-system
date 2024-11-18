<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>重置密码</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="newUserInfo" label-width="100px" size="large">
          <el-form-item label="账户名">
              <el-input v-model="newUserInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="旧密码" prop="oldPwd" required>
            <el-input v-model="newUserInfo.oldPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd" required>
            <el-input v-model="newUserInfo.newPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="rePwd" required>
            <el-input v-model="newUserInfo.rePwd" type="rePwd"></el-input>
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
const rawUserInfo = reactive({...user.info})
const newUserInfo = reactive({
  username: rawUserInfo.username,
  id: rawUserInfo.id,
  oldPwd: '',
  newPwd: '',
  rePwd: ''
})

const globalProperties = getCurrentInstance().appContext.config.globalProperties
const $http = globalProperties.$http

const updateUserInfo = () => {
  const url = '/user/updatePwd'
  const params = {
    id: newUserInfo.id,
    old_pwd: newUserInfo.oldPwd,
    new_pwd: newUserInfo.newPwd,
    re_pwd: newUserInfo.rePwd,
  }
  $http('patch', url, params).then(res => {
    ElMessage.success('修改成功，请重新登录')
    router.push('/login')
  })
}

</script>

<style lang="scss" scoped>

</style>
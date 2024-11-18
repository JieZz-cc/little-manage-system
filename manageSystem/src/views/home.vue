<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu router active-text-color="#ffd04b" background-color="#232323" text-color="#fff">
        <div v-for="(item, index) in menuData" :key="index">
          <el-menu-item  v-if="!item.hasSub" :index="item.indexUrl">
            <el-icon>
              <Management v-if="item.ico === 'category'"></Management>
              <Promotion v-if="item.ico === 'manage'"></Promotion>
              <UserFilled v-if="item.ico === 'person'"></UserFilled>
            </el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
          <el-sub-menu v-if="item.hasSub" :index="item.indexUrl">
            <template #title>
              <el-icon>
                <UserFilled />
              </el-icon>
              <span>{{ item.label }}</span>
            </template>
            <div v-for="(j, index2) in item.subMenu" :key="index2">
              <el-menu-item  :index="j.indexUrl">
                <el-icon>
                  <User v-if="j.ico === 'info'"></User>
                  <Crop v-if="j.ico === 'avatar'"></Crop>
                  <EditPen v-if="j.ico === 'secret'"></EditPen>
                </el-icon>
                <span>{{ j.title }}</span>
              </el-menu-item>
            </div>
          </el-sub-menu>
        </div>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>当前用户：<strong>{{ userInfo.info.nickname }}</strong></div>
         <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userInfo.info.userPic ? userInfo.info.userPic : avatar" />
            <!-- <el-avatar :src="avatar" /> -->
              <el-icon>
                <CaretBottom />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
              <el-dropdown-item command="userInfo" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="userAvatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="resetpassword" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
         </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <el-footer>大事件 ©2024-10 Created by CJB</el-footer>
      </el-footer>
    </el-container>

  </el-container>
</template>

<script setup>
import {Management,UserFilled,User,Crop,Promotion,
    EditPen,
    SwitchButton,
    CaretBottom,
  } from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { reactive,getCurrentInstance } from 'vue';
import { RouterView } from 'vue-router';
const globalProperties = getCurrentInstance().appContext.config.globalProperties
const $http = globalProperties.$http

import { userInfoStore } from '@/store/userInfo'
import {userTokenStore} from '@/store/token.js'
const userToken = userTokenStore()
const userInfo = userInfoStore()
const getUserInfo = () => {
    const url = '/user/userInfo'
    const params = {}
    $http('get', url, params).then(res => {
      userInfo.setInfo(res.data)
    })
}
getUserInfo();



// 侧边栏数据
const menuData = reactive([
  {label: '文章分类', indexUrl: '/article/category', ico: 'category',hasSub: false},
  {label: '文章管理', indexUrl: '/article/manage',ico: 'manage', hasSub: false},
  {
    label: '个人中心', indexUrl: '',ico: 'person', hasSub: true,
    subMenu: [
      {title: '基本资料',ico: 'info', indexUrl: '/user/userInfo'},
      {title: '更换头像',ico: 'avatar', indexUrl: '/user/userAvatar'},
      {title: '重置密码',ico: 'secret', indexUrl: '/user/resetPassword'},
    ]
  },
])


import { useRouter } from 'vue-router';
const router = useRouter()
const handleCommand = (command) => {
  if (command !== 'logout') {
    router.push(`/user/${command}`)
  } else {
    ElMessageBox.confirm(
      '你确认退出登录吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      userToken.removeToken()
      userInfo.removeInfo()
      router.push('/login')
    }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消登录',
      })
    })
  }
}

</script>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>
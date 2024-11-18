import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue';
import Category from '@/views/article/category.vue';
import Manage from '@/views/article/manage.vue';
import UserInfo from '@/views/user/userInfo.vue';
import UserAvatar from '@/views/user/userAvatar.vue';
import ResetPassword from '@/views/user/resetPassword.vue';
import welcome from '@/views/welcome.vue';

//路由
const routes = [
  {path: '/login', component:Login},
  {
    path: '/', redirect: '/welcome',component: Home, children: [
      { path: '/welcome', component: welcome},  // 重定向，主页默认访问的地址
      { path: '/article/category', component: () => import('@/views/article/category.vue') }, // 懒加载
      // { path: '/article/Category', component: Category},
      { path: '/article/manage', component: Manage},
      { path: '/user/userInfo', component: UserInfo},
      { path: '/user/userAvatar', component: UserAvatar},
      { path: '/user/resetPassword', component: ResetPassword}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router;

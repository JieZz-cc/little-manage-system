import axios from "axios";
import { ElMessage } from "element-plus";
import router from '@/router';
import {userTokenStore} from '@/store/token.js'


const baseURL = '/api'  // url代理，解决跨域问题，在config.js里面server配置
const service = axios.create({
  baseURL: baseURL,
  timeout: 3000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
      // 登录token校验 
      const userToken = userTokenStore()
      if (userToken.token) config.headers.Authorization = userToken.token
      
      return config
  },
  err => {
    ElMessage.error('网络异常')
    return Promise.reject(err)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.data.code === 0) {
      return response.data
    }
    ElMessage({
      message: response.data.message ? response.data.message : '服务异常',
      type: 'error',
    })
    return Promise.reject(response.data)
  },
  err => {
    if (err.response.status === 401) {
      ElMessage.error('请先登录！')
      router.push('/login')
    } else {
      ElMessage.error('服务异常')
    }
    return Promise.reject(err)
  }
)

export default service;
import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { invokeApi } from './api'
//导入持久化插件
// pinia是内存存储，刷新浏览器时数据丢失，此插件可以持久化存储
import { createPersistedState } from 'pinia-persistedstate-plugin'
// 中文语言包
import locale from 'element-plus/dist/locale/zh-cn'

const app = createApp(App)
const pinia = createPinia()
const persist = createPersistedState()
//pinia使用持久化插件
pinia.use(persist)
app.use(pinia)
app.use(router)
app.use({ locale })
app.config.globalProperties.$http = invokeApi

app.mount('#app')


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from "axios";
import socketservice from '@/utils/socket_server'
// import * as echarts from "echarts";// 引入ECharts
import './assets/css/global.less'
const app = createApp(App)
//对服务端的连接
socketservice.Instance.connect()
app.config.globalProperties.$socket=socketservice.Instance
//这个类似于vue2设置 prototype
app.config.globalProperties.$http=axios

app.config.globalProperties.$echarts=window.echarts
axios.defaults.baseURL='http://127.0.0.1:8888/api/'
app.use(createPinia())
app.use(router)

app.mount('#app')

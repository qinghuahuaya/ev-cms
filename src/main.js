import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 配置 elementui
// 引入 elementui 文件
import ElementUI from 'element-ui';
// 引入 elementui 样式
import 'element-ui/lib/theme-chalk/index.css';
// 注册 elementui 
Vue.use(ElementUI);


// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

// 配置 axios
// 引入 axiso 文件
import axios from "axios";
// 设置基地址 
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net'
// 将 axios 挂载道Vue构造函数的原型对象 prototype 
Vue.prototype.$http = axios



// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if ( config.url.startsWith('/my')){
    config.headers.Authorization = store.state.token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  
  if ( error.response.status === 401) {
    store.commit('updateTonke' , '')
    store.commit('updateUserInfo' , '')

    router.push('/login')
  }

  return Promise.reject(error);
});



// 导入css全局文件包
import './assets/global.less'

Vue.config.productionTip = false

new Vue({
  router, // this.$router
  store,
  render: h => h(App)
}).$mount('#app')

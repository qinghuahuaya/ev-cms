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


// 配置 axios
// 引入 axiso 文件
import axios from "axios";
// 设置基地址 
axios.defaults.baseURL = 'http://www.liulongbin.top:3008'
// 将 axios 挂载道Vue构造函数的原型对象 prototype 
Vue.prototype.$http = axios

// 导入css全局文件包
import './assets/global.less'

Vue.config.productionTip = false

new Vue({
  router, // this.$router
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入注册页面文件
import Reg from "@/views/Reg/Reg.vue";
// 导入 登录页面文件
import Login from "@/views/Login/Login.vue";
// 导入首页
import main from "@/views/main/main.vue";


Vue.use(VueRouter)

// 配置规则
const routes = [
  {
    //   注册页
      path : '/reg' ,
      component: Reg
  } ,
  {
    //   登录页
    path : '/login' ,
    component: Login
  } ,
  { 
    // 首页
    path: '/main', 
    component: main 
  }
]

const router = new VueRouter({
  routes
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入注册页面文件
import Reg from "@/views/Reg/Reg.vue";
// 导入 登录页面文件
import Login from "@/views/Login/Login.vue";

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
]

const router = new VueRouter({
  routes
})

export default router

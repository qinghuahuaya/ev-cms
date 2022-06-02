import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入注册页面文件
import Reg from "@/views/Reg/Reg.vue";
// 导入 登录页面文件
import Login from "@/views/Login/Login.vue";
// 导入首页
import main from "@/views/main/main.vue";
// 导入图标页面
import home from "@/views/menus/home/home.vue";
// 导入密码项
import userinfo from "@/views/menus/user/userinfo.vue";
// 导入修改图片模块
import useravatar from "@/views/menus/user/useravatar.vue";
// 导入修改密码模块
import userpwd from "@/views/menus/user/userpwd.vue";
// 导入文章发表模块
import artcate from "@/views/menus/article/artcate.vue";
// 导入发表文章模块
import artlist from "@/views/menus/article/artlist.vue";


Vue.use(VueRouter)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
    path: '/', 
    component: main ,
    redirect: '/home' ,
    children : [
      {
        path : 'home' ,
        component : home
      } ,
      {
        path : 'user-info' ,
        component : userinfo
      } ,
      {
        path : 'user-avatar' ,
        component : useravatar
      } ,
      {
        path : 'user-pwd' , 
        component: userpwd 
      } ,
      {
        path : 'art-cate' ,
        component : artcate
      } ,
      { 
        path: 'art-list', 
        component: artlist 
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

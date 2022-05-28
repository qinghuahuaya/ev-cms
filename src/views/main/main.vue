<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="userInfo.user_pic" alt="" class="avatar"  v-if="userInfo.user_pic" />
            <img src="../../assets/logo.png" alt="" v-else class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="loginout"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
        <el-aside width="200px">
          <div class="user-box">
            <img :src="userInfo.user_pic" alt="" class="avatar" v-if="userInfo.user_pic" />
            <img src="../../assets/logo.png" alt="" v-else />
            <span> {{ userInfo.nickname || userInfo.username }} </span>
          </div>
          <el-menu
            default-active="/home"
            class="el-menu-vertical-demo"
            background-color="#23262E"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            router=""
          >
          <!-- template: 模板标签 不会渲染dom结构 起到包裹标签作用 -->
          <!-- template: 模板标签 不能使用key -->
           <template v-for=" item in menusList">
               <!-- 不包含子菜单的“一级菜单” -->
              <el-menu-item 
                :key="item.indexPath" 
                :index="item.indexPath"
                v-if="!item.children"
                >
                <i :class="item.icon"></i>{{ item.title }}
              </el-menu-item>
            <!-- 包含子菜单的“一级菜单” -->
            <el-submenu 
            :index="item.indexPath" 
            :key="item.indexpath"
            v-else
             >
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
                <el-menu-item 
                v-for="childItem in item.children"
                :key="childItem.indexPath"
                :index="childItem.indexPath"
                >
                <i :class="childItem.icon"></i>
                {{ childItem.title }}
                </el-menu-item>
                
            </el-submenu>
           </template>
         </el-menu>
        </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'Main' ,
  data() {
    return {
      menusList: [],
    };
  },
  methods: {
    //  1. 绑定事件函数
    loginout () {
      // 弹出询问框
       this.$confirm('不要离开我啊', '提示', {
          confirmButtonText: '去意已决',
          cancelButtonText: '还是再看看吧',
          type: 'warning'
        }).then(() => {
          // 确认
          this.$message({
            // 确认弹窗
            type: 'success',
            message: '终究还是回离开我的!' ,
          });
          // 3. 清空token
            this.$store.commit('updateTonke' , '')
            // 3.1 清空userInfo
            this.$store.commit('updateUserInfo' , {})
          // 4. 跳转登录页
            this.$router.push('/login')
        }).catch(() => {
          // 取消 
        });
    } ,
    async initMenus () {
      const { data : res } = await this.$http.get('/my/menus')
      if ( res.code == 0) {
        this.menusList = res.data
      }
    }
  } ,
   created () {
     // 调用ations中的函数
        this.$store.dispatch('initUserInfo')


      // 调用initMenus函数
      this.initMenus ()
      
      // 判断有没有token
      if ( this.token ) {
        this.$store.dispatch('initUserInfo')
        this.initMenus()
      } else {
        this.$router.push('/login')
      }
   } ,
   computed : {
     ...mapState(['userInfo' , 'token'])
   }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
  .el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>

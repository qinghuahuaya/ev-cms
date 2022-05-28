import axios from 'axios';
import Vue from 'vue'
import Vuex from 'vuex'

// 导入 vuex 持久化插件
import createPersistedstate from "vuex-persistedstate";


Vue.use(Vuex)

export default new Vuex.Store({
  plugins : [ createPersistedstate () ] ,
  state: {
    // 存储token
    // token : localStorage.getItem('token') || ''
    token : '' ,
    // 5.存储userInfo
    userInfo :{}
  },
  getters: {
  },
  // 唯一同步更新数据
  mutations: {
    updateTonke ( state , newtoken ) {
      state.token = newtoken
    } ,
    // 4. 定义更新userInfo的函数
    updateUserInfo ( state , info ) {
      state.userInfo = info
    }
  },
  // 异步操作数据
  actions: {
    // 发送请求
    async initUserInfo ( context ) {
      // context 是 state的实例
      const { data : res } = await axios.get('/my/userinfo' , {
        headers : {
          Authorization : context.state.token
        }
      })
      if ( res.code == 0 ) {
        // 3. 将获取到的数据保存到vuex中
        context.commit('updateUserInfo',res.data)
      }
    }
  },
  // 模块化
  modules: {
  }
})

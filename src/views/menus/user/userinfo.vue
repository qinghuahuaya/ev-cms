<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form 
    :model="userForm" 
    :rules="userFormRules" 
    ref="userFormRef" 
    label-width="100px" 
    >
    <!-- 用户名 -->
      <el-form-item label="登录名称" prop="username">
          <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
    <!-- 用户昵称 -->
       <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userForm.nickname"></el-input>
      </el-form-item>
    <!-- 用户邮箱 -->
       <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
      </el-form-item> 
    <!-- 底部按钮栏 -->
      <el-form-item>
        <el-button type="primary" @click="submit">提交修改</el-button>
        <el-button @click="restForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserInfo' ,
  data() {
    return {
      // 存储用户信息对象
      userForm : Object.assign({} , this.$store.state.userInfo) ,
      // 存储验证规则对象
      userFormRules : {
        nickname : [
           { required: true, message: '请输入昵称', trigger: 'blur' },
            { pattern: /^\S{1,10}$/ , message: '昵称必须是1~10的字符串', trigger: 'blur' },
        ] ,
        email : [
           { required: true, message: '请输入邮箱', trigger: 'blur' },
           { type: 'email' , message: '请输入正确的邮箱格式', trigger: 'blur' },
        ]
      }
    };
  },
  methods: {  
    // 实现重置功能
    restForm () {
      // this.userForm = this.$store.state.userInfo
      // 因为v-model和userForm是双向绑定 , 如果直接将vuex中地址给到userForm那么当表单中数据改变 左侧也会改变
      // 所有 可以使用浅拷贝 , 将 vuex中的数据拷贝到一个新对象中 , 这样就不会改变vuex数据
      this.userForm = Object.assign({} , this.$store.state.userInfo)
    } ,
    // 实现修改功能
    submit () {
      this.$refs.userFormRef.validate( async (valid) => {
        if ( !valid ) return
        const { data : res } = await this.$http.put ('/my/userinfo',this.userForm)
        if ( res.code !== 0) return this.$message.error( res.message )
        this.$message.success( res.message )
        this.$store.dispatch('initUserInfo')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>

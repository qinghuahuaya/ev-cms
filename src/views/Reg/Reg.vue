<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form 
      :model="regForm" 
      :rules="regFormRules" 
      ref="regFormRef" 
      >

          <!-- 用户名模块 -->
          <el-form-item prop="username">
              <el-input 
                v-model="regForm.username"
                placeholder = "请输入用户名"
                prefix-icon="el-icon-user"
              ></el-input>
          </el-form-item>

            <!-- 密码模块 -->
          <el-form-item prop="password">
              <el-input 
              v-model="regForm.password"
              type = "password"
              placeholder = "请输入密码"
              prefix-icon="el-icon-lock"
              ></el-input>
          </el-form-item>

            <!-- 确认密码模块 -->
          <el-form-item prop="repassword">
              <el-input
              v-model="regForm.repassword"
              type = "password" 
              placeholder = "请确认密码"
              prefix-icon="el-icon-lock"
              ></el-input>
          </el-form-item>

            <!-- 注册按钮 和 切换模块 -->
          <el-form-item>
              <el-button 
              type="primary" 
              style="width:100%"
              @click="regNewUser"
              >注册</el-button>
              <el-link type = "info" @click="$router.push('/login')">去登录</el-link>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reg' ,
  data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.regForm.password) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        } 
        return {
        //   保存表单里面的数据
          regForm : {
            username : '' ,
            password : '' ,
            repassword : '' ,
          }, 

        //  存储验证规则
        regFormRules : {
            username : [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                {
                    pattern : /^[a-zA-Z][a-zA-Z0-9]{0,9}$/,
                    message : '用户名必须是1~10的字母数字 , 数字不能开头!' ,
                    trigger : 'blur'
                }
            ] ,
            password : [
                { required: true, message: '请输入密码', trigger: 'blur' },
                {
                    pattern : /^\S{6,15}$/,
                    message : '密码必须是6~15的非空字符串 ' ,
                    trigger : 'blur'
                }
            ] ,
            repassword : [
                { required: true, message: '请输入密码', trigger: 'blur' },
                {
                    pattern : /^\S{6,15}$/,
                    message : '密码必须是6~15的非空字符串 ' ,
                    trigger : 'blur'
                } ,
                { validator: validatePass2, trigger: 'blur' }
            ] ,
        }
    };
  },
  methods: {
      regNewUser () {
        //  1 . 绑定事件函数
        //  2 . 表单校验
          this.$refs.regFormRef.validate(async(valid) => {
            //   valid : 只有校验全部通过才为true 其他全为false
              if ( !valid) return // 校验未通过
            //   校验通过执行操作
            // 3. 发送请求实现注册
            const { data : res }= await this.$http.post('/api/reg',this.regForm)
            console.log(res);
            // 3.1 请求失败提示用户
            if ( res.code !== 0) return this.$message.error( res.message );
            // 3.2 请求成功提示用户
             this.$message.success( res.message );
            // 4 跳转登录页
            this.$router.push('login')
          })
      }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }
  } 
.el-form {
    padding: 0 25px;
}
}
</style>


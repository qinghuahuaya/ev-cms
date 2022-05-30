<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwd">修改密码</el-button>
        <el-button @click="$refs.pwdFormRef.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserPwd',
  data() {
    // 判断修旧密码是否不一致
    var samePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value === this.pwdForm.old_pwd) {
          callback(new Error('新旧密码不能相同!'));
        } else {
          callback();
        }
      }
        // 新密码和确认密码是否相同
    var rePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.pwdForm.new_pwd) {
          callback(new Error('确认密码和新密码不一致!'));
        } else {
          callback();
        }
      }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd : 
        [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' } 
        ] ,
        new_pwd : 
        [
           { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' } ,
           { validator: samePwd, trigger: 'blur' }
        ] ,
        re_pwd : 
        [
           { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' } ,
           { validator: rePwd, trigger: 'blur' }
        ]
      }
    } 
  } ,
  methods: {
    updatePwd () {
      this.$refs.pwdFormRef.validate( async ( valid ) => {
        if ( !valid ) return
        const { data : res } = await this.$http.patch ('/my/updatepwd',this.pwdForm)
        console.log(res);
        if ( res.code !== 0 ) return this.$message.error ( res.message)
        this.$message.success ( res.message)
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

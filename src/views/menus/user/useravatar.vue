<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img :src="avatar" alt="" class="preview" v-if="avatar" />
      <img src="../../../assets/images/avatar.jpg" alt="" class="preview" v-else />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display:none" ref='iptFile' @change="onChangeFile">
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="onUPloadImage">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar' ,
  data() {
    return {
      avatar: '',
    }
  },
  methods: {
    chooseImg () {
      this.$refs.iptFile.click()
    } ,
    onChangeFile ( e ) {
      // console.log(e);
      const fileList =  e.target.files
      if ( fileList.length > 0) {
        const reader = new FileReader ()
        // console.log(fileList[0]);
        reader.readAsDataURL(fileList [ 0 ])
        reader.addEventListener('load',() => {
          this.avatar = reader.result
        })
      } else {
        this.avatar = ''
      }
    } ,
    async onUPloadImage () {
      const { data : res } = await this.$http.patch('/my/update/avatar',{
        avatar : this.avatar
      })
      if ( res.code !== 0 ) return this.$message.error( res.message ) 
      this.$message.success( res.message )
      this.$store.dispatch('initUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
  width: 350px;
  height: 350px;
}
</style>

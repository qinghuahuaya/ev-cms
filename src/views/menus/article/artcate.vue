<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addDialogVisible = true">添加分类</el-button>
      </div>
       <el-table
        :data="artcateList"
        style="width: 100%"
        border=""
        >
        <el-table-column
            type="index"
            label="序号"
            width="50"
            >
        </el-table-column>
        <el-table-column
            prop="cate_name"
            label="分类名称"
            width="180"
            >
        </el-table-column>
        <el-table-column
          prop="cate_alias"
          label="分类别名"
          >
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template v-slot="{row}">
            <!-- 修改 -->
           <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(row.id)"></el-button>
           <!-- 删除 -->
           <el-button type="danger" icon="el-icon-delete" circle @click="deltetArtCate(row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加文章分类对话框start -->
    <el-dialog
      title="添加文章分类"
      :visible.sync="addDialogVisible"
      width="35%"
      @closed = "$refs.addFormRef.resetFields()"
      >
      <!-- 表单区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类类别" prop="cate_alias">
          <el-input v-model="addForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addArtCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加文章分类对话框end -->


    <!-- 修改文章分类 -->
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      width="35%"
      @closed = "$refs.editFormRef.resetFields()"
      >
      <!-- 表单区域 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类类别" prop="cate_alias">
          <el-input v-model="editForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ediArtCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改文章分类对话框end -->  


  </div>
</template>

<script>
export default {
  name: 'ArtCate' ,
  data() {
    return {
      // dialogVisible 对话框控制显示和隐藏
      addDialogVisible: false ,
      // 修改对话框
      editDialogVisible : false ,
      // 保存文字列表数据
      artcateList: [] ,
      // 保存添加文章数据对象
      addForm : {
        cate_name : '' ,
        cate_alias : ''
      } ,
      // 保存修改文章数据对象
      editForm : {
        cate_name : '' ,
        cate_alias : ''
      } ,
      addFormRules : {
        cate_name : [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '密码长度必须是1-10位的非空字符串', trigger: 'blur' } 
        ] ,
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-z0-9]{1,15}$/, message: '密码长度必须是1-15位的非空字符串', trigger: 'blur' } 
        ] ,
      }
    };
  },
  methods: {
    async initArtCateList () {
      const { data : res } = await this.$http.get('/my/cate/list')
      console.log(res);
      if ( res.code === 0 ) {
        this.artcateList = res.data
      }
    } ,
    addArtCate () {
      this.$refs.addFormRef.validate( async ( valid ) => {
        if ( !valid ) return
        const { data : res } = await this.$http.post('/my/cate/add',this.addForm)
        if ( res.code !== 0 ) return  this.$message.error(res.message)
        this.$message.success(res.message)
        this.addDialogVisible = false
        this.initArtCateList ()
      })
    } ,
    async showEditDialog ( id ) {
      const { data : res } = await this.$http.get('/my/cate/info',{
        params : {id}
      })
      if ( res.code == 0 ) {
        this.editForm = res.data
      }
        this.editDialogVisible = true
    } ,
    ediArtCate () {
      this.$refs.editFormRef.validate ( async ( valid ) => {
        if ( !valid ) return
        const { data : res } = await this.$http.put('/my/cate/info',this.editForm)
        if ( res.code !== 0 ) return this.$message.error ( res.message)
        this.$message.success ( res.message)
        this.editDialogVisible = false 
        this.initArtCateList ()
      } )
    } ,
    deltetArtCate ( id ) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then( async () => {
        // 确定
        const { data : res } = await this.$http.delete('/my/cate/del',{
          params : {id}
        })
          if ( res.code !== 0 ) return this.message.error( res.message )
          this.$message.success( res.message )
          this.initArtCateList ()
      }).catch(() => {
        // 取消
      });
    }
  } ,
  created () {
    this.initArtCateList ()
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option :label="item.cate_name" :value="item.id" v-for=" item in ArtCateList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getArticleList ()">筛选</el-button>
            <el-button type="info" size="small" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click=" pubDialogVisible = true">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table
        :data="ArticleList"
        style="width: 100%"
        border
        >
        <el-table-column
          prop="title"
          label="文章标题"
          width="180">
             <template v-slot="{ row }">
              <el-link type="primary" @click="showDetail(row.id)">{{ row.title }}</el-link>
            </template>
        </el-table-column>
        <el-table-column
          prop="cate_name"
          label="文章分类"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pub_date"
          label="发布时间">
          <template v-slot="{ row }">
            {{ formatData ( row.pub_date) }}
          </template>
        </el-table-column>
         <el-table-column
          prop="state"
          label="状态">
        </el-table-column>
         <el-table-column
          label="操作">
             <template v-slot="{row}">
               <el-button type="danger" icon="el-icon-delete" circle @click="deleteArticle (row.id)"></el-button>
             </template>
        </el-table-column>
      </el-table>
      <!-- 文章表格区域 -->

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="q.pagenum"
      :page-sizes="[2, 5, 10, 30]"
      :page-size="q.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 分页区域 -->


    </el-card>

    <!-- 查看文章详情的对话框 -->
      <el-dialog title="文章预览" :visible.sync="detailvisible" width="80%">
        <h1 class="title">{{ artDetail.title }}</h1>
        <div class="info">
          <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
          <span>发布时间：{{ formatData (artDetail.pub_date) }}</span>
          <span>所属分类：{{ artDetail.cate_name }}</span>
          <span>状态：{{ artDetail.state }}</span>
        </div>
        <!-- 分割线 -->
        <el-divider></el-divider>
        <img :src="'http://big-event-vue-api-t.itheima.net' + artDetail.cover_img" alt="" />
        <div v-html="artDetail.content"></div>
      </el-dialog>


    <!-- 发表文章对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @closed="closeResetForm"
      >
      <!-- 发布文章的对话框 -->
    <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
          <el-option 
          :label="item.cate_name" 
          :value="item.id"
          v-for=" item in ArtCateList"
          :key="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
     <el-form-item label="文章内容" prop="content" >
       <quill-editor v-model="pubForm.content"></quill-editor>
     </el-form-item>

     <el-form-item label="文章封面">
        <!-- 用来显示封面的图片 -->
        <img src="../../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
        <br />
        <!-- 文件选择框，默认被隐藏 -->
        <input type="file" style="display: none;" accept="image/*" ref="iptFile" @change="onChangeFile" />
        <!-- 选择封面的按钮 -->
        <el-button type="text" @click="$refs.iptFile.click()">+ 选择封面</el-button>
      </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="pubArticle('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticle('草稿')">存为草稿</el-button>
        </el-form-item>
        
    </el-form>
    </el-dialog>
<!-- 发表文章对话框 -->
  </div>
</template>

<script>
import dayjs from "dayjs";
import defaultImg from "@/assets/images/cover.jpg";
export default {
  name: 'ArtList',
  data() {
    return {
      // 查询参数对象
        q: {
          pagenum: 1,
          pagesize: 2,
          cate_id: '',
          state: ''
        } ,
        articleDetail : {} ,
        artDetail  : {} ,
       // 保存文章分类
       ArtCateList : [] ,
       // 保存文章列表
       ArticleList : [] ,
      // 页面刷新进入第几个分页
      currentPage4: 4 ,
      // 对话框显示和隐藏
      pubDialogVisible: false ,
      // 控制详情页对话框
      detailvisible: false ,
        // 表单的数据对象
      pubForm: {
        title: '' ,
        cate_id: '' ,
        // 文章的内容
        content: '' ,
        cover_img : null ,
        state : ''
    },
      // 表单的验证规则对象
      pubFormRules: 
      {
        title: 
         [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
         ],
        cate_id: 
         [
            { required: true, message: '请选择文章分类', trigger: 'change'  }
         ] ,
         content: 
         [
            { required: true, message: "请输入文章内容", trigger: "blur" },
         ]
      } ,
      // 控制多少条
      total : 0 ,
    }
  } ,
  methods: {


    handleClose(done) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done() 
      }).catch(() => {
        
      });
    } ,

  // 获取文章分类
    async getArtCateList () {
      const { data : res } = await this.$http.get('/my/cate/list') 
      if ( res.code === 0 ) {
        this.ArtCateList = res.data
      }
    } ,


    onChangeFile ( e ) {
      const fileList = e.target.files
      if ( fileList.length > 0 ) {
          this.pubForm.cover_img = fileList [ 0 ]
          const url = URL.createObjectURL(fileList[0])
          this.$refs.imgRef.setAttribute('src',url)
      } else {
          this.pubForm. cover_img = null
          this.$refs.imgRef.setAttribute('src',defaultImg)
      }
    },


    pubArticle( state ) {
      this.pubForm.state = state
      this.$refs.pubFormRef.validate( async (valid) =>{
        if ( !valid ) return this.$message.error('文章信息不完整')
        if ( this.pubForm.cover_img === null ) {
          return this.$message.error('请上传封面')
        }
        const fd = new FormData ()
        Object.keys( this.pubForm ).forEach( ( key ) => {
          // console.log(key)
          // console.log(this.pubForm[key]);
          fd.append( key , this.pubForm[key])
        })
        // fd.forEach( function (value , key ) {
        //   console.log(key , '----' , value);
        // })
        const { data : res } = await this.$http.post('/my/article/add' , fd)
        if ( res.code !== 0 ) return this.$message.error ( res.message )
        this.$message.success( res.message )
        this.pubDialogVisible = false
        this.$refs.iptFile.value = ''
        this.getArticleList()
      })
    } ,


    //  重置表单
    closeResetForm () {
      this.$refs.pubFormRef.resetFields ()
      this.pubForm.cover_img = null
      this.$refs.imgRef.setAttribute('src',defaultImg)
      this.pubForm.state=''
    } ,

  // 获取文章列表
    async getArticleList () {
      const { data : res } = await this.$http.get('/my/article/list' , {
        params : this.q
      })
      if( res.code === 0 ) {
        this.ArticleList = res.data
        this.total = res.total
      }
    } ,


    // 格式化时间函数
    formatData ( item ) {
      return dayjs(item).format('YYYY-MM-DD HH:mm:ss')
    } ,


    // 切换每一页多少条时触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.q.pagenum = 1
      this.q.pagesize = val
      this.getArticleList ()
    },


    // 切换当前页码时刷新
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.q.pagenum = val
      this.getArticleList ()
    } ,


    resetForm () {
      this.q = {
          pagenum: 1,
          pagesize: 2,
          cate_id: '',
          state: ''
      }
      this.getArticleList ()
    } ,

    async showDetail ( id ) {
      const { data : res } = await this.$http.get('/my/article/info',{
        params : {id}
      })
      if ( res.code === 0 ) {
        this.artDetail = res.data
        this.detailvisible = true
        // console.log(res);
      }
    } ,

    // 删除文章
    deleteArticle ( id ) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          const { data : res } = await this.$http.delete('/my/article/info',{
            params:{id}
          })
          if ( res.code !== 0 ) return this.$message.error( res.message)
          this.$message.success( res.message)
          if ( this.ArticleList.length === 1 && this.q.pagenum > 1) {
            this.q.pagenum--
          }
          this.getArticleList ()
        }).catch(() => {
                 
        });
    }
    

  } ,
  created () {
    // 文章分类
    this.getArtCateList ()
    // 文章列表
    this.getArticleList ()
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
/deep/ .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.el-pagination {
  margin: 15px;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}
</style>

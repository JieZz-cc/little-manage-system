<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary" @click="openAdd">添加文章</el-button>
        </div>
      </div>
    </template>
    <el-form inline>
      <el-form-item label=" 文章分类：">
        <el-select
          placeholder="请选择"
          v-model="data.categoryId"
          style="width: 200px"
        >
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.label"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select
          placeholder="请选择"
          v-model="data.state"
          style="width: 200px"
        >
          <el-option label=" 已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="articles" style="width: 100%">
      <el-table-column
        label="文章标题"
        width="120"
        prop="title"
      ></el-table-column>
      <el-table-column label="分类" prop="categoryId" width="130"></el-table-column>
      <el-table-column label="内容" prop="content"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"> </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="110">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="edit(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="data.pageNum"
      v-model:page-size="data.pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="data.total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    >
    </el-pagination>

    <!-- 侧边栏 -->
     <el-drawer v-model="data.drawerShow" :title="data.title" direction="rtl" size="40%">
        <el-form :model="articleModel" label-width="100px">
          <el-form-item label="文章标题" required>
            <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="文章分类" required>
            <el-select placeholder="请选择" v-model="articleModel.categoryId">
                <el-option v-for="c in categorys" :key="c.id" :label="c.label" :value="c.id">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章封面">
            <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
              name="file" :headers="{ 'Authorization': userToken.token }" :on-success="uploadSuccess">
              <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="文章内容">
            <div class="editor">
                <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                </quill-editor>
              </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                @click="addArticle('已发布')">发布</el-button>
            <el-button type="info"
                @click="addArticle('草稿')">草稿</el-button>
          </el-form-item>
        </el-form>
     </el-drawer>
  </el-card>
</template>

<script setup>
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const globalProperties = getCurrentInstance().appContext.config.globalProperties
const $http = globalProperties.$http

import {userTokenStore} from '@/store/token.js'
import { ElMessage } from 'element-plus';
const userToken = userTokenStore()

const data = reactive({
  categoryId: '',
  state: '',
  pageNum: 1,
  pageSize: 5,
  total: 0,
  drawerShow: false,
  title: ''
})

const articleModel = reactive({
  title: '',
  categoryId: '',
  coverImg: '',
  content: '',
  state: ''
})
const uploadSuccess = (result) => {
  //img就是后台响应的数据，格式为：{code:状态码，message：提示信息，data: 图片的存储地址}
  articleModel.coverImg = result.data
}

// 查询文章分类
const categorys = reactive([])
const getCategorys = () => {
  $http('get', '/category/getCategorys', {}).then(res => {
    if (res.data && res.data.length > 0) {
      res.data.forEach(i => {
        categorys.push({
          id: i.id,
          label: i.categoryName,
        })
      })
    }
  })
}
getCategorys()

// 查询所有文章
let articles = ref([])
const getArticleList = () => {
  // const url = '/article/getArticleList'
  const url = '/article/queryList'
  const params = {
    pageSize: data.pageSize,
    pageNum: data.pageNum,
    categoryId: data.categoryId,
    state: data.state,
  }
  $http('get', url, params, 'queryString').then(res => {
    data.total = res.data.total
    articles.value = res.data.items
  })
}
getArticleList()

// 每页条数变更
const onSizeChange = size => {
  data.pageSize = size
  getArticleList()
}
// 翻页
const onCurrentChange = num => {
  data.pageNum = num
  getArticleList()
}

const clear = () => {
  data.drawerShow = false
  data.title = ''
  articleModel.title = ''
  articleModel.content = ''
  articleModel.coverImg = ''
  articleModel.categoryId = ''
}

const addArticle = (type) => {
  let url = data.title === '新增文章' ? '/article' : '/article/editAritcle'
  let method = data.title === '新增文章' ? 'post' : 'put'
  const params  = {
    title: articleModel.title,
    content: articleModel.content,
    coverImg: articleModel.coverImg,
    state: type,
    categoryId: articleModel.categoryId,
  }
  if(data.title !== '新增文章') params.id = articleModel.id
  $http(method, url, params).then(res => {
    ElMessage.success('新增成功')
    clear()
    getArticleList()
  }).catch(e => {
    clear()
  })
}
// 新增文章
const openAdd = () => {
  data.drawerShow = true
  data.title = '新增文章'
}
// 编辑
const edit = (row) => {
    data.drawerShow = true
    data.title = '编辑文章'
    console.log(row);
    articleModel.title = row.title
    articleModel.categoryId = row.categoryId
    articleModel.coverImg = row.coverImg
    articleModel.content = row.content
    articleModel.id = row.id
}
//重置查询
const resetQuery = () => {
  data.state = ''
  data.categoryId = ''
  getArticleList()
}
// 搜索
const search = () => {
  getArticleList()
}
// 删除文章
const deleteArticle = row => {
  const url = '/article/delete'
  const params = {
    id: row.id
  }
  $http('delete', url, params).then(res => {
    ElMessage.success(res.message)
    getArticleList()
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>

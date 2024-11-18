<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <el-button type="primary"
            @click="addCategory">添加分类</el-button>
          </div>
      </div>
    </template>
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column width="100" type="index" label="序号"></el-table-column>
      <el-table-column  label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column  label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column  label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column width="110" label="操作">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="editDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <el-dialog v-model="boxData.boxShow" :title="boxData.title" width="30%">
      <el-form :model="boxData"  label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName" required>
          <el-input v-model="boxData.categoryName" :minlength="1" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias" required>
          <el-input v-model="boxData.categoryAlias" :minlength="1" :maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import {Edit, Delete} from '@element-plus/icons-vue'
import {ref, reactive,getCurrentInstance, onMounted } from 'vue';
const globalProperties = getCurrentInstance().appContext.config.globalProperties
const $http = globalProperties.$http

const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}
let boxData = reactive({
    boxShow: false,
    title: '',
    rowId: '',
    categoryName: '',
    categoryAlias: '',
})

const tableData = ref([])


const addCategory = () => {
  boxData.boxShow = true
  boxData.title = '添加分类'
  
}

const putCategory = (method) => {
  const url = '/category'
  const params = {
    id: boxData.rowId,
    categoryName: boxData.categoryName,
    categoryAlias: boxData.categoryAlias
  }
  $http(method, url, params).then(res => {
    cancel()
    getCatecoryById()
  })
}

const editDialog = (row) => {
  boxData.rowId = row.id
  boxData.boxShow = true
  boxData.title = '编辑分类'
  boxData.categoryAlias = row.categoryAlias
  boxData.categoryName = row.categoryName
}


const deleteCategory = (row) => {
  ElMessageBox.confirm(
    '你确认退出登录吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const url = '/category?id=' + row.id
    const params = {
      // id: row.id
    }
    $http('delete', url, params).then(res => {
      ElMessage.success('删除成功')
      getCatecoryById()
    })
  }).catch(() => {
    ElMessage.error('删除失败')
  })
}

const cancel = () => {
  boxData.rowId = ''
  boxData.boxShow = false
  boxData.categoryAlias = ''
  boxData.categoryName = ''
}

const submit = () => {
  if (boxData.title === '添加分类') {
    putCategory('post')
  } else {
    putCategory('put')
  }
}

const getCatecoryById = () => {
  const url = '/category'
  const params = {}
  $http('get', url, params).then(res => {
    tableData.value = res.data
    // tableData = reactive(res.data)
  })
}
getCatecoryById()
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
</style>
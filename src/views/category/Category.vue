<template>
  <div class="category">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-button type="success" plain @click="addDialog()">添加分类</el-button>
      </el-col>
    </el-row>

    <tree-grid
      :treeStructure="true"
      :columns="columns"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory">
    </tree-grid>

    <div style="margin-top:10px;background:#D3DCE6;padding:10px" class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        >
      </el-pagination>
    </div>
<!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="addCateForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            :options="options"
            v-model="selectedOptions"
            :props="props"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateSubmit('addCateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TreeGrid from '@/components/TreeGrid/TreeGrid'
import {getCategories, addCategories} from '@/api'
export default {
  data () {
    return {
      addDialogFormVisible: false,
      dataSource: [],
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: ''
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: ''
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: ''
      }],
      pagesize: 10,
      pagenum: 1,
      total: 0,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      options: [], // 级联数据源
      // props表示配置级联选择器展示的数据字段
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      selectedOptions: [] // 级联选择器选中后的数据
    }
  },
  methods: {
    deleteCategory (cid) {
      console.log(cid)
    },
    editCategory (cid) {
      console.log(cid)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.initCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.initCategoryList()
    },
    handleChange (val) {},
    initCategoryList () {
      // categoryList({type: '3', pagesize: this.pagesize, pagenum: this.pagenum}).then(res => {
      //   console.log(res)
      //   if (res.meta.status === 200) {
      //     this.dataSource = res.data
      //     this.total = res.data.length
      //   }
      // })
      getCategories({type: '3', pagesize: this.pagesize, pagenum: this.pagenum}).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.dataSource = res.data.result
          this.total = res.data.total
        }
      })
    },
    addCateSubmit () {},
    addDialog () {
      this.addDialogFormVisible = true
      addCategories(this.addForm).then(res => {
        console.log(res)
        this.options = res.data
      })
    }
  },
  components: {
    TreeGrid
  },
  created () {
    this.initCategoryList()
  }
}
</script>

<style lang="sass" scoped>

</style>

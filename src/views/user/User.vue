<template>
  <div class="user">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <!-- 给组件绑定原生事件的时候需要.native修饰符 -->
        <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList">
          <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
        </el-input>
        <el-button type="success" plain @click="addDialogFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="userList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="medium" type="danger" icon="el-icon-delete" plain></el-button>
          <el-button size="medium" type="success" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top:10px;background:#D3DCE6;padding:10px" class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules='rules' ref="addUserForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {userList, changeUserState, addUser} from '@/api'
export default {
  data () {
    return {
      userList: [],
      query: '',
      total: 0,
      pagesize: 2,
      pagenum: 1,
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        mobile: [
          { required: true, message: '电话不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initList()
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.initList()
    },
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    changeUserState (row) {
      // console.log(row)
      // let params = {params: {uid: row.id, type: row.mg_state}}
      changeUserState({uid: row.id, type: row.mg_state}).then(res => {
        if (res.meta.status === 200) {
          this.openCenter()
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'warning',
            center: true
          })
        }
      })
    },
    openCenter () {
      this.$message({
        message: '用户状态更改成功',
        center: true,
        type: 'success'
      })
    },
    initList () {
      let params = {params: {query: this.query, pagenum: this.pagenum, pagesize: this.pagesize}}
      userList(params).then(res => {
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    addUserSubmit (formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          addUser(this.addForm).then(res => {
            console.log(res)
            if (res.meta.status === 201) {
              this.$message({
                message: '用户添加成功',
                center: true,
                type: 'success'
              })
              this.addDialogFormVisible = false
              this.addForm.username = ''
              this.addForm.password = ''
              this.addForm.email = ''
              this.addForm.mobile = ''
              this.initList()
            }
          })
        }
      })
    }
  },
  mounted () {}
}
</script>
<style lang="scss" scoped>
  .el-row{
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  .el-col{
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .user {
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    background-color: #D3DCE6;
  }
}
</style>

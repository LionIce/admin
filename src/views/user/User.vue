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
      v-loading="loading"
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
          <el-button size="medium" type="primary" icon="el-icon-edit" plain @click="showEditDialog(scope.row)"></el-button>
          <el-button size="medium" type="danger" icon="el-icon-delete" plain @click="showDelDialog(scope.row)"></el-button>
          <el-button size="medium" type="success" icon="el-icon-check" plain @click="showGrantDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top:10px;background:#D3DCE6;padding:10px" class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[1, 2, 3, 4, 5]"
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

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules='rules' ref="editUserForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit('editUserForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除提示对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>删除用户：{{delForm.username}}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUserSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="用户职位" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="grantForm.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="选择用户职位">
          <el-select v-model="roleId" :label-width="formLabelWidth" placeholder="请选择职位" clearable>
            <el-option
              v-for="(role,index) in roleList"
              :key="index"
              :label="role.roleName"
              :value="role.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUserSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {userList, changeUserState, addUser, editUser, getUserById, delUser, getRoleList, grantUserRole} from '@/api'
export default {
  data () {
    return {
      loading: true,
      userList: [],
      query: '',
      total: 0,
      pagesize: 3,
      pagenum: 1,
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      centerDialogVisible: false,
      grantDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      delForm: {
        id: 0,
        username: ''
      },
      grantForm: {},
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
      },
      roleList: {},
      roleId: '',
      value: '',
      label: ''
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
    showEditDialog (row) {
      getUserById(row.id).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.editDialogFormVisible = true
          this.editForm.username = res.data.username
          this.editForm.email = res.data.email
          this.editForm.mobile = res.data.mobile
          this.editForm.id = res.data.id
        } else {
          this.$message({
            message: '网络错误',
            center: true,
            type: 'wraning'
          })
        }
      })
    },
    showDelDialog (row) {
      this.centerDialogVisible = true
      this.delForm.id = row.id
      this.delForm.username = row.username
    },
    showGrantDialog (row) {
      console.log(row)
      this.grantDialogFormVisible = true
      // this.grantForm.username = row.username
      this.grantForm = row
      getRoleList().then(res => {
        if (res.meta.status === 200) {
          this.roleList = res.data
        }
      })
    },
    initList () {
      this.loading = true
      let params = {params: {query: this.query, pagenum: this.pagenum, pagesize: this.pagesize}}
      userList(params).then(res => {
        console.log(res)
        this.userList = res.data.users
        this.total = res.data.total
        this.loading = false
      })
    },
    addUserSubmit (formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          addUser(this.addForm).then(res => {
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
    },
    editUserSubmit (formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          editUser(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                message: res.meta.msg,
                type: 'success',
                center: true
              })
            }
            this.editDialogFormVisible = false
            this.initList()
          })
        } else {
          this.$message({
            message: '请填写完整信息',
            type: 'wraning',
            center: true
          })
        }
      })
    },
    delUserSubmit () {
      delUser(this.delForm.id).then(res => {
        console.log(res)
        if (res.meta.msg === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success',
            center: true
          })
        }
        this.centerDialogVisible = false
        this.initList()
      })
    },
    grantUserSubmit () {
      if (!this.roleId) {
        this.$message({
          type: 'warning',
          message: '角色信息不能为空'
        })
      } else {
        grantUserRole({rid: this.roleId, id: this.grantForm.id}).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              message: res.meta.msg,
              type: 'success',
              center: true
            })
          }
          this.grantDialogFormVisible = false
          this.placeholder = ''
          this.initList()
        })
      }
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
.el-dialog--center .el-dialog__body {
    text-align: center;
}
</style>

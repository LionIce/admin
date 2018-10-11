<template>
  <div class="roles">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>
    <el-button type="primary" plain>添加角色</el-button>

    <!-- 列表 -->
    <el-table
      border
      :data="roleList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="firstChildren in scope.row.children" :key="firstChildren.id" :gutter="20">
            <el-col :span="4">
              <el-tag
                closable
                type=""
                @close="deleteRight(scope.row, firstChildren.id)">
                {{firstChildren.authName}}
              </el-tag>
              <i class="el-icon-arrow-right" v-if="firstChildren.children.length !== 0"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="secondChildren in firstChildren.children" :key="secondChildren.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRight(scope.row, secondChildren.id)">
                    {{secondChildren.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right" v-if="secondChildren.children.length !== 0"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="threeChildren in secondChildren.children"
                    :key="threeChildren.id"
                    @close="deleteRight(scope.row, threeChildren.id)">
                    {{threeChildren.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">该角色没有分配权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="角色 ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" icon="el-icon-edit" plain @click="showEditDialog(scope.row)"></el-button>
          <el-button size="medium" type="danger" icon="el-icon-delete" plain @click="showDelDialog(scope.row)"></el-button>
          <el-button size="medium" type="success" icon="el-icon-check" plain @click="showDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
  </el-table>

  <!-- 权限修改对话框 -->
  <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
    <el-tree
      :data="data2"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"
      :props="defaultProps">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import {getRoleList, deleteRoleRight} from '@/api'
export default {
  data () {
    return {
      roleList: [],
      dialogFormVisible: false,
      data2: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    // getRoleList().then(res => {
    //   console.log(res)
    //   this.roleList = res.data
    // })
    this.initRoleList()
  },
  methods: {
    initRoleList () {
      getRoleList().then(res => {
        console.log(res)
        this.roleList = res.data
      })
    },
    deleteRight (row, rightId) {
      console.log(row, rightId)
      // let params = {params: {roleId: roleId, rightId: rightId}}
      deleteRoleRight({roleId: row.id, rightId: rightId}).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success',
            center: true
          })
          row.children = res.data
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'error',
            center: true
          })
        }
      })
    },
    showDialog () {
      this.dialogFormVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.roles{
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>

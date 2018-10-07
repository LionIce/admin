<template>
  <div class="login">
    <el-form :model="ruleForm" class="container" :rules="rules" ref="ruleForm">
      <el-form-item>
        <div class="avatar">
          <img src="../assets/logo.png">
        </div>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="用户名" prefix-icon="myicon myicon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="ruleForm.password" placeholder="密码" prefix-icon="myicon myicon-key" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="submitForm('ruleForm')">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {checkUser} from '@/api'
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          checkUser(this.ruleForm).then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
              // 设置token
              localStorage.setItem('mytoken', res.data.token)
              // 函数式路径编程
              this.$router.push({name: 'Home'})
            } else {
              // console.log('Login defeat')
              this.$message({
                type: 'error',
                message: res.meta.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>

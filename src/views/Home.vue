<template>
  <div class="home">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="auto">
        <div class="logo"></div>
         <el-menu
          :collapse="isCollapse"
          :router="true"
          :unique-opened="true"
          class="el-menu-admin"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu
            v-for='item in menuList'
            :key="item.id"
            :index='item.path'>
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="items.path" v-for="items in item.children" :key="items.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{items.authName}}</span>
            </el-menu-item>
          </el-submenu>
      </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <i class="myicon myicon-menu toggle-btn" @click="toggleCollapse"></i>
          <div class="system-title">管理系统</div>
          <div>
            <span class="welcome">您好，{{$store.getters.username}}</span>
            <el-button type="text" @click="logout">退出</el-button>
          </div>
        </el-header>
        <!-- 内容部分 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import {getUserList, leftMenuRight} from '@/api'
export default {
  data () {
    return {
      isCollapse: false,
      menuList: []
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    logout () {
      localStorage.removeItem('mytoken')
      this.$router.push('/login')
    }
  },
  created () {
    leftMenuRight().then(res => {
      // console.log(res)
      this.menuList = res.data
    })
  },
  mounted () {
    let params = {params: {query: '', pagenum: 1, pagesize: 1}}
    getUserList(params).then(res => {
      // console.log(res)
    })
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  background-color: #E5E5E5;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #009688;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: white;
  }
  .toggle-btn {
    padding: 0 10px;
    margin-left: -20px;
    font-size: 36px;
    line-height: 60px;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #00635a;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome, {
    color: white;
  }
  .el-menu {
    border: none;
  }
}
</style>

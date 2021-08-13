<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }" @click="setPath">home</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
      User management
  </el-card>
</template>

<script>
export default {
  name: "Users",
  setup() {
      // Methods
      function setPath(newActivePath){
          window.set
      }
  }
};
</script>

<style scoped>
</style>
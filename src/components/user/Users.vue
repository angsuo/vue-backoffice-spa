<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }" @click="setPath"
      >home</el-breadcrumb-item
    >
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!-- Search users & create user -->
    <el-row :gutter="20">
      <el-col :span="8"
        ><el-input
          placeholder="search user name"
          v-model="query"
          v-on:keypress.enter="searchUsers"
          ref="searchInputRef"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="searchUsers"></el-button>
          </template> </el-input
      ></el-col>
      <el-col :span="4"><el-button type="primary">Add User</el-button></el-col>
    </el-row>
    <!-- Users data table -->
    <el-table :data="userList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="Name"> </el-table-column>
      <el-table-column prop="email" label="Email"> </el-table-column>
      <el-table-column prop="mobile" label="Phone"> </el-table-column>
      <el-table-column prop="role_name" label="role"> </el-table-column>
      <el-table-column label="active">
        <template #default="scope">
          <el-switch v-model="scope.row.mg_state" @change="handleUserStateChanged(scope.row)"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Action" width="180px">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row.id)"
          ></el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="Edit user's role"
            placement="top"
            :enterable="false"
          >
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="handleRole(scope.row.id)"
          ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-model:currentPage="pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import { inject, onBeforeMount } from "@vue/runtime-core";
export default {
  name: "Users",
  setup() {
    // Variables
    const queryInfos = reactive({
      query: "",
      pagenum: 1,
      pagesize: 2,
    });
    const userData = reactive({
      userList: [],
      total: 0,
    });
    const $http = inject("axios");
    const $message = inject("message")

    // lifecycle hooks
    onBeforeMount(() => {
      searchUsers()
    });

    // Methods
    function setPath(newActivePath) {
      window.sessionStorage.setItem("activePath", newActivePath);
    }

    async function searchUsers() {
      // get users from API
      const { data: res } = await $http.get("users", { params: queryInfos });
      if (res.meta.status !== 200) return console.log("Could not get data");
      // log res.data
      console.log("Resp:", res.data)
      userData.userList = [...res.data.users];
      userData.total = res.data.total;
    }

    function handleEdit(id) {
      console.log("editing user of id:", id);
    }

    function handleDelete(id) {
      console.log("deleting user of id:", id);
    }

    function handleRole(id) {
      console.log("editing user of id:", id, "'s role");
    }
    
    function handleSizeChange(newSize){
        queryInfos.pagesize = newSize
        searchUsers()
    }

    function handleCurrentChange(newPage){
        queryInfos.pagenum = newPage
        searchUsers()
    }

    async function handleUserStateChanged(user){        
        const {data:resp} = await $http.put(`users/${user.id}/state/${user.mg_state}`)
        if(resp.meta.status !== 200) {
            user.mg_state = !user.mg_state
            return $message({type:"error", message: "couldn't change user's state"})}
        $message({type:"success", message: "Changed user's state"})
    }

    return {
      setPath,
      ...toRefs(queryInfos),
      searchUsers,
      ...toRefs(userData),
      handleEdit,
      handleDelete,
      handleRole,
      handleSizeChange,
      handleCurrentChange,
      handleUserStateChanged
    };
  },
  mounted() {
    this.$refs.searchInputRef.focus();
  },
};
</script>

<style scoped>
</style>
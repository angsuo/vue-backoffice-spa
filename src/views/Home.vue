<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-container">
        <img src="../assets/logo.jpg" alt="" width="60" height="60" />
        <span class="header-title">Homepage</span>
      </div>
      <el-button type="info" @click="logout" class="logout-button"
        >Log out</el-button
      ></el-header
    >
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-location"></i>
              <span>Navigator One</span>
            </template>
            <el-menu-item index="1-4-1"
              ><i class="el-icon-location"></i>
              <span>Index One</span></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import { inject } from "@vue/runtime-core";
import { useRouter } from "vue-router";
export default {
  name: "Home",
  setup() {
    // instantiate router
    const router = useRouter();

    // instantiate Element's Message
    const message = inject("message");

    // logout method
    function logout() {
      window.sessionStorage.removeItem("token");
      router.push("/login");
      message({ type: "info", message: "Disconnected" });
    }

    return {
      logout,
    };
  },
};
</script>

<style>
.el-header {
  background-color: #373d41;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-container {
  height: 100%;
  line-height: 60px;
  display: flex;
  align-items: center;
  font-family: sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.header-title {
  margin-left: 15px;
}

.logout-button {
  height: 40px;
}

.el-aside {
  background-color: #333744;
  color: #fff;
}

.el-main {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}
</style>
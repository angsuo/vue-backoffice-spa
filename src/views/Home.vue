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
      <el-aside :width="collapsed ? '64px' : '200px'">
        <!-- Collapse button -->
        <div class="collapsable-menu" @click="collapsed = !collapsed">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened='true'
          :collapse='collapsed'
          :collapse-transition='false'
          :default-active="activePath"
          router
        >
          <el-submenu v-for="m1 in menus" :key="m1.id" :index="m1.id + ''">
            <template #title>
              <i :class="'el-icon-'+icons[m1.id]"></i>
              <span>{{ m1.authName }}</span>
            </template>
            <el-menu-item
              v-for="m2 in m1.children"
              :key="m2.id"
              :index="'/' + m2.path"
              @click="savePathName('/' + m2.path)"
              ><i class="el-icon-menu"></i>
              <span>{{ m2.authName }}</span></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { inject, onBeforeMount, reactive, ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";
export default {
  name: "Home",
  setup() {
    // instantiate router
    const router = useRouter();
    // instantiate Element's Message
    const message = inject("message");
    // instantiate xhr engine
    const $http = inject("axios");
    // instantiate menu reactive object
    const menus = reactive([]);
    // instantiate menu icons from menu item's id
    const icons = {
      '125':'user-solid',
      '103': 'box',
      '101': 'shopping-bag-1',
      '102': 's-order',
      '145': 's-marketing'
    }
    // collapsed menu
    const collapsed = ref(false)
    // active path name
    const activePath = ref("welcome")

    onBeforeMount(async () => {
      const localMenus = JSON.parse(window.localStorage.getItem("menus"))
      // check if menus are stored in localStorage(only do it to limit redundant API calls)
      if(!window.localStorage.getItem("menus")){
        // get menu item's request
        const {
          data: {
            data,
            meta: { status },
          },
        } = await $http.get("menus");
        if (status !== 200) return logout();
        // store menus to local storage
        window.localStorage.setItem("menus", JSON.stringify(data))
        menus.push(...data);
      }else{
        menus.push(...localMenus)
      }
      // console.log("Menu items:", menus);
      
      // set active path
      activePath.value = window.sessionStorage.getItem("activePath")
    });

    // logout method
    function logout() {
      window.sessionStorage.removeItem("token");
      router.push("/login");
      message({ type: "info", message: "Disconnected" });
    }

    // save pathname to 
    function savePathName(pName){
      window.sessionStorage.setItem("activePath", pName)
      activePath.value = pName
    }

    return {
      logout,
      menus,
      icons,
      collapsed,
      savePathName,
      activePath
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

.collapsable-menu{
  background-color: #4a5064;
  color:#fff;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
  text-align: center;
}

.el-main {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}
</style>
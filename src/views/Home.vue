<template>
  <h1>Homepage</h1>
  <el-button type="info" @click="logout">Log out</el-button>
</template>

<script>
import { inject } from '@vue/runtime-core'
import {useRouter} from "vue-router"
export default {
    name: "Home",
    setup() {
      // instantiate router
      const router = useRouter()

      // instantiate Element's Message
      const message = inject("message")

      // logout method
      function logout(){
        window.sessionStorage.removeItem("token")
        router.push("/login")
        message({type:"info", message:"Disconnected"})
      }

      return {
        logout
      }
    }
}
</script>

<style>

</style>
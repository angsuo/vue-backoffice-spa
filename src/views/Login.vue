<template>
  <div class="container">
    <div class="login_card">
      <!-- Logo zone -->
      <div class="avatar">
        <img src="../assets/logo.jpg" alt="a cute fox" />
      </div>
      <!-- Form container -->
      <el-form 
        label-width="0"
        class="form-container"
        :model="form"
      >
        <!-- name input -->
        <el-form-item>
          <el-input prefix-icon="el-icon-user-solid" placeholder="username" v-model="form.username"></el-input>
        </el-form-item>
        <!-- password input -->
        <el-form-item>
          <el-input prefix-icon="el-icon-lock" placeholder="password" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <!-- buttons -->
        <el-form-item>
          <el-button type="primary">Login</el-button>
          <el-button type="info">Sign up</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
export default {
  name: "Login",
  setup() {
    const form = reactive({username:'', password:''})
    return {form}
  }
};
</script>


<style scoped>
.container {
  background-color: #2b4b6b;
  color: #fff;
  height: 100%;
}
/* remove vertical margin */
.login_card {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* avatar div */
.avatar {
  height: 130px;
  width: 130px;
  border: solid 1px #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.form-container {
  /* to align buttons in the center */
  text-align: right;
  position: absolute;
  bottom:0;
  width:100%;
  box-sizing: border-box;
  padding: 0 20px;
}
</style>
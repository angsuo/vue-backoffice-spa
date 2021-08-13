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
        :rules="rules"
        ref="formRef"
      >
        <!-- name input -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="username"
            v-model="form.username"
            ref="usernameInput"
            v-on:keypress.enter="validateUsername"
          ></el-input>
        </el-form-item>
        <!-- password input -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="password"
            type="password"
            v-model="form.password"
            v-on:keypress.enter="login"
            ref="pwdRef"
          ></el-input>
        </el-form-item>
        <!-- buttons -->
        <el-form-item>
          <el-button type="primary" @click="login">Login</el-button>
          <el-button type="info" @click="resetFields">Clear Fields</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { useRouter } from "vue-router";
export default {
  name: "Login",
  setup() {
    // inject axios for login http request
    const axios = inject("axios");
    // inject ElMessage from element-plus
    const message = inject("message");
    // instantiate router hook
    const router = useRouter();
    // form data model
    const form = reactive({ username: "admin", password: "123456" });
    // component refs
    const formRef = ref(null);
    const pwdRef = ref(null);

    // form verification rules
    const rules = {
      username: [
        {
          required: true,
          message: "Please enter an username",
          trigger: "blur",
        },
        {
          min: 3,
          max: 12,
          message: "Length should be between 3 and 12",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "please enter a password",
          trigger: "blur",
        },
        {
          min: 6,
          max: 20,
          message: "Password should be between 6 and 20 characters",
          trigger: "blur",
        },
      ],
    };

    // METHODS
    //    Reset fields
    function resetFields() {
      formRef.value.resetFields();
    }
    //    Login
    function login() {
      formRef.value.validate(async (valid) => {
        // before http request, check for valid form data
        if (!valid) return;

        // resp will be {...data:{}}
        const {
          data: {
            data,
            meta: { status },
          },
        } = await axios.post("login", form);

        if (status === 200) {
          // success message
          message({
            type: "success",
            message: "login success",
          });

          // store authentication token in session storage
          window.sessionStorage.setItem("token", data.token);

          // redirect to "/home"
          router.push("/home");
        } else {
          // show error message
          message({
            type: "error",
            message: "Invalid username and/or password",
          });
        }
      });
    }
    // focus password input
    function validateUsername() {
      if (!form.password) {
        // focus the password input
        pwdRef.value.focus();
      } else {
        // if already entered password, login
        login();
      }
    }

    return {
      form,
      rules,
      resetFields,
      formRef,
      login,
      validateUsername,
      pwdRef,
    };
  },
  mounted() {
    this.$refs.usernameInput.focus();
  },
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
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}
</style>
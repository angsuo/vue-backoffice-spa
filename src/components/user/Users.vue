<template>
  <!-- horizontal navigator -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }" @click="setPath"
      >home</el-breadcrumb-item
    >
    <el-breadcrumb-item>Manage users</el-breadcrumb-item>
    <el-breadcrumb-item>Users list</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- Users table container -->
  <el-card>
    <!-- Search users & create user -->
    <el-row :gutter="20">
      <el-col :span="8"
        ><el-input
          placeholder="search user name"
          v-model="query"
          v-on:keypress.enter="searchUsers"
          ref="searchInputRef"
          clearable
          @clear="searchUsers"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="searchUsers"></el-button>
          </template> </el-input
      ></el-col>
      <el-col :span="4"
        ><el-button type="primary" @click="showAddFormDialog = true"
          >Add User</el-button
        ></el-col
      >
    </el-row>
    <!-- Users data table -->
    <el-table :data="userList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="Name"> </el-table-column>
      <el-table-column prop="email" label="Email"> </el-table-column>
      <el-table-column prop="mobile" label="Phone"> </el-table-column>
      <el-table-column prop="role_name" label="Role"> </el-table-column>
      <el-table-column label="Active">
        <template #default="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="handleUserStateChanged(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Action" width="180px">
        <template #default="scope">
          <!-- edit user's email/phone -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditUserForm(scope.row)"
          ></el-button>
          <!-- delete user -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteUser(scope.row.id)"
          ></el-button>
          <!-- edit user's role -->
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
              @click="toggleRoleEditDialog(scope.row)"
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
      :total="total"
    >
    </el-pagination>
  </el-card>
  <!-- Add user dialog -->
  <el-dialog
    title="Add user"
    v-model="showAddFormDialog"
    width="50%"
    @close="resetAddForm"
  >
    <el-form
      :model="addFormInputs"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="90px"
    >
      <el-form-item label="Username" prop="username"
        ><el-input v-model="addFormInputs.username"></el-input
      ></el-form-item>
      <el-form-item label="Password" prop="password"
        ><el-input v-model="addFormInputs.password"></el-input
      ></el-form-item>
      <el-form-item label="Email" prop="email"
        ><el-input v-model="addFormInputs.email"></el-input
      ></el-form-item>
      <el-form-item label="Phone" prop="mobile"
        ><el-input v-model="addFormInputs.mobile"></el-input
      ></el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddFormDialog = false">Cancel</el-button>
        <el-button type="primary" @click="addUser">Add</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- Edit user dialog -->
  <el-dialog title="Edit user" v-model="showEditFormDialog" width="50%">
    <el-form
      :model="editFormInputs"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="90px"
    >
      <el-form-item label="Username" prop="username"
        ><el-input v-model="editFormInputs.username" disabled></el-input
      ></el-form-item>
      <el-form-item label="Email" prop="email"
        ><el-input v-model="editFormInputs.email"></el-input
      ></el-form-item>
      <el-form-item label="Phone" prop="mobile"
        ><el-input v-model="editFormInputs.mobile"></el-input
      ></el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showEditFormDialog = false">Cancel</el-button>
        <el-button type="primary" @click="editUser">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
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
    const $message = inject("message");
    const $confirm = inject("confirm");
    const addUserData = reactive({
      addFormRef: ref(null),
      addFormRules: {
        username: [
          {
            required: true,
            message: "Please enter a username",
            trigger: "blur",
          },
          {
            min: 3,
            max: 12,
            message: "Username should be between 3 and 12 chars.",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please create a password",
            trigger: "blur",
          },
          {
            min: 3,
            max: 12,
            message: "Password should be between 3 and 12 chars.",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Please enter email",
            trigger: "blur",
          },
          {
            validator: emailValidator,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "Please enter a valid mobile phone number",
            trigger: "blur",
          },
          {
            validator: phoneValidator,
            trigger: "blur",
          },
        ],
      },
      addFormInputs: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      showAddFormDialog: false,
    });
    const editUserData = reactive({
      editFormRef: ref(null),
      editFormRules: {
        email: [
          {
            required: true,
            message: "Please enter email",
            trigger: "blur",
          },
          {
            validator: emailValidator,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "Please enter a valid mobile phone number",
            trigger: "blur",
          },
          {
            validator: phoneValidator,
            trigger: "blur",
          },
        ],
      },
      editFormInputs: {
        username: "",
        email: "",
        mobile: "",
      },
      showEditFormDialog: false,
      editingUserId: null,
    });

    // lifecycle hooks
    onBeforeMount(() => {
      searchUsers();
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
      userData.userList = [...res.data.users];
      userData.total = res.data.total;
    }

    function handleSizeChange(newSize) {
      queryInfos.pagesize = newSize;
      searchUsers();
    }

    function handleCurrentChange(newPage) {
      queryInfos.pagenum = newPage;
      searchUsers();
    }

    async function handleUserStateChanged(user) {
      const { data: resp } = await $http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      if (resp.meta.status !== 200) {
        user.mg_state = !user.mg_state;
        return $message({
          type: "error",
          message: "couldn't change user's state",
        });
      }
      $message({ type: "success", message: "Changed user's state" });
    }

    function emailValidator(rule, value, next) {
      const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regEmail.test(value)) return next();
      next(new Error("Please enter a valid email."));
    }

    function phoneValidator(rule, value, next) {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) return next();
      next(new Error("Please enter a valid phone."));
    }

    function resetAddForm() {
      addUserData.addFormRef.resetFields();
    }

    function addUser() {
      addUserData.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // add user to db
        const { data: res } = await $http.post(
          "users",
          addUserData.addFormInputs
        );
        // check for error
        if (res.meta.status !== 201)
          return $message({ type: "error", message: res.meta.msg });
        // show status msg
        $message({ type: "success", message: "New user created!" });
        // reset form
        resetAddForm();
        // close dialog
        addUserData.showAddFormDialog = false;
        // search for users again
        searchUsers();
      });
    }

    function showEditUserForm(user) {
      // set editUserData's datas with passed value
      editUserData.editFormInputs.username = user.username;
      editUserData.editFormInputs.email = user.email;
      editUserData.editFormInputs.mobile = user.mobile;
      editUserData.editingUserId = user.id;
      editUserData.showEditFormDialog = true;
    }

    function editUser() {
      editUserData.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // call edit user infos' API
        const { data: res } = await $http.put(
          `users/${editUserData.editingUserId}`,
          {
            id: editUserData.editingUserId,
            email: editUserData.editFormInputs.email,
            mobile: editUserData.editFormInputs.mobile,
          }
        );
        // check for error
        if (res.meta.status !== 200)
          return $message({ type: "error", message: res.meta.msg });
        // show status msg
        $message({ type: "success", message: "User successfully edited" });
        // close dialog
        editUserData.showEditFormDialog = false;
        // call API to see changes
        searchUsers();
      });
    }

    async function deleteUser(userId) {
      const confirmDelete = await $confirm(
        "This will permanently delete the user. Continue?",
        "Delete this user?",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).catch((e) => e);

      if (confirmDelete !== "confirm")
        return $message({ type: "info", message: "Operation canceled." });

      // call the API to delete user
      const { data: res } = await $http.delete(`users/${userId}`, {
        id: userId,
      });
      if (res.meta.status !== 200)
        return $message({ type: "error", message: `Error: ${res.meta.msg}` });
      // re-fetch users
      searchUsers();
      // show deletion complete message
      $message({
        type: "warning",
        message: "Successfully deleted user",
      });
    }

    return {
      setPath,
      ...toRefs(queryInfos),
      searchUsers,
      ...toRefs(userData),
      handleSizeChange,
      handleCurrentChange,
      handleUserStateChanged,
      ...toRefs(addUserData),
      resetAddForm,
      addUser,
      ...toRefs(editUserData),
      showEditUserForm,
      editUser,
      deleteUser,
    };
  },
  mounted() {
    this.$refs.searchInputRef.focus();
  },
};
</script>

<style scoped>
</style>
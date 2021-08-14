<template>
  <!-- horizontal navigator -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }" @click="setPath"
      >home</el-breadcrumb-item
    >
    <el-breadcrumb-item>Permissions</el-breadcrumb-item>
    <el-breadcrumb-item>Roles</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- Roles card -->
  <el-card>
    <!-- Add role area -->
    <el-row>
      <el-col
        ><el-button type="primary" @click="showAddRoleForm = true"
          >Add Role</el-button
        ></el-col
      >
    </el-row>
    <!-- Roles table -->
    <el-table :data="roleList" border stripe>
      <el-table-column type="expand">
        <template #default="scope">
          <el-row
            :class="['bd-bot', i1 === 0 ? 'bd-top' : '']"
            v-for="(p1, i1) in scope.row.children"
            :key="p1.id"
          >
            <!-- level 1 permissions -->
            <el-col :span="5">
              <el-tag closable @close="console.log('closing')">{{
                p1.authName
              }}</el-tag>
                <caret-right style="width:1em; height:1em; margin-left:3px;" />
            </el-col>
            <!-- level 2 & 3 permissions -->
            <el-col :span="19">
              <!-- level 2 permissions -->
              <el-row :class="[i2 === 0 ? '': 'bd-top']" v-for="(p2, i2) in p1.children" :key="p2.id">
                <el-col :span="6">
                  <el-tag type="success" closable>{{p2.authName}}</el-tag>
                  <caret-right style="width:1em; height:1em; margin-left:3px;" />
                </el-col>
                <!-- level 3 permissions -->
                <el-col :span="18">
                  <el-tag type="warning" v-for="(p3) in p2.children" :key="p3.id" closable>{{p3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="roleName" label="Name"> </el-table-column>
      <el-table-column prop="roleDesc" label="Description"> </el-table-column>
      <el-table-column label="Action" width="180px">
        <template #default="scope">
          <!-- edit role's name/desc -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editRoleInfos(scope.row)"
          ></el-button>
          <!-- delete role -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteRole(scope.row.id)"
          ></el-button>
          <!-- edit role's permissions -->
          <el-tooltip
            class="item"
            effect="dark"
            content="Edit role's permissions"
            placement="top"
            :enterable="false"
            ><el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="editRolePermissions(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- [Dialog] Add role form -->
  <el-dialog title="New Role" v-model="showAddRoleForm" width="50%">
    <el-form
      :model="addRoleInputs"
      :rules="addRoleRules"
      ref="addRoleFormRef"
      label-width="90px"
    >
      <el-form-item label="Name" prop="roleName"
        ><el-input v-model="addRoleInputs.roleName"></el-input
      ></el-form-item>
      <el-form-item label="Description" prop="roleDesc"
        ><el-input v-model="addRoleInputs.roleDesc"></el-input
      ></el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddRoleForm = false">Cancel</el-button>
        <el-button type="primary" @click="addRole">Add</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- [Dialog] Edit role form -->
  <el-dialog title="Edit Role" v-model="showEditRoleForm" width="50%">
    <el-form
      :model="editRoleInputs"
      :rules="editRoleRules"
      ref="editRoleFormRef"
      label-width="90px"
    >
      <el-form-item label="Name" prop="roleName"
        ><el-input v-model="editRoleInputs.roleName"></el-input
      ></el-form-item>
      <el-form-item label="Description" prop="roleDesc"
        ><el-input v-model="editRoleInputs.roleDesc"></el-input
      ></el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddRoleForm = false">Cancel</el-button>
        <el-button type="primary" @click="editRole">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import { inject, onBeforeMount } from "@vue/runtime-core";
import {CaretRight} from "@element-plus/icons"
export default {
  name: "Roles",
  components:{CaretRight},
  setup() {
    // Data
    const thisData = reactive({
      roleList: [],
    });
    const addRoleData = reactive({
      addRoleFormRef: ref(null),
      showAddRoleForm: false,
      addRoleInputs: {
        roleName: "",
        roleDesc: "",
      },
      addRoleRules: {
        roleName: [
          { required: true, message: "Please enter a name", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "Role's name should be between 3-10 chars.",
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "Please enter a role description",
            trigger: "blur",
          },
          { min: 3, max: 10, message: "Role's desc. between 3-10 chars" },
        ],
      },
    });
    const editRoleData = reactive({
      editRoleFormRef: ref(null),
      showEditRoleForm: false,
      editRoleInputs: {
        id: null,
        roleName: "",
        roleDesc: "",
      },
      editRoleRules: {
        roleName: [
          { required: true, message: "Please enter a name", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "Role's name should be between 3-10 chars.",
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "Please enter a role description",
            trigger: "blur",
          },
          { min: 3, max: 10, message: "Role's desc. between 3-10 chars" },
        ],
      },
    });
    // Injectables
    const $http = inject("axios");
    const $message = inject("message");
    const $confirm = inject("confirm");

    // fetch for role list
    onBeforeMount(() => fetchRoles());

    async function fetchRoles() {
      const { data: res } = await $http.get("roles");
      if (res.meta.status !== 200)
        return $message({ type: "error", message: `Error: ${res.meta.msg}` });
      thisData.roleList = res.data;
    }

    function editRoleInfos(role) {
      // set edit role inputs to the role's
      editRoleData.editRoleInputs.id = role.id;
      editRoleData.editRoleInputs.roleName = role.roleName;
      editRoleData.editRoleInputs.roleDesc = role.roleDesc;
      // toggle edit role's form (dialog)
      editRoleData.showEditRoleForm = true;
    }

    async function deleteRole(id) {
      console.log("Delete role with id:", id);
      const confirmDelete = await $confirm(
        "This will permanently delete the role. Continue?",
        "Delete this role?",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).catch((e) => e);

      if (confirmDelete !== "confirm")
        return $message({ type: "info", message: "Operation canceled." });

      // call the API to delete user
      const { data: res } = await $http.delete(`roles/${id}`, {
        id,
      });
      if (res.meta.status !== 200)
        return $message({ type: "error", message: `Error: ${res.meta.msg}` });
      // re-fetch roles
      fetchRoles();
      // show deletion complete message
      $message({
        type: "warning",
        message: "Successfully deleted role!",
      });
    }

    function editRolePermissions(role) {
      console.log("Editing permissions of", role);
    }

    function addRole() {
      // validate form
      addRoleData.addRoleFormRef.validate(async (isValid) => {
        if (!isValid) return;
        console.log("Adding role:", addRoleData.addRoleInputs.roleName);
        const { data: res } = await $http.post("roles", {
          roleName: addRoleData.addRoleInputs.roleName,
          roleDesc: addRoleData.addRoleInputs.roleDesc,
        });
        if (res.meta.status !== 201)
          return $message({ type: "error", message: `Error: ${res.meta.msg}` });
        // fetch updated roles
        fetchRoles();
        // message new role created
        $message({ type: "success", message: "New Role created" });
        // close dialog
        addRoleData.showAddRoleForm = false;
      });
    }

    function editRole() {
      // validate form
      editRoleData.editRoleFormRef.validate(async (isValid) => {
        if (!isValid) return;
        console.log("Sync. role:", editRoleData.editRoleInputs.roleName);
        const { data: res } = await $http.put(
          `roles/${editRoleData.editRoleInputs.id}`,
          {
            id: editRoleData.editRoleInputs.id,
            roleName: editRoleData.editRoleInputs.roleName,
            roleDesc: editRoleData.editRoleInputs.roleDesc,
          }
        );
        if (res.meta.status !== 200)
          return $message({ type: "error", message: `Error: ${res.meta.msg}` });
        // fetch updated roles
        fetchRoles();
        // message new role created
        $message({ type: "success", message: "Role successfully edited!" });
        // close dialog
        editRoleData.showEditRoleForm = false;
      });
    }

    return {
      ...toRefs(thisData),
      editRoleInfos,
      deleteRole,
      editRolePermissions,
      ...toRefs(addRoleData),
      ...toRefs(editRoleData),
      addRole,
      editRole,
    };
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bot {
  border-bottom: 1px solid #eee;
}
</style>
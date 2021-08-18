<template>
  <!-- horizontal navigator -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }"
      >home</el-breadcrumb-item
    >
    <el-breadcrumb-item>Permissions</el-breadcrumb-item>
    <el-breadcrumb-item>Rights</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- Rights table -->
  <el-card>
    <el-table :data="rightList" border stripe style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="authName" label="Right"> </el-table-column>
      <el-table-column prop="path" label="Path"> </el-table-column>
      <el-table-column prop="level" label="Right level">
          <template #default="scope">
              <el-tag v-if="scope.row.level === '0'">Level 1</el-tag>
                <el-tag v-else-if="scope.row.level === '1'" type="success">Level 2</el-tag>
                <el-tag v-else type="warning">Level 3</el-tag>
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import { inject, onBeforeMount } from "@vue/runtime-core";
export default {
  name: "Rights",
  setup() {
    // Datas
    const thisData = reactive({
      rightList: [],
    });
    // Injectables
    const $http = inject("axios");
    const $message = inject("message");

    // fetch for rightList before mount
    onBeforeMount(async () => {
      const { data: res } = await $http.get("rights/list", { type: "list" });
      if (res.meta.status !== 200)
        return $message({ type: "error", message: res.meta.msg });
      // res.data = [{id: 101, authName: "商品管理", level: "0", pid: 0, path: "goods"}, {..}, ...]
      thisData.rightList = [...res.data];
    });

    function getTagType(lvl){
        let typeStr = ""
        switch (lvl) {
            case "1":
                typeStr = "success"
                break;
            case "2":
                typeStr = "warning"
                break
            default:
                break;
        }
        return typeStr;
    }

    return {
      ...toRefs(thisData),
      getTagType
    };
  },
};
</script>

<style>
</style>
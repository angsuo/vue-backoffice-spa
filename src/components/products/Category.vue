<template>
  <!-- Breadcrumbs for navigation -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">homepage</el-breadcrumb-item>
    <el-breadcrumb-item>Products management</el-breadcrumb-item>
    <el-breadcrumb-item>Categories</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- card -->
  <el-card>
    <!-- add category button area (row) -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="openAddCategoryDialog"
          >Add category</el-button
        >
      </el-col>
    </el-row>
    <!-- Categories table -->
    <el-table :data="categoryList" row-key="cat_id" border stripe>
      <!-- Index column -->
      <el-table-column type="index" label="#" />
      <!-- Category name column -->
      <el-table-column label="Name" prop="cat_name" />
      <!-- Category is active indicator -->
      <el-table-column label="Active">
        <!-- Set template for the column -->
        <template #default="scope">
          <!-- Green check icon if cat_deleted is false -->
          <CircleCheckFilled
            v-if="scope.row.cat_deleted === false"
            style="width: 18px; height: 18px; color: green"
          />
          <!-- Red close icon if cat_deleted is true -->
          <CircleCloseFilled
            v-if="scope.row.cat_deleted === true"
            style="width: 18px; height: 18px; color: red"
          />
        </template>
      </el-table-column>
      <!-- Category's depth indicator -->
      <el-table-column label="Depth">
        <template #default="slot">
          <!-- if the value is 0: level 1 -->
          <el-tag v-if="slot.row.cat_level === 0">1</el-tag>
          <!-- if the value is 0: level 2 -->
          <el-tag v-else-if="slot.row.cat_level === 1" type="success">2</el-tag>
          <!-- else: level 3 -->
          <el-tag v-else type="warning">3</el-tag>
        </template>
      </el-table-column>
      <!-- Edit/delete column -->
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button
            class="el-icon-edit"
            @click="console.log('Editing', scope.row)"
            size="mini"
            type="primary"
            >Edit</el-button
          >
          <el-button
            class="el-icon-delete"
            @click="console.log('Deleting', scope.row)"
            size="mini"
            type="danger"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <el-pagination
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      v-model:currentPage="pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCategories"
    >
    </el-pagination>
  </el-card>
  <!-- Add Category Dialog -->
  <el-dialog title="New Category" v-model="showAddCategoryDialog" width="50%" @close="clearAddCategoryFields">
    <el-form
      ref="addCategoryFormRef"
      :model="addCategoryInput"
      :rules="addCategoryFormRules"
    >
      <el-form-item label="Category Name:" prop="cat_name">
        <el-input v-model="addCategoryInput.cat_name" />
      </el-form-item>
      <el-form-item label="Category Parent:">
        <el-cascader
          v-model="addCategoryDepthSelect"
          :options="categoryParents"
          :props="{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
            checkStrictly:true
          }"
          @change="handleSelectCategoryDepth"
          clearable
          ref="parentCategoryCascaderRef"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddCategoryDialog = false">Cancel</el-button>
        <el-button type="primary" @click="addCategory">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- Edit Category Dialog -->
  <!-- Delete Category Dialog -->
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import { inject, onBeforeMount } from "@vue/runtime-core";
import { CircleCheckFilled, CircleCloseFilled } from "@element-plus/icons";
import dummyCategories from "../../assets/data/dummyCategories.json";
export default {
  name: "Category",
  components: { CircleCloseFilled, CircleCheckFilled },
  setup() {
    const categoryTableData = reactive({
      categoryList: [],
      pagesize: 5,
      pagenum: 1,
    });
    const totalCategories = ref(0);
    const addCategoryData = reactive({
      addCategoryInput: {
        // Parent category's cat_id, default to 0
        cat_pid: 0,
        cat_name: "",
        // depth of category (0-2), default to 0
        cat_level: 0,
      },
      addCategoryFormRules: {
        cat_name: [
          {
            required: true,
            message: "Please enter a category name",
            trigger: "blur",
          },
        ],
      },
      showAddCategoryDialog: false,
      addCategoryFormRef: ref(null),
      addCategoryDepthSelect: [],
      categoryParents: [],
      parentCategoryCascaderRef:ref(null)
    });
    // injectables
    const $message = inject("message");
    const $http = inject("axios");

    // Lifecycle hooks
    onBeforeMount(async () => {
      await fetchCategories();
    });

    // fetch API for categories
    /* async function fetchCategories() {
      // call to API endpoint : GET 'categories'
      const { data: res } = await $http.get("categories", {
        pagesize: categoryTableData.pagesize,
        pagenum: categoryTableData.pagenum,
      });
      // response checker
      if (res.meta.status !== 200)
        return $message.error(`Error: ${res.meta.msg}`);
      categoryTableData.categoryList = res.data;
      totalCategories.value = res.data.length;
      console.log("Categories:", categoryTableData.categoryList);
    } */

    // fetch dummyData method
    async function fetchCategories() {
      categoryTableData.categoryList = dummyCategories.data.slice(
        (categoryTableData.pagenum - 1) * categoryTableData.pagesize,
        categoryTableData.pagenum * categoryTableData.pagesize
      );
      totalCategories.value = dummyCategories.data.length;
    }

    // onPageSizeChange handler
    function handlePageSizeChange(newSize) {
      categoryTableData.pagesize = newSize;
      fetchCategories();
    }

    // onChangePageNum handler
    function handleCurrentPageChange(newPageNum) {
      categoryTableData.pagenum = newPageNum;
      fetchCategories();
    }

    // add new category
    async function addCategory() {
      // validate form
      addCategoryData.addCategoryFormRef.validate(async (valid) => {
        console.log("New category:", addCategoryData.addCategoryInput);
        if (!valid) return;
        // do things
      });
    }

    async function openAddCategoryDialog() {
      // fetch the API endpoint for fresh categories lvl 1 & 2
      const { data: res } = await $http.get("categories", {
        params: { type: [2] },
      });
      if (res.meta.status !== 200)
        return $message.error(`Error: ${res.meta.msg}`);
      // populate the category options
      addCategoryData.categoryParents = res.data;
      // show dialog
      addCategoryData.showAddCategoryDialog = true;
    }

    // when a new category's parent is selected (new Category)
    function handleSelectCategoryDepth(){
      // when cleared, the data will be null
      if(!addCategoryData.addCategoryDepthSelect) return;
      // the ElCascader component's selection will be an array of values
      // [lvl1_id, lvl2_id]
      // So, the new category's depth will be the array's length
      addCategoryData.addCategoryInput.cat_level = addCategoryData.addCategoryDepthSelect.length
      // And the parent's id will be the array's last item(if length > 0)
      if(addCategoryData.addCategoryDepthSelect.length){
        addCategoryData.addCategoryInput.cat_pid = addCategoryData.addCategoryDepthSelect[addCategoryData.addCategoryDepthSelect.length - 1]
      }
    }

    // clear add category's dialog's form fields
    function clearAddCategoryFields(){
      addCategoryData.addCategoryFormRef.resetFields()
      addCategoryData.addCategoryDepthSelect = []
      addCategoryData.addCategoryInput.cat_level=0
      addCategoryData.addCategoryInput.cat_pid = 0
    }

    return {
      ...toRefs(categoryTableData),
      totalCategories,
      handlePageSizeChange,
      handleCurrentPageChange,
      ...toRefs(addCategoryData),
      addCategory,
      openAddCategoryDialog,
      handleSelectCategoryDepth,
      clearAddCategoryFields
    };
  },
};
</script>

<style scoped>
</style>
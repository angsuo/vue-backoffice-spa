<template>
  <!-- Breadcrumbs navigation -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">homepage</el-breadcrumb-item>
    <el-breadcrumb-item>Products management</el-breadcrumb-item>
    <el-breadcrumb-item>Product parameters</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- Card -->
  <el-card>
    <!-- Alert area -->
    <el-alert
      class="mv15"
      show-icon
      title="Params apply to only 3rd lvl depths"
      type="warning"
      :closable="false"
    />
    <!-- Category selection area -->
    <el-row>
      <el-col>
        <span>Select product category: </span>
        <el-cascader
          v-model="categoryCascaderSelection"
          :options="allCategories"
          :props="{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
          }"
          @change="handleSelectCategory"
          clearable
          ref="parentCategoryCascaderRef"
        />
      </el-col>
    </el-row>
    <!-- Tab area -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="Dynamic Properties" name="many">
        <!-- Dynamic properties content area -->
        <el-button
          type="primary"
          :disabled="btnIsDisabled"
          @click="addDialogVisible = true"
          >Add new Property</el-button
        >
        <!-- Dynamic properties data table -->
        <el-table
          :data="dynamicTabData"
          border
          stripe
          @expand-change="handleExpand"
          row-key="attr_id"
          :expand-row-keys="expandedRowKeys"
        >
          <!-- Expanded tags column -->
          <el-table-column type="expand">
            <template #default="scope">
              <!-- List of attributes' values -->
              <el-tag
                v-for="(attr, attrIndex) in scope.row.attr_vals"
                :key="attrIndex"
                closable
                @close="deleteAttrVal(attr, scope.row)"
                >{{ attr }}</el-tag
              >
              <!-- Add tag button/input -->
              <el-input
                class="w120"
                v-if="scope.row.addValueInputVisible"
                v-model="scope.row.newAttrValInput"
                ref="newAttributeValInputRef"
                size="mini"
                @keyup.enter="newAttrValInputHandler(scope.row)"
                @blur="newAttrValInputBlur(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                size="small"
                @click="addAttributeValue(scope.row)"
                >+ New {{ tabTitle }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="Name" prop="attr_name"></el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditParamDialog(scope.row)"
                size="small"
                >Edit</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteAttribute(scope.row)"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- Static characteristics' panel -->
      <el-tab-pane label="Static Characteristics" name="only">
        <!-- Static characteristics area -->
        <el-button
          type="primary"
          :disabled="btnIsDisabled"
          @click="addDialogVisible = true"
          >Add new Characteristic</el-button
        >
        <!-- Static characteristics data table -->
        <el-table :data="staticTabData" border stripe>
          <el-table-column type="expand">
            <template #default="scope">
              <!-- List of attributes' values -->
              <el-tag
                v-for="(attr, attrIndex) in scope.row.attr_vals"
                :key="attrIndex"
                closable
                @close="deleteAttrVal(attr, scope.row)"
                >{{ attr }}</el-tag
              >
              <!-- Add tag button/input -->
              <el-input
                class="w120"
                v-if="scope.row.addValueInputVisible"
                v-model="scope.row.newAttrValInput"
                ref="newAttributeValInputRef"
                size="mini"
                @keyup.enter="newAttrValInputHandler(scope.row)"
                @blur="newAttrValInputBlur(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                size="small"
                @click="addAttributeValue(scope.row)"
                >+ New {{ tabTitle }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="Name" prop="attr_name"></el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditParamDialog(scope.row)"
                size="small"
                >Edit</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteAttribute(scope.row)"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <!-- Add Dialog -->
  <el-dialog
    :title="'Add ' + tabTitle"
    v-model="addDialogVisible"
    width="50%"
    @close="clearAddForm"
  >
    <!-- Form with single input for param name -->
    <el-form ref="addFormRef" :model="addFormInput" :rules="addFormRules">
      <el-form-item :label="tabTitle + '\'s name'">
        <el-input v-model="addFormInput.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addParam">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- Edit Param dialog -->
  <el-dialog
    :title="'Edit ' + tabTitle"
    v-model="editDialogVisible"
    width="50%"
    @close="clearEditForm"
  >
    <!-- Form with single input for param name -->
    <el-form ref="editFormRef" :model="editFormInput" :rules="editFormRules">
      <el-form-item :label="tabTitle + '\'s name'">
        <el-input v-model="editFormInput.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editParam">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  computed,
  inject,
  nextTick,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
} from "@vue/runtime-core";
export default {
  name: "CategoryParams",
  setup() {
    // Inject
    const $http = inject("axios");
    const $message = inject("message");
    const $confirm = inject("confirm");
    // Reactive datas
    const categoriesData = reactive({
      allCategories: [],
      categoryCascaderSelection: [],
      activeTab: "many",
      staticTabData: [],
      dynamicTabData: [],
      expandedRowKeys: [],
    });
    const addParamData = reactive({
      addDialogVisible: false,
      addFormInput: {
        attr_name: "",
        attr_sel: categoriesData.activeTab,
      },
      addFormRef: ref(null),
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "Please enter a name",
            trigger: "blur",
          },
        ],
      },
    });
    const editParamData = reactive({
      editDialogVisible: false,
      editFormInput: {
        attr_name: "",
        attr_sel: categoriesData.activeTab,
      },
      editFormRef: ref(null),
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "Please enter a name",
            trigger: "blur",
          },
        ],
      },
      editingAttrId: 0,
    });
    // Computed
    const btnIsDisabled = computed(
      () =>
        !(
          Array.isArray(categoriesData.categoryCascaderSelection) &&
          categoriesData.categoryCascaderSelection.length > 1
        )
    );
    const selectedCatId = computed(() => {
      if (Array.isArray(categoriesData.categoryCascaderSelection)) {
        return categoriesData.categoryCascaderSelection[2];
      }
      return 0;
    });
    const tabTitle = computed(() => {
      if (categoriesData.activeTab === "many") {
        return "dynamic property";
      }
      return "static attribute";
    });
    const newAttributeValInputRef = ref(null);

    onBeforeMount(() => {
      fetchAllCategories();
    });

    async function fetchAllCategories() {
      // endpoint simple GET request
      const { data: res } = await $http.get("categories");
      if (res.meta.status !== 200)
        return $message.error(`Error:${res.meta.msg}`);
      // populate component's data for the Cascader element
      categoriesData.allCategories = res.data;
    }

    function handleSelectCategory() {
      fetchCategoryAttributes();
    }

    function handleTabClick() {
      fetchCategoryAttributes();
    }

    async function fetchCategoryAttributes() {
      const { data: res } = await $http.get(
        `categories/${selectedCatId.value}/attributes`,
        { params: { sel: [categoriesData.activeTab] } }
      );
      if (res.meta.status !== 200) return $message(`Error: ${res.meta.msg}`);
      // change each attribute's values from csv string to array
      res.data.forEach((attr) => {
        // based on the current active tab, populate the correct tab's data
        // Transform attribute's csv into an array
        attr.attr_vals = attr.attr_vals.length ? attr.attr_vals.split(",") : [];
        // add an input visible's state
        if (!attr.addValueInputVisible) {
          attr.addValueInputVisible = false;
        }
        // add a new value input
        attr.newAttrValInput = "";
      });
      if (categoriesData.activeTab === "only") {
        // 'only' is for static characteristics
        categoriesData.staticTabData = res.data;
        console.log(
          "Static characteristics' data:",
          categoriesData.staticTabData
        );
      } else {
        categoriesData.dynamicTabData = res.data;
        console.log("Dynamic params:", categoriesData.dynamicTabData);
      }
    }

    function addParam() {
      // validate form
      addParamData.addFormRef.validate(async (isValid) => {
        // stop here if form isn't valid
        if (!isValid) return;
        // Post to endpoint API
        const { data: res } = await $http.post(
          `categories/${selectedCatId.value}/attributes`,
          addParamData.addFormInput
        );
        if (res.meta.status !== 201)
          return $message.error(`Error: ${res.meta.msg}`);
        // refresh categories data
        fetchCategoryAttributes();
        // show added message
        $message.success("Successfully added new param");
        // close dialog
        addParamData.addDialogVisible = false;
      });
    }

    async function clearAddForm() {
      addParamData.addFormRef.resetFields();
    }

    function newAttrValInputBlur(attribute) {
      attribute.newAttrValInput = "";
      attribute.addValueInputVisible = false;
    }

    async function newAttrValInputHandler(attribute) {
      // trim the input newAttrValInput
      const newAttr = attribute.newAttrValInput.trim();
      // if the input is empty, just hide the input addValueInputVisible
      if (!newAttr) {
        attribute.addValueInputVisible = false;
        return;
      }
      // if there is any value, add new attribute val to endpoint
      // get the attr_vals array
      let attrArr = [...attribute.attr_vals];
      //    Add new value to the string
      attrArr.push(newAttr);
      //    Get csv value of the attribute's values' list
      let attr_vals = attrArr.join(",");
      //    Then, call the API endpoint 'categories/:id/attributes/:attrId'
      const { data: res } = await $http.put(
        `categories/${selectedCatId.value}/attributes/${attribute.attr_id}`,
        {
          attr_name: attribute.attr_name,
          attr_sel: categoriesData.activeTab,
          attr_vals,
        }
      );
      // verify status
      if (res.meta.status !== 200)
        return $message.error(`Error: ${res.meta.msg}`);
      // successfully updated the attribute's values
      //    re-fetch the attributes
      fetchCategoryAttributes();
      //    Show a success message
      $message.success("Successfully added new category attribute!");
    }

    async function deleteAttrVal(attrValName, attribute) {
      // Get the updated attr_vals csv (from array)
      const attr_vals = attribute.attr_vals
        .filter((v) => v !== attrValName)
        .join(",");
      // update to the endpoint
      const { data: res } = await $http.put(
        `categories/${selectedCatId.value}/attributes/${attribute.attr_id}`,
        {
          attr_name: attribute.attr_name,
          attr_sel: categoriesData.activeTab,
          attr_vals,
        }
      );
      // verify status
      if (res.meta.status !== 200)
        return $message.error(`Error: ${res.meta.msg}`);
      // successfully updated the attribute's values
      //    re-fetch the attributes
      fetchCategoryAttributes();
      //    Show a success message
      $message.info("Deleted category's attribute.");
    }

    function handleExpand(rowChanged, expandedRows) {
      // determine if row collapsed or expanded
      if (expandedRows.findIndex((r) => r === rowChanged) !== -1) {
        // the rowChanged is expanded
        // add new row's id(attr_id)
        categoriesData.expandedRowKeys.push(rowChanged.attr_id);
      } else {
        // the rowChanged is collapsed
        categoriesData.expandedRowKeys = categoriesData.expandedRowKeys.filter(
          (id) => id !== rowChanged.attr_id
        );
      }
    }

    function addAttributeValue(attribute) {
      attribute.addValueInputVisible = true;
      // TODO! focus the input box on next tick
      nextTick(() => {
        newAttributeValInputRef.value.focus();
      });
    }

    function showEditParamDialog(attribute) {
      // store the attribute's ID
      editParamData.editingAttrId = attribute.attr_id;
      // populate the input value
      editParamData.editFormInput.attr_name = attribute.attr_name;
      // set dialog visible
      editParamData.editDialogVisible = true;
    }

    function editParam() {
      // verify dialog's input is valid
      editParamData.editFormRef.validate(async (isValid) => {
        if (!isValid) return;
        // call API to edit
        const { data: res } = await $http.put(
          `categories/${selectedCatId.value}/attributes/${editParamData.editingAttrId}`,
          { ...editParamData.editFormInput }
        );
        if (res.meta.status !== 200)
          return $message.error(`Error: ${res.meta.msg}`);
        // re-fetch data
        fetchCategoryAttributes();
        // show edit sucess message
        $message.success("Successfully edited attribute's name");
        // close dialog
        editParamData.editDialogVisible = false;
      });
    }

    async function deleteAttribute(attribute) {
      const goDelete = await $confirm(
        "This will permanently delete the attribute. Continue?",
        "Delete this attribute?",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).catch((e) => e);
      // verify if confirmed
      if (goDelete !== "confirm")
        return $message.info("Attribute's deletion canceled");
      // call API endpoint to delete
      const { data: res } = await $http.delete(
        `categories/${selectedCatId.value}/attributes/${attribute.attr_id}`
      );
      // verify if deleted
      if (res.meta.status !== 200)
        return $message.error(`Error: ${res.meta.msg}`);
      // re-fetch attributed
      fetchCategoryAttributes();
      // $message for deletion successful
      $message.success("Attribute successfully deleted.");
    }
    return {
      ...toRefs(categoriesData),
      handleSelectCategory,
      handleTabClick,
      btnIsDisabled,
      tabTitle,
      ...toRefs(addParamData),
      addParam,
      clearAddForm,
      newAttrValInputHandler,
      newAttrValInputBlur,
      deleteAttrVal,
      handleExpand,
      addAttributeValue,
      newAttributeValInputRef,
      ...toRefs(editParamData),
      showEditParamDialog,
      editParam,
      deleteAttribute,
    };
  },
};
</script>

<style scoped>
.mv15 {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.w120 {
  width: 160px;
}
</style>
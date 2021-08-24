<template>
  <!-- horizontal navigator -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">home</el-breadcrumb-item>
    <el-breadcrumb-item>Products management</el-breadcrumb-item>
    <el-breadcrumb-item>Add product</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- Card area -->
  <el-card>
    <!-- Alert area -->
    <el-alert title="Add product" type="info" show-icon :closable="false" />
    <!-- Steps indicator -->
    <el-steps :active="currentStep" finish-status="success" align-center>
      <el-step title="Basic infos"></el-step>
      <el-step title="Product params"></el-step>
      <el-step title="Product properties"></el-step>
      <el-step title="Photos"></el-step>
      <el-step title="Description"></el-step>
      <el-step title="Validation"></el-step>
    </el-steps>
    <!-- Big add product's form -->
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-position="top"
    >
      <!-- left navigation tabs -->
      <el-tabs
        tab-position="left"
        v-model="activeTab"
        :before-leave="handleChangeTab"
      >
        <!-- Basic infos part -->
        <el-tab-pane label="Basic infos" name="0">
          <!-- Product name -->
          <el-form-item label="Name" prop="goods_name">
            <el-input
              v-model="addForm.goods_name"
              ref="productNameInputRef"
            ></el-input>
          </el-form-item>
          <!-- Product price -->
          <el-form-item label="Price" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <!-- Product weight -->
          <el-form-item label="Weight" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <!-- Product quantity -->
          <el-form-item label="Quantity" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <!-- Product category -->
          <el-form-item label="Category" prop="goods_cat">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="categoriesList"
              :props="{
                expandTrigger: 'hover',
                label: 'cat_name',
                value: 'cat_id',
              }"
              @change="handleCategorySelect"
            />
          </el-form-item>
        </el-tab-pane>
        <!-- Product's dynamic parameters checklist -->
        <el-tab-pane label="Params" name="1">
          <!-- Loop through each attribute -->
          <el-form-item
            v-for="(dynAttr, i) in categorysManyAttributes"
            :key="i"
            :label="dynAttr.attr_name"
          >
            <el-checkbox-group
              v-model="checkedManys[dynAttr.attr_id + '']"
              size="small"
              @change="handleCheckboxChange"
            >
              <el-checkbox
                v-for="(dynAttrVal, i2) in dynAttr.attr_vals"
                :key="i2"
                :label="dynAttrVal"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <!-- Product's static properties -->
        <el-tab-pane label="Properties" name="2">
          <!-- Loop through each only Attributes -->
          <el-form-item
            v-for="(attr, i) in categorysOnlyAttributes"
            :key="i"
            :label="attr.attr_name"
          >
            <el-input v-model="attr.attr_vals"></el-input>
          </el-form-item>
          <!-- Display an input  -->
        </el-tab-pane>
        <!-- Product's pictures -->
        <el-tab-pane label="Photos" name="3">
          <!-- Upload file component -->
          <el-upload
            :action="uploadUrl"
            :on-preview="handlePicPreview"
            :on-remove="handlePicRemove"
            :on-success="handlePicUploaded"
            list-type="picture"
            :headers="headers"
          >
            <el-button size="small" type="primary">Click to upload</el-button>
          </el-upload>
        </el-tab-pane>
        <!-- Product's rich description -->
        <el-tab-pane label="Description" name="4">
          <!-- Editor -->
          <Quill theme="snow" v-model:content="addForm.goods_introduce" content-type="html" />
          <!-- Submit form button -->
          <el-button type="primary" @click="submitProduct">Add new Product</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  <!-- Dialog for previewing picture -->
  <el-dialog
    :title="previewingPic.name"
    v-model="previewPicVisible"
    width="50%"
  >
    <img :src="previewingPic.response.data.url" :alt="previewingPic.name" class="preview-pic">
  </el-dialog>
</template>

<script>
import { computed, reactive, ref, toRefs } from "@vue/reactivity";
import { inject, onBeforeMount, onMounted } from "@vue/runtime-core";
import { useRouter } from 'vue-router';
export default {
  name: "AddProduct",
  setup() {
    // Injectables
    const $http = inject("axios");
    const $message = inject("message");
    const router = useRouter()
    // Component Data
    const componentData = reactive({
      // Tab name must be a string
      activeTab: "0",
      addForm: {
        goods_name: "",
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cat: [],
        pics: [],
        attrs: [],
        goods_introduce: ""
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "Please enter a name",
            trigger: "blur",
          },
        ],
      },
      addFormRef: ref(null),
      categoriesList: [],
      productNameInputRef: ref(null),
      categorysOnlyAttributes: [],
      categorysManyAttributes: [],
      checkedManys: {},
      needFetchAttributes: false,
      uploadUrl: "http://timemeetyou.com:8889/api/private/v1/upload",
      headers: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewingPic: {},
      previewPicVisible: false,
    });
    // Computed data
    const currentStep = computed(() => componentData.activeTab - 0);

    // Lifecycle hooks
    //    Before mount: populate categories array
    onBeforeMount(async () => {
      // fetch categories
      const { data: res } = await $http.get("categories");
      if (res.meta.status !== 200)
        return $message.error(`Error: ${res.meta.msg}`);
      // populate the categories' list for cascader
      componentData.categoriesList = res.data;
    });
    //    Mounted: focus the name input
    onMounted(() => {
      componentData.productNameInputRef.focus();
    });

    // Methods
    //      Change tab handler
    function handleChangeTab(to, from) {
      // typeof to && from: string

      // Prevent accessing other tabs without indicating category
      if (from === "0") {
        // verify that the category is selected
        if (componentData.addForm.goods_cat.length !== 3) {
          // display error message
          $message.error(`Please select a category`);
          // Return false for preventing change
          return false;
        } else {
          // if needed
          if (componentData.needFetchAttributes) {
            // fetch selected category's static(only) and dynamic(many) attributes
            fetchCategorysAttributes();
          }
        }
      }
    }
    //      Category selection handler
    function handleCategorySelect(selected) {
      // verify if selected 3rd level category
      // if not, clear selection
      // console.log("same:", selected === componentData.addForm.goods_cat) // true
      if (selected.length !== 3) {
        $message.warning("Please select only 3rd level deep category.");
        componentData.addForm.goods_cat = [];
      } else {
        // check if is waiting to re-fetch attributes
        // if yes do nothing
        if (!componentData.needFetchAttributes) {
          // if not:
          // reset previous category's only & many data
          componentData.categorysOnlyAttributes = [];
          componentData.categorysManyAttributes = [];
          // reset previous attributes selections
          componentData.checkedManys = {};
          // set need to re-fetch the attributes
          componentData.needFetchAttributes = true;
        }
      }
    }
    //      Fetch category's only/many attributes
    async function fetchCategorysAttributes() {
      // get the selected category's id
      const selectedCatId = componentData.addForm.goods_cat[2];
      // API call for static attributes
      const { data: res } = await $http.get(
        `categories/${selectedCatId}/attributes`,
        { params: { sel: "only" } }
      );
      // if error, return an empty array
      if (res.meta.status !== 200) {
        return $message.error(`Error getting only: ${res.meta.msg}`);
      }
      // console.log("Only:", res.data);
      // populate the category's static attributes array
      componentData.categorysOnlyAttributes = res.data;
      // API call for dynamic attributes
      const { data: res2 } = await $http.get(
        `categories/${selectedCatId}/attributes`,
        { params: { sel: "many" } }
      );
      // if error, return an empty array
      if (res2.meta.status !== 200) {
        return $message.error(`Error getting many: ${res2.meta.msg}`);
      }
      // loop through each category's attribute
      res2.data.forEach((dynAttr) => {
        // add empty array to componentData.checkedManys
        componentData.checkedManys[dynAttr.attr_id + ''] = []
        dynAttr.attr_vals = dynAttr.attr_vals.split(",");
      });
      // console.log("Many:", res2.data);
      // populate the category's dynamic attributes array
      componentData.categorysManyAttributes = res2.data;

      // finally, set the needFetch to false
      componentData.needFetchAttributes = false;
    }
    //      On dynamic params change
    function handleCheckboxChange() {
      // console.log("componentData.checkedManys:", componentData.checkedManys);
    }
    //      Picture preview handler
    function handlePicPreview(file) {
      console.log("Previewing pic:", file)
      // Get the picture's full URL
      componentData.previewingPic = file;
      componentData.previewPicVisible = true;
    }

    //      Picture remove handler
    function handlePicRemove(file) {
      // console.log("Removing pic:", file)
      // get the picture's position in thee pics array
      const position = componentData.addForm.pics.findIndex(
        (p) => p.pic === file.response.data.tmp_path
      );
      // filter out the componentData.addForm.pics array
      componentData.addForm.pics.splice(position, 1);
    }

    //      Picture uploaded hook
    function handlePicUploaded(res) {
      // check if upload failed
      if (res.meta.status !== 200)
        return $message.error(`Error uploading: ${res.meta.msg}`);
      // display picture uploaded message
      $message.success("Picture successfully uploaded")
      // save the filepath
      componentData.addForm.pics.push({ pic: res.data.tmp_path });
    }

    //      Submit new product to database
    async function submitProduct(){
      // verify form
      componentData.addFormRef.validate(async isValid => {
        // if form is invalid, stop operation here
        if(!isValid) return
        const toPost = {...componentData.addForm}
        // data changes: attributes & cate
        //    1. change category from array to csv string
        toPost.goods_cat = toPost.goods_cat.join(",")
        //    2. load static & dynamic attributes' values
        //      2.1 for static(only) attributes
        //        loop through attributes from categorysOnlyAttributes
        componentData.categorysOnlyAttributes.forEach(attr => {
          // add value to toPost.attr with {attr_id, attr_value}
          toPost.attrs.push({attr_id: attr.attr_id, attr_value:attr.attr_vals})
        })
        //      2.2 for dynamic(many) attributes
        //        loop through the checked attributes object
        for(const property in componentData.checkedManys){
          // property: attr_id
          // componentData.checkedManys[property]: array of values
          const attrValArr = [...componentData.checkedManys[property]]
          //  if the array isn't emtpy
          if(attrValArr.length){
            //  transform array into csv string
            const attrValCsv = attrValArr.join(',')
            // push in the toPost.attrs
            toPost.attrs.push({attr_id: property - 0, attr_value:attrValCsv})
          }
        }
        // submit to endpoint API
        const {data: res} = await $http.post("goods", toPost)
        // if error display error message, stop operation here
        if(res.meta.status !== 201) return $message.error(`Error: ${res.meta.msg}`)
        // if success, display success message
        $message.success("Successfully created new product")
        // go to product list page
        router.push("/goods")
      })
    }
    return {
      ...toRefs(componentData),
      currentStep,
      handleChangeTab,
      handleCategorySelect,
      handleCheckboxChange,
      handlePicPreview,
      handlePicRemove,
      handlePicUploaded, 
      submitProduct
    };
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 0 0 0 10px;
}
.preview-pic{
  width:100%;
}
</style>
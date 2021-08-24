<template>
  <!-- horizontal navigator -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">home</el-breadcrumb-item>
    <el-breadcrumb-item>Products management</el-breadcrumb-item>
    <el-breadcrumb-item>Products list</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- Card area -->
  <el-card>
    <!-- Search product & Add product's row -->
    <el-row :gutter="20">
      <!-- Search product span -->
      <el-col :span="8">
        <!-- Search product's input area with search icon -->
        <el-input
          placeholder="Search a product"
          v-model="searchProductInput"
          class="input-with-search"
          ref="searchProductInputRef"
          @keypress.enter="fetchProducts"
          clearable
          @clear="fetchProducts"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="fetchProducts"></el-button>
          </template>
        </el-input>
      </el-col>
      <!-- Add product button -->
      <el-col :span="4">
        <el-button type="primary" @click="addProduct">Add Product</el-button>
      </el-col>
    </el-row>
    <!-- Product list table -->
    <el-table :data="productList" border stripe>
      <!-- index column -->
      <el-table-column type="index" label="#"></el-table-column>
      <!-- Product name column  -->
      <el-table-column label="Product name" prop="goods_name"></el-table-column>
      <!-- Product price column -->
      <el-table-column
        label="Price"
        prop="goods_price"
        width="95px"
      ></el-table-column>
      <!-- Product weight column -->
      <el-table-column
        label="Weight"
        prop="goods_weight"
        width="70px"
      ></el-table-column>
      <!-- Product's date column -->
      <el-table-column
        label="date"
        width="140px"
      >
        <template #default="scope">
            {{getDate(scope.row.add_time)}}
        </template>
      </el-table-column>
      <!-- Edit / Delete product column -->
      <el-table-column label="Action" width="130px">
        <template #default="scope">
          <!-- Edit button -->
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="console.log('Editing:', scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
            @click="handleDeleteProduct(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <el-pagination
      @size-change="fetchProducts"
      @current-change="fetchProducts"
      v-model:currentPage="pagenum"
      :page-sizes="[10, 20, 50, 100]"
      v-model:page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalProducts"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import { inject, onBeforeMount, onMounted } from "@vue/runtime-core";
import { useRouter } from 'vue-router';
export default {
  name: "List",
  setup() {
    // injections
    const $http = inject("axios");
    const $message = inject("message");
    const $confirm = inject("confirm")
      const router = useRouter()
    //   Reactive data
    const queryParams = reactive({
      pagenum: 1,
      pagesize: 10,
    });
    const productListData = reactive({
      searchProductInput: "",
      searchProductInputRef: ref(null),
      productList: [],
      totalProducts: 0,
    });

    // lifecycle hooks
    //      Before component mount, fetch products
    onBeforeMount(() => {
      fetchProducts();
    });
    //      When component mounted, focus the search product's input
    onMounted(() => {
      productListData.searchProductInputRef.focus();
    });

    // methods
    //      Fetch products from API endpoint
    async function fetchProducts() {
      const { data: res } = await $http.get("goods", {
        params: { query: productListData.searchProductInput, ...queryParams },
      });
      // display error message on fetch errors
      if (res.meta.status !== 200)
        return $message.error(`Error fetching products: ${res.meta.msg}`);
      // populate returned product list
      productListData.productList = res.data.goods;
      // keep track of total products number
      productListData.totalProducts = res.data.total;
    }
    //      Convert timestamp into date string
    function getDate(timestamp) {
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      let date = new Date(timestamp * 1000);
      // Year part from the timestamp
      let year = date.getFullYear().toString().slice(-2)
      // Month part
      let month = (date.getMonth() + 1).toString().padStart(2,"0")
      // Day part
      let day = date.getDate().toString().padStart(2,"0")
      // Hours part from the timestamp
      let hours = date.getHours().toString().padStart(2,"0");
      // Minutes part from the timestamp
      let minutes = date.getMinutes().toString().padStart(2,"0");
      // Seconds part from the timestamp
      let seconds = date.getSeconds().toString().padStart(2,"0");

      // Will display time in 10:30:23 format
      let formattedTime = `[${day}/${month}/${year}] ${hours}:${minutes}:${seconds}`

      return formattedTime
    }
    //      delete a product by id
    async function handleDeleteProduct(id){
        // wait for confirmation
        const confirmDelete = await $confirm(
        "This will permanently delete the product. Continue?",
        "Delete this product?",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).catch((e) => e);
        // if not confirmed, display a cancel message
        if(confirmDelete !== "confirm") return $message.info("Deletion cancelled")
        // send DELETE request to API endpoint
        const {data:res} = await $http.delete(`goods/${id}`)
        // verify if successfully deleted, if not display error message
        if(res.meta.status !== 200) return $message.error(`Error: ${res.meta.msg}`)
        // re-fetch products list
        fetchProducts()
        // display success message
        $message.success("Product successfully deleted.")
    }

    function addProduct(){
      router.push('/goods/add')
    }
    return {
      ...toRefs(productListData),
      ...toRefs(queryParams),
      getDate,
      fetchProducts,
      handleDeleteProduct,
      addProduct
    };
  },
};
</script>

<style scoped>
</style>
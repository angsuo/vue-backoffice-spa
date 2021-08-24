<template>
  <!-- horizontal navigator -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">home</el-breadcrumb-item>
    <el-breadcrumb-item>Orders management</el-breadcrumb-item>
    <el-breadcrumb-item>Orders list</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!-- Search orders input area -->
    <el-row>
      <el-col :span="8">
        <el-input
          placeholder="Search order..."
          v-model="queryParams.query"
          ref="searchRef"
        >
          <template #append>
            <el-button icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- order table area -->
    <el-table :data="ordersList" border stripe>
      <!-- Index column -->
      <el-table-column type="index" label="#"></el-table-column>
      <!-- Order number column -->
      <el-table-column
        label="Order number"
        prop="order_number"
      ></el-table-column>
      <!-- Order total column -->
      <el-table-column
        label="Total amount"
        prop="order_price"
      ></el-table-column>
      <!-- Order paid column -->
      <el-table-column label="Paid" prop="order_pay">
          <template #default="scope">
              <el-tag v-if="scope.row.order_pay === '1'" type="success">Paid</el-tag>
              <el-tag v-else type="danger">Unpaid</el-tag>
          </template>
      </el-table-column>
      <!-- Order sent column -->
      <el-table-column label="Sent" prop="is_send"></el-table-column>
      <!-- Order datetime -->
      <el-table-column label="Order time">
          <template #default="scope">
              {{getDate(scope.row.create_time)}}
          </template>
      </el-table-column>
      <!-- Order actions -->
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="addressFormVisible = true"
          ></el-button>
          <el-button
            icon="el-icon-location"
            type="success"
            size="mini"
            @click="showTrackOrder(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table pagination area -->
    <el-pagination
      @size-change="fetchOrders"
      @current-change="fetchOrders"
      v-model:currentPage="queryParams.pagenum"
      :page-sizes="[10, 30, 50, 100]"
      v-model:page-size="queryParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalOrders">
    </el-pagination>
  </el-card>
  <!-- Address Dialog -->
  <el-dialog
  title="Order's address"
  v-model="addressFormVisible"
  width="50%"
  @close="clearAddressForm">
    <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="120px">
  <el-form-item label="City:" prop="city">
    <!-- City selection cascader -->
    <el-cascader :options="cityData" v-model="addressForm.city"></el-cascader>
  </el-form-item>
  <el-form-item label="Address:" prop="address">
      <!-- Address input -->
    <el-input v-model="addressForm.address"></el-input>
  </el-form-item>
    </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="addressFormVisible = false">Cancel</el-button>
      <el-button type="primary" @click="addressFormVisible = false">Confirm</el-button>
    </span>
  </template>
</el-dialog>
<!-- Track order dialog -->
  <el-dialog
  title="Order tracking"
  v-model="trackOrderVisible"
  width="50%">
    <el-timeline>
    <el-timeline-item
      v-for="(status, index) in orderStatus"
      :key="index"
      :timestamp="status.time">
      {{status.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import { inject, onBeforeMount, onMounted } from "@vue/runtime-core";
import cityData from "./citydata"
export default {
  name: "Order",
  setup() {
    // Injectables
    const $http = inject("axios");
    const $message = inject("message");
    // reactive datas
    const componentData = reactive({
      queryParams: {
        query: "",
        pagesize: 10,
        pagenum: 1,
      },
      searchRef: ref(null),
      totalOrders: 0,
      ordersList: [],
      cityData,
    });
    const address = reactive({
        addressForm:{
            city:[],
            address:''
        },
        addressFormRules:{
            city:[
                {required:true, message: "Please choose a city", trigger: 'blur'}
            ],
            address: [
                {required: true, message: "Please enter the address", trigger: 'blur'}
            ]
        },
        addressFormRef: ref(null),
        addressFormVisible: false
    })
    const tracking = reactive({
      trackOrderVisible:false,
      orderStatus:[]
    })

    // lifecycle hooks
    //    Before component mount, fetch the orders from API
    onBeforeMount(() => {
      fetchOrders();
    });
    //    When component mounted, focus the search input
    onMounted(() => {
      componentData.searchRef.focus();
    });

    // Component methods
    //    Fetch orders
    async function fetchOrders() {
      // make GET request to endpoints with params
      const { data: res } = await $http.get("orders", {
        params: componentData.queryParams,
      });
      // if error display error message
      if (res.meta.status !== 200)
        return $message.error(`Error fetching: ${res.meta.msg}`);
      // populate the orders array
      componentData.ordersList = res.data.goods;
      // set the total orders count
      componentData.totalOrders = res.data.total;
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
    //      Clear address dialog's form
    function clearAddressForm(){
        address.addressFormRef.resetFields()
    }
    //      Show trackOrder dialog
    function showTrackOrder(order){
      console.log("Tracking order:", order)
      // fetch order's state (API broken)
      // save dummy data in tracking.orderStatus
      tracking.orderStatus = [
    {
      "time": "2018-05-10 09:39:00",
      "ftime": "2018-05-10 09:39:00",
      "context": "已签收,感谢使用顺丰,期待再次为您服务",
      "location": ""
    },
    {
      "time": "2018-05-10 08:23:00",
      "ftime": "2018-05-10 08:23:00",
      "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
      "location": ""
    },
    {
      "time": "2018-05-10 07:32:00",
      "ftime": "2018-05-10 07:32:00",
      "context": "快件到达 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-10 02:03:00",
      "ftime": "2018-05-10 02:03:00",
      "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-09 23:05:00",
      "ftime": "2018-05-09 23:05:00",
      "context": "快件到达 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 21:21:00",
      "ftime": "2018-05-09 21:21:00",
      "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 13:07:00",
      "ftime": "2018-05-09 13:07:00",
      "context": "顺丰速运 已收取快件",
      "location": ""
    },
    {
      "time": "2018-05-09 12:25:03",
      "ftime": "2018-05-09 12:25:03",
      "context": "卖家发货",
      "location": ""
    },
    {
      "time": "2018-05-09 12:22:24",
      "ftime": "2018-05-09 12:22:24",
      "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
      "location": ""
    },
    {
      "time": "2018-05-08 21:36:04",
      "ftime": "2018-05-08 21:36:04",
      "context": "商品已经下单",
      "location": ""
    }
  ]
      // show Dialog
      tracking.trackOrderVisible = true
    }
    return {
      ...toRefs(componentData),
      getDate,
      fetchOrders,
      ...toRefs(address),
      clearAddressForm,
      showTrackOrder,
      ...toRefs(tracking)
    };
  },
};
</script>

<style>
</style>
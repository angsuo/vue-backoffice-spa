<template>
  <!-- horizontal navigator -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">home</el-breadcrumb-item>
    <el-breadcrumb-item>Analytics</el-breadcrumb-item>
    <el-breadcrumb-item>Users location report</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <div style="width: 750px; height: 400px" ref="chartRef"></div>
  </el-card>
</template>

<script>
// 1. import echarts
import * as echarts from "echarts";
import { inject, onMounted, ref } from "@vue/runtime-core";
export default {
  name: "Report",
  setup() {
      // injectables
      const $http = inject("axios")
      const $message=inject("message")
    // component datas
    const chartRef = ref(null);

    // lifecycle hooks
    //      When component mounted, get the element
    onMounted(async () => {
      // initialize echarts
      const myChart = echarts.init(chartRef.value);

        // API call for getting charts data
        const {data:res} = await $http.get("reports/type/1")
        if(res.meta.status !== 200) return $message.error(`Error: ${res.meta.msg}`)
        console.log("res.data:", res.data)
      // merge res.data with given dummy options
      const option = {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      };

      // load options to echarts element
      myChart.setOption({ ...option, ...res.data});
    });
    return {
      chartRef,
    };
  },
};
</script>

<style>
</style>
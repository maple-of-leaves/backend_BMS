<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import { Statistics } from "../../network/API";
import _ from "lodash";
export default {
  components: {},
  data() {
    return {
      result: {},
      options: {
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
      },
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {},
  created() {},
  mounted() {
    
    var myChart = echarts.init(document.getElementById("main"));

    Statistics().then((res) => {

      console.log(res.data);
      this.result = _.merge(res.data, this.options);

      myChart.setOption(this.result);
    });

    // 使用刚指定的配置项和数据显示图表。
  },
};
</script>
<style  scoped>
.box-card {
  margin: 20px 0;
}
</style>
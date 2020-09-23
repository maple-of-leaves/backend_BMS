<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table stripe :data="list" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限名称">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>

            <el-tag type="success" v-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
  </div>
</template>

<script>
import { rights } from "../../network/API";
export default {
  components: {},
  data() {
    return {
      list: [],
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    getrights() {
      rights()
        .then((res) => {
          this.list = res.data;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getrights();
  },
  mounted() {},
};
</script>
<style  scoped>
.box-card {
  margin-top: 20px;
}
</style>
<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodslist">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="gotoAdd">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsListData" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加对话框 -->

    <!-- <el-dialog title="添加用户" :visible.sync="addDialog" width="50%" @close="addDilogClosed">
      <el-form :model="addform" :rules="rules" ref="Editform" label-width="100px">
        <el-form-item :label="titlestr" prop="attr_name">
          <el-input v-model="addform.goods_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { getGoods, AddGoods, Deletegoods } from "../../network/API";
export default {
  components: {},
  data() {
    return {
      total:0,
      goodsListData: [],
      addDialog: false,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      content: "",

      addform: {
        goods_name: "",
      },
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {

    addDilogClosed() {},

    gotoAdd(){
        this.$router.push("/goods/add")
    },

    search() {
      this.getGoodslist();
    },
    // 删除商品

    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Deletegoods(id).then((res) => {
            if (res.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodslist();
      console.log(newsize);
    },
    // 当前页吗
    handleCurrentChange(newsize) {
      this.queryInfo.pagenum = newsize;
      this.getGoodslist();
    },

    getGoodslist() {
      getGoods(this.queryInfo).then((res) => {

        this.total=res.data.total
        this.goodsListData = res.data.goods;

        console.log(res);
      });
    },
  },
  created() {
    this.getGoodslist();
  },
  mounted() {},
};
</script>
<style scoped>
.box-card {
  margin: 20px 0;
}
</style>
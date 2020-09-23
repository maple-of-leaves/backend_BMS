<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="input3">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="goodsData" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="address" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status=='1'">已付款</el-tag>
            <el-tag type="danger" v-if="scope.row.pay_status=='0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="创建时间">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div style="display:flex">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="addDialogcomponent=true"
              ></el-button>
              <el-button type="success" icon="el-icon-location" size="mini" @click="checkkuaidi"></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 4, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址 -->

    <el-dialog title="修改地址" :visible.sync="addDialogcomponent">
      <el-form :model="formaddress" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="省市区/县" prop="address">
          <el-cascader :options="citydata"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="formaddress.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogcomponent = false">取 消</el-button>
        <el-button type="primary" @click="addDialogcomponent = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看物流信息 -->

    <el-dialog title="物流进度" :visible.sync="addDialogcomponent">
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogcomponent = false">取 消</el-button>
        <el-button type="primary" @click="addDialogcomponent = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetOrderlist, checkStream } from "../../network/API";
import cityData from "../../assets/js/city_data2017_element";
export default {
  components: {},
  data() {
    return {
      total: "",
      goodsData: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      addDialogcomponent: false,
      formaddress: {
        address: "",
      },
      rules: {
        address1: [{ message: "请选择省市区县", trigger: "blur" }],
        address2: [{ message: "请选择省市区县", trigger: "blur" }],
      },
      citydata: cityData,
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    checkkuaidi() {
      let id = "1106975712662";
      this.addDialogcomponent = true;
      checkStream(id)
        .then((res) => {
          if (res.meta.status == 200) {
            this.$message({
              message: "获取物流信息成功",
              type: "success",
            });
          }
        })
        .catch((err) => {});
    },
    getorderlist() {
      GetOrderlist(this.queryInfo)
        .then((res) => {
          this.total = res.data.total;
          this.goodsData = res.data.goods;
          console.log(res);
        })
        .catch((err) => {});
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getorderlist();
    },
    handleCurrentChange(newsize) {
      this.queryInfo.pagenum = newsize;
      this.getorderlist();
    },
  },
  created() {
    this.getorderlist();
  },
  mounted() {},
};
</script>
<style scoped>
.box-card {
  margin: 20px 0;
}
</style>
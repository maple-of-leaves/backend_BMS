<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert show-icon title="注意：只允许为三级分类设置参数" type="warning" :closable="false"></el-alert>
      <el-row>
        <el-col>
          选择商品分类:
          <el-cascader
            expand-trigger="hover"
            v-model="setcatelist"
            :options="options"
            :props="proplist"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isbtn" @click="adddialog=true">添加参数</el-button>

          <el-table :data="ManyData" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag>{{scope.row.attr_vals}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>

            <el-table-column label="参数名称" prop="attr_name"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="Editparams(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="del(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isbtn" @click="adddialog=true">添加属性</el-button>
          <el-table :data="OnlyData" border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>

            <el-table-column label="属性" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="Editparams(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="del(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数或者静态属性 -->
    <el-dialog
      :title="' 添加'+titlestr"
      :visible.sync="adddialog"
      width="50%"
      @close="addDilogClosed"
    >
      <el-form :model="addform" :rules="rules" ref="addform" label-width="100px">
        <el-form-item :label="titlestr" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialog = false">取 消</el-button>
        <el-button type="primary" @click="Addparams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+titlestr"
      :visible.sync="editdialog"
      width="50%"
      @close="addDilogClosed"
    >
      <el-form :model="Editform" :rules="rules" ref="Editform" label-width="100px">
        <el-form-item :label="titlestr" prop="attr_name">
          <el-input v-model="Editform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Categories,
  GetCateList,
  AddCateList,
  Findparams,
  Editparams,
  Deleteparams,
} from "../../network/API";
export default {
  components: {},
  data() {
    return {
      // 静态属性
      OnlyData: [],
      // 动态参数
      ManyData: [],
      tagval: [],
      activeName: "many",

      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 12,
      },

      proplist: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 块级选择框
      options: [],
      setcatelist: [],
      adddialog: false,
      // 修改对话框
      editdialog: false,

      addform: {
        attr_name: "",
      },
      rules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      Editform: {
        attr_name: "",
        attr_id: "",
      },
    };
  },
  computed: {
    isbtn() {
      if (this.setcatelist.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    cateId() {
      if (this.setcatelist.length == 3) {
        return this.setcatelist[2];
      } else {
        return null;
      }
    },
    titlestr() {
      if (this.activeName == "many") {
        return " 动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  watch: {},
  //方法集合
  methods: {
    //添加对话框关闭事件
    addDilogClosed() {
      this.$refs.addform.resetFields();
      this.$refs.Editform.resetFields();
    },

    handleChange() {
      this.getparamslist();
    },
    handleClick() {
      this.getparamslist();
    },
    // 获取参数列表
    getparamslist() {
      if (this.setcatelist.length !== 3) {
        this.setcatelist = [];
        return;
      }

      let info = {
        id: this.cateId,
        activeName: this.activeName,
      };

      GetCateList(info).then((res) => {
        this.OnlyData = res.data;

        this.ManyData = res.data;

        let tags = res.data;

        console.log(this.OnlyData);
      });
    },
    // 添加参数
    Addparams() {
      this.adddialog = false;

      let info = {
        id: this.cateId,
        attr_name: this.addform.attr_name,
        attr_sel: this.activeName,
      };

      AddCateList(info).then((res) => {
        if (res.meta.status == 201) {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },

    // 删除参数

    del(info) {
      this.$confirm("确认删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Deleteparams({ id: this.cateId, attrId: info.attr_id }).then(
            (res) => {
              if (res.meta.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑参数
    Editparams(info) {
      this.editdialog = !this.editdialog;

      // 根据id查询参数
      let infomsg = {
        id: this.cateId,
        attrId: info.attr_id,
        attr_sel: this.activeName,
      };

      Findparams(infomsg).then((res) => {
        this.Editform.attr_name = res.data.attr_name;

        this.Editform.attr_id = res.data.attr_id;
      });
    },
    confirmEdit() {
      this.editdialog = false;
      let info = {
        id: this.cateId,
        attrId: this.Editform.attr_id,
        attr_name: this.Editform.attr_name,
        attr_sel: this.activeName,
      };

      Editparams(info).then((res) => {
        console.log(res);
        if (res.meta.status == 200) {
          this.$message({
            showClose: true,
            message: "更新成功",
            type: "success",
          });
        }
      });
    },
    // 获取页面数据
    getCate() {
      Categories(this.queryInfo).then((res) => {
        this.options = res.data.result;
      });
    },
  },

  created() {
    this.getCate();
  },
  mounted() {},
};
</script>
<style scoped>
</style>
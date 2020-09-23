<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        :columns="columns"
        :data="CateList"
        :expand-type="false"
        :selection-type="false"
        show-index
        index-test="#"
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="iseffect" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:green"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level==2">三级</el-tag>
        </template>
        <template slot="action" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editparams(scope.row.cat_id)"
          >编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialog" @close="addDialogClose">
      <el-form :model="addform" :rules="rules" ref="addform">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addform.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类">
          <el-cascader
            clearable
            v-model="selkeys"
            :options="parentCatelist"
            expand-trigger="hover"
            :props="cateparamsprops"
            @change="handleChangeprops"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="AddGoodsParams ">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改分类名称" :visible.sync="addDialog" @close="addDialogClose">
      <el-form :model="obj" :rules="rules" ref="obj">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="obj.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Categories,
  AddgoodsParams,
  Editgoodsparams,
  CheckgoodsParams,
  Deletegoodsparams
} from "../../network/API";
export default {
  components: {},
  data() {
    return {
      total: 0,
      CateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 4,
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "iseffect",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },

        {
          label: "操作",
          type: "template",
          template: "action",
        },
      ],
      addDialog: false,
      addform: {
        cat_name: "a",
        cat_pid: 0,
        cat_level: 0,
      },
      rules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
      // 选中的参数
      selkeys: [],
      parentCatelist: [],
      cateparamsprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      obj: {
        cat_id: "",
        cat_name: "",
      },
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    // 点击出现确认添加对话框
    addCate() {
      this.addDialog = true;
      this.queryInfo.type = 2;
      this.getCategories();
    },

    // 确认添加

    AddGoodsParams() {
      console.log(this.selkeys);
      this.addDialog = false;

      console.log(this.addform);

      AddgoodsParams(this.addform)
        .then((res) => {
          if (res.meta.status == 201) {
            this.$message({
              type: "success",
              message: "创建成功!",
            });
          }
        })
        .catch((err) => {});
    },
    addDialogClose() {
      this.$refs.addform.resetFields();
      this.addform.cat_level = 0;
      this.addform.cat_pid = 0;
      this.selkeys = [];
    },

    // 编辑参数
    editparams(id) {
      this.addDialog = true;

      CheckgoodsParams(id).then((res) => {
        if (res.meta.status == 200) {
          this.$message({
            type: "success",
            message: "查询成功",
          });

          this.obj.cat_name = res.data.cat_name;
          this.obj.cat_id = res.data.cat_id;
        }
      });
    },
    // 确认修改

    confirmEdit() {
      this.addDialog = false;

      Editgoodsparams(this.obj).then((res) => {
        if (res.meta.status == 200) {
          this.$message({
            type: "success",
            message: "更新成功",
          });
        }
      });
    },
    handleChangeprops() {
      if (this.selkeys.length > 0) {
        this.addform.cat_pid = this.selkeys[this.selkeys.length - 1];
        this.addform.cat_level = this.selkeys.length;

        return;
      } else {
        this.addform.cat_pid = 0;
        this.addform.cat_level = 0;
      }
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCategories();
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;

      this.getCategories();
    },

    getCategories() {
      Categories(this.queryInfo).then((res) => {
        this.total = res.data.total;
        this.CateList = res.data.result;

        this.parentCatelist = res.data.result;

        console.log(this.parentCatelist);
      });
    },
  },
  created() {
    this.getCategories();
  },
};
</script>
<style  scoped>
</style>
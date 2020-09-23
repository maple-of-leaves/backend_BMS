<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addform" ref="addformRef" :rules="rules" label-position="top">
        <el-tabs
          @tab-click="sel"
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeleave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addform.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addform.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addform.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input  v-model="addform.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addform.goods_cat"
                :options="catelist"
                :props="cateProps"
                expand-trigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item) in goodsparams" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals" size="mini">
                <el-checkbox border :label="check" v-for="check in item.attr_vals" :key="check"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="(item) in goodsprops" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :headers="headereobj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button type="primary" @click="upload">点击上传</el-button>

              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor :content="addform.goods_introduce"></quill-editor>

            <el-button type="primary" class="margin:20px 0" @click="addgoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="previewdialog" width="50%">
      <div>
        <img :src="previewpath" alt width="100%" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewdialog = false">取 消</el-button>
        <el-button type="primary" @click="previewdialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Categories,
  GetCateList,
  uploadPicture,
  AddGoods,
} from "../../network/API";
import _ from "lodash";
export default {
  components: {},
  data() {
    return {
      tabPosition: "left",
      activeIndex: "0",
      // 动态参数

      manyData: [],
      // 静态属性
      onlyData: [],
      addform: {
        goods_name: "",
        // 级联选择器绑定的数据
        goods_cat: [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: {},
        attrs: [],
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
      },

      queryInfo: {
        pagenum: 1,
        pagesize: 10,
      },
      catelist: [],
      // 分类属性
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 商品参数
      goodsparams: [],
      // 商品属性
      goodsprops: [],
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 上传的请求头
      headereobj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewpath: "",
      previewdialog: false,
    };
  },
  computed: {
    cateId() {
      if (this.addform.goods_cat.length == 3) {
        return this.addform.goods_cat[2];
      } else {
        return null;
      }
    },
  },
  watch: {},
  //方法集合
  methods: {
    sel() {
      if (this.activeIndex == "1") {
        GetCateList({ id: this.cateId, activeName: "many" }).then((res) => {
          if (res.meta.status == 200) {
            this.$message({
              type: "success",
              message: "获取参数成功",
            });
            res.data.forEach((element) => {
              element.attr_vals =
                element.attr_vals.length == 0
                  ? []
                  : element.attr_vals.split(" ");
            });
            this.goodsparams = res.data;
          }
        });
        //点击下标为2的   商品属性
      } else if (this.activeIndex == "2") {
        GetCateList({ id: this.cateId, activeName: "only" }).then((res) => {
          this.goodsprops = res.data;
          console.log(res.data);
        });
      }
    },

    upload() {
      // uploadPicture({ file: "" }).then((res) => {
      //   console.log(res);
      // });
    },
    handleRemove(file, fileList) {
      // const filepath = file.response.data.tmp_path;
      // console.log(file, fileList);
    },
    handlePreview(file) {
      this.previewdialog = true;
      this.previewpath = file.response.data.url;
      console.log(file);
    },

    beforeleave(activeName, oldActiveName) {
      if (oldActiveName == "0" && this.addform.goods_cat.length !== 3) {
        this.$message.error("请选择参数");
        return false;
      }
    },
    handleChange() {
      if (this.addform.goods_cat.length !== 3) {
        this.selkeys = [];
      }
    },
    addgoods() {
      const form = _.cloneDeep(this.addform);
      this.$refs.addformRef.validate((valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
      });

      form.goods_cat = form.goods_cat.join(",");

      // 处理动态参数静态属性

      this.goodsparams.forEach((element) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(","),
        };
        this.addform.attrs.push(newInfo);
      });

      this.goodsprops.forEach((element) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(","),
        };
        this.addform.attrs.push(newInfo);
      });
      console.log(form);

      AddGoods(form).then(res=>{

        if(res.meta.status==201){
          this.$message({
            type:"添加成功"
          })
          this.$router.push('/goods')
        }else{
          this.$message.error("添加失败")
        }

      })
    },
    getCatelist() {
      Categories(this.queryInfo).then((res) => {
        this.catelist = res.data.result;
      });
    },
  },
  created() {
    this.getCatelist();
  },
  mounted() {},
};
</script>
<style scoped>
.box-card {
  margin: 20px 0;
}
.el-checkbox {
  margin: 2px 20px 0 0;
}
</style>
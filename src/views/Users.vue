<!--  -->
<template>
  <div class>
    <!-- 用户列表页面 -->
    <!-- 面包蟹组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="userslist.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#0076ff"
              @change="changestatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div style="display:flex;">
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="edituser(scope.row)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
              <!-- 分配角色 -->
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userslist.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userslist.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户信息" :visible.sync="editFormdialog" width="50%">
      <el-form
        :model="getUsermsg"
        label-width="100px"
        class="demo-ruleForm"
        ref="getUsermsg"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="getUsermsg.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="getUsermsg.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="mobile">
          <el-input v-model="getUsermsg.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormdialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  usersMsg,
  ChangeStatus,
  AddUsers,
  Delete,
  finduser,
  EditUser,
} from "../network/API";
import qs from "qs";
export default {
  components: {},
  data() {
    var checkname = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("用户名不能为空"));
      }

      let reg = /^[a-zA-Z0-9\-]{3,10}/;

      if (!this.ruleForm.username.match(reg)) {
        callback(new Error("用户名格式非法"));
      } else {
        callback();
      }
    };

    var checkpass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("密码不能为空"));
      }

      let reg = /^[A-Za-z]+[0-9]+$/;

      if (reg.test(this.ruleForm.pass)) {
        callback();
      } else {
        callback(new Error("密码格式错误"));
      }
    };

    var checkemail = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("邮箱不能为空"));
      }
      let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)+\.(?:com|cn)$/;
      if (!reg.test(this.ruleForm.email)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback("邮箱格式正确");
      }
    };

    var checkmobile = (rule, value, callback) => {
      if ((value = "")) {
        callback(new Error("手机号不能为空"));
      }

      let reg = /^[1][3,6,5,7,8][0-9]{9}$/;

      if (!reg.test(this.ruleForm.mobile)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };

    return {
      total:"",
      getUsermsg: {},

      searchval: "",
      // axios 获取用户列表 穿的参数
      userslist: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      tableData: [],
      // 添加用户的dialog
      dialogVisible: false,
      // 修改用户的dialog
      editFormdialog: false,

      ruleForm: {
        username: "",
        pass: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          {
            validator: checkname,
            trigger: "blur",
          },
        ],
        pass: [
          {
            validator: checkpass,
            trigger: "blur",
          },
        ],
        email: [
          {
            validator: checkemail,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            validator: checkmobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    // 搜索
    search() {
      this.getuserlist();
    },
    // 添加单个用户
    submit() {
      AddUsers({
        username: this.ruleForm.username,
        password: this.ruleForm.pass,
        email: this.ruleForm.email,
        mobile: this.ruleForm.mobile,
      })
        .then((res) => {
          this.tableData.unshift(res.data);

          if (res.meta.ststus == 201) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
          }
          console.log(res);
        })
        .catch((err) => {});

      setTimeout(() => {
        this.dialogVisible = false;
      }, 1300);
    },
    // 改变用户状态
    changestatus(info) {
      let obj = {
        id: info.id,
        state: info.mg_state,
      };
      ChangeStatus(obj)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "设置成功!",
            });
          }
        })
        .catch((err) => {});
    },

    // 修改用户信息
    edituser(userinfo) {
      finduser(userinfo.id)
        .then((res) => {
          console.log(res);
          this.getUsermsg = res.data;
        })
        .catch((err) => {});

      this.editFormdialog = true;
      console.log(userinfo);
    },
    // 确认修改
    confirmEdit() {
      this.editFormdialog = false;

      let user = {
        id: this.getUsermsg.id,
        email: this.getUsermsg.email,
        mobile: this.getUsermsg.mobile,
      };

      EditUser(user)
        .then((res) => {
          this.getUsermsg = res.data;
          if (res.meta.status == 200) {
            this.$message({
              type: "success",
              message: "修改用户信息成功!",
            });
          }
          console.log(res);
        })
        .catch((err) => {});
    },

    // 删除单个用户

    del(info) {
      this.$confirm("确认删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Delete(info.id)
            .then((res) => {
              console.log(res);
              if (res.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            })
            .catch((err) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getuserlist() {
      usersMsg(this.userslist)
        .then((res) => {
          this.total=res.data.total
          this.tableData = res.data.users;
        })
        .catch((err) => {});
    },

    // 分页器
    // 每页条数
    handleSizeChange(newsize) {
      this.userslist.pagesize = newsize;
      this.getuserlist();
      console.log(newsize);
    },
    // 当前页吗
    handleCurrentChange(newsize) {
      this.userslist.pagenum = newsize;
      this.getuserlist();
      console.log("当前页码：", newsize);
    },
  },
  created() {
    this.getuserlist();
  },
  mounted() {},
};
</script>


<style scoped>
.box-card {
  margin: 20px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>
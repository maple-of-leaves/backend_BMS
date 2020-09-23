<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table stripe :data="rolelist" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              type="flex"
              align="top"
              v-for="(item1,index1) in scope.row.children"
              :key="index1"
              class="firstrow"
            >
              <!-- 一级 -->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <el-row
                  type="flex"
                  justify="space-around"
                  align="middle"
                  v-for="(item2,index2) in item1.children"
                  :key="index2"
                  class="secondrow"
                >
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18" class="col3">
                    <el-tag
                      closable
                      @close="remove(scope.row,item3.id)"
                      class="tag3"
                      type="warning"
                      v-for="(item3,index3) in item2.children"
                      :key="index3"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <div style="display:flex">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editRole(scope.row)"
              >编辑</el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)">删除</el-button>
              <!-- 分配角色 -->
              <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="assign(scope.row)"
                >分配权限</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="添加用户" :visible.sync="editRoleDialog">
      <el-form :model="form">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>

    <!--权限  列表树型控件 -->

    <el-dialog title="权限分配" :visible.sync="rightListDialog" @close="setRightdislog">
      <el-tree
        ref="treeRef"
        :data="rightlist"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defkeys"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightListDialog = false">取 消</el-button>
        <el-button type="primary" @click="selAllRight ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Roles,
  AddRoles,
  FindRole,
  EditRole,
  DeleteRole,
  GetRoleRight,
  GetEditRoleRights,
  DeleteRoleRights,
} from "../../network/API";

export default {
  components: {},
  data() {
    return {
      rightlist: [],
      //   当起将要分配角色的  角色id
      roleid: "",
      defaultProps: {
        children: "children",
        label: "authName",
      },

      rolelist: [],

      defkeys: [],
      dialogFormVisible: false,
      editRoleDialog: false,
      //   权限列表
      rightListDialog: false,
      form: {
        roleName: "",
        roleDesc: "",
      },
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    //   添加角色
    addRole() {
      this.dialogFormVisible = true;
    },
    confirmAdd() {
      this.dialogFormVisible = false;
      let roles = {
        roleName: this.form.roleName,
        roleDesc: this.form.roleDesc,
      };
      AddRoles(roles)
        .then((res) => {
          this.rolelist.unshift(res.data);
          if (res.meta.status == 201) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
          }
        })
        .catch((err) => {});
    },
    remove(role, rightid) {
      let roleid = role.id;

      this.$confirm("此操作将永久移除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteRoleRights(roleid, rightid).then((res) => {
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
    editRole(role) {
      FindRole(role.id).then((res) => {
        this.form = res.data;
        console.log(res);
      });
      this.editRoleDialog = true;
    },

    confirmEdit() {
      this.editRoleDialog = false;

      let roleInfo = {
        id: this.form.roleId,
        roleName: this.form.roleName,
        roleDesc: this.form.roleDesc,
      };

      EditRole(roleInfo).then((res) => {
        if (res.meta.status == 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
        }
      });
    },
    del(roleinfo) {
      this.$confirm("确认删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          DeleteRole(roleinfo.id).then((res) => {
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
    setRightdislog() {
      this.defkeys = [];
    },
    // 分配权限  对话框
    assign(rights) {
      this.roleid = rights.id;

      console.log(rights);
      this.rightListDialog = true;

      GetRoleRight().then((res) => {
        this.rightlist = res.data;
      });

      this.getLeafKeys(rights, this.defkeys);
    },
    // 选择角色权限
    selAllRight() {
      this.rightListDialog = false;

      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const keystr = keys.join(",");
      console.log(keystr);
      GetEditRoleRights({ roleid: this.roleid, rids: keystr }).then((res) => {
        if (res.meta.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        }
      });
    },
    // 递归调用三级id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    getrolelist() {
      Roles()
        .then((res) => {
          this.rolelist = res.data;
        })
        .catch((err) => {});
    },
  },
  created() {
    this.getrolelist();
  },
  mounted() {},
};
</script>
<style scoped>
.secondrow {
  border-top: 0.3px solid #eee;
}
.firstrow {
  padding: 10px 0;
}
.cate2 {
}
.col3 {
  overflow: hidden;
}
.tag3 {
  margin: 3px 5px;
}
</style>
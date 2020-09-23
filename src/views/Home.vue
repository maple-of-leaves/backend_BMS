<template>
  <div class="home">
    <!-- 布局 -->
    <el-container>
      <!-- 头部区域 -->

      <el-header>
        <div class="header">
          电商后台管理系统
          <el-button type="info" @click="logout">退出</el-button>
        </div>
      </el-header>

      <!-- 头部下方区域 -->
      <el-container style="height:700px">
        <!-- 侧边栏部分 -->
        <el-aside :width="isCollapse?'64px':'180px'">
          <div class="togglebutton" @click="toggleCollepse">| | |</div>

          <el-menu
            router
            :collapse="isCollapse"
            :collapse-transition="istransition"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#313742"
            text-color="#fff"
            active-text-color="#0076ff"
            unique-opened
            :default-active="activepath"
          >
            <!-- 一级菜单 -->
            <el-submenu v-for="item in asidelist" :key="item.id" :index="item.id">
              <template slot="title">
                <i :class="tubiao[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="saveNavState('/'+subitem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容展示 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { menu } from "../network/API";
export default {
  components: {},
  data() {
    return {
      asidelist: [],
      tubiao: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: " iconfont icon-baobiao",
      },
      isCollapse: false,
      istransition: false,
      activepath: "",
    };
  },
  created() {
    this.activepath = window.sessionStorage.getItem("activepath");
    menu()
      .then((res) => {
        this.asidelist = res.data;
      })
      .catch((err) => {});
  },
  methods: {
    toggleCollepse() {
      this.istransition = true;
      this.isCollapse = !this.isCollapse;

      if (this.isCollapse) {
        this.isCollapse = true;
      }
    },

    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },

    saveNavState(activepath) {
      window.sessionStorage.setItem("activepath", activepath);
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style  scoped>
.el-header {
  background-color: #363d40;
  color: #ddd;
  line-height: 60px;
}
.header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #313743;
  color: #fff;
  text-align: center;
  height: 100%;
}

.el-main {
  background-color: #e9eef3;

  height: 100%;
}

.togglebutton {
  background: #475163;
  line-height: 24px;
  text-align: center;
  width: 100%;
}
.el-menu {
  border: none;
}
.el-submenu__title {
  padding: 0;
  text-align: left;
}
</style>

<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        :default-openeds="['0', '1']"
      >
        <h3>课堂点名系统</h3>
        <el-menu-item
          @click="clickMenu(item)"
          v-for="item in menuData"
          :key="item.name"
          :index="item.path"
        >
          <i :class="`el-icon-${item.icon}`"></i>
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<el-main>
<router-view></router-view>
</el-main>

<script>
import { storage } from "../storage/storage";

export default {
  data() {
    return {
      menuData: [],
      adminMenu: [
        {
          path: "/home",
          name: "home",
          label: "主页",
          icon: "view",
          url: "home/home",
        },
        {
          path: "/randomCall",
          name: "randomCall",
          label: "随机点名",
          icon: "view",
          url: "randomCall/randomCall",
        },
        {
          path: "/listCall",
          name: "listCall",
          label: "列表点名",
          icon: "view",
          url: "listCall/listCall",
        },
        {
          path: "/student",
          name: "student",
          label: "学生管理",
          icon: "reading",
          url: "Student/student",
        },
        {
          path: "/class",
          name: "class",
          label: "班级管理",
          icon: "reading",
          url: "Class/classs",
        },
        {
          path: "/college",
          name: "college",
          label: "学院管理",
          icon: "reading",
          url: "College/college",
        },
        {
          path: "/course",
          name: "course",
          label: "课程管理",
          icon: "reading",
          url: "course/course",
        },
        {
          path: "/record",
          name: "record",
          label: "点名记录",
          icon: "reading",
          url: "Record/record",
        },
        // {
        //   path: "/user",
        //   name: "user",
        //   label: "用户中心",
        //   icon: "reading",
        //   url: "user/user",
        // },
      ],
      studentMenu: [
        {
          path: "/attendance",
          name: "attendance",
          label: "签到",
          icon: "view",
          url: "attendance/attendance",
        },

        {
          path: "/studentRecord",
          name: "studentRecord",
          label: "签到记录",
          icon: "view",
          url: "studentRecord/studentRecord",
        },
      ],
    };
  },
  created() {
    this.setMenuData();
  },
  methods: {
    setMenuData() {
      const role = storage.get('role');
      if (role === '1') {
        this.menuData = this.adminMenu;
      } else if (role === '2') {
        this.menuData = this.studentMenu;
      }
    },
    handleOpen(key, keyPath) {
      //console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath)
    },
    clickMenu(item) {
      //console.log(item)
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border-right: none;
  width: 200px;
  min-height: 400px;
}
.el-menu {
  height: 100vh;
  h3 {
    color: aqua;
    text-align: center;
    line-height: 48px;
  }
}
</style>

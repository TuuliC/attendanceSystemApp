<template>
  <div class="container">
    <div class="form-group">
      <el-select
        v-model="selectCollegeList"
        @change="changeCollege"
        filterable
        multiple
        collapse-tags
        placeholder="请选择学院"
        class="select-input"
      >
        <el-option
          v-for="item in collegeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="selectClassList"
        @change="changeClass"
        filterable
        multiple
        collapse-tags
        :disabled="selectCollegeList.length === 0"
        placeholder="请选择班级"
        class="select-input"
      >
        <el-option
          v-for="item in classList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="courseId"
        filterable
        :disabled="selectClassList.length === 0"
        @change="changeCourse"
        placeholder="请选择课程"
        class="select-input"
      >
        <el-option
          v-for="item in courseList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
    <div class="welcome-message">
      <h2>欢迎使用，请选择学院、班级及课程。</h2>
      <p>选择后系统会自动刷新并显示相关内容。</p>
    </div>
  </div>
</template>
<script>
import {
  getSelectClass,
  getSelectCollege,
  getSelectCourse,
} from "../api/generalApi";
import { storage } from "../storage/storage";
import router from "../router";

export default {
  data() {
    return {
      name: "张",
      num: "123456789",
      gender: "",
      genderList: [
        { value: "男", label: "男" },
        { value: "女", label: "女" },
      ],
      selectClassList: [],
      classArr: [],
      classList: [],
      selectCollegeList: [],
      collegeArr: [],
      collegeList: [],
      courseId: "",
      courseList: [],
    };
  },
  created() {
    if (
      this.GLOBAL.collegeList.length == 0 ||
      this.GLOBAL.classList.length == 0 ||
      this.GLOBAL.courseId == ''
    ) {
      this.initList();
    } else {
      this.collegeArr = this.GLOBAL.collegeList;
      this.classArr = this.GLOBAL.classList;
      this.courseId = this.GLOBAL.courseId;
      this.initList();
      this.selectCollegeList = this.GLOBAL.collegeList;
      this.changeCollege();
      this.selectClassList = this.GLOBAL.classList;
      this.changeClass();
      this.courseId = this.GLOBAL.courseId;
    }
  },

  methods: {
    async initList() {
      // 获取“筛选学院”下拉框数据
      await getSelectCollege()
        .then((res) => {
          if (String(res.data.code) === "1") {
            this.collegeList = res.data.data;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },

    changeCollege(value) {
      this.GLOBAL.collegeList = this.selectCollegeList;
      this.selectClassList = [];
      this.collegeArr = [];
      this.courseId = "";
      for (let i = 0; i < this.selectCollegeList.length; i++) {
        this.collegeArr.push(this.selectCollegeList[i]);
      }
      if (this.collegeArr.length == 0) return;
      getSelectClass(this.collegeArr)
        .then((res) => {
          if (String(res.data.code) === "1") {
            this.classList = res.data.data;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },
    // 选择班级后，获取“筛选课程”下拉框数据
    changeClass(value) {
      this.GLOBAL.classList = this.selectClassList;
      this.classArr = [];
      this.courseId = "";
      for (let i = 0; i < this.selectClassList.length; i++) {
        this.classArr.push(this.selectClassList[i]);
      }
      if (this.classArr.length == 0) return;
      getSelectCourse(this.classArr)
        .then((res) => {
          if (String(res.data.code) === "1") {
            this.courseList = res.data.data;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },
    changeCourse() {
      this.GLOBAL.courseId = this.courseId;
    },
    logout() {
      storage.remove('isAuthenticated')
      router.push('/login')
    },
  },
};
</script>
<style>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #f9f9f9;
  padding: 20px;
  box-sizing: border-box;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.select-input {
  width: 300px;
}

.welcome-message {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-message h2 {
  margin-bottom: 10px;
}

.welcome-message p {
  color: #888;
}
</style>

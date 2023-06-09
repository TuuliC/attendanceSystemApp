<template>
  <div class="container">
    <div class="tableBar">
      <div>
        <el-input
          v-model="input"
          placeholder="搜索学号或姓名"
          style="width: 250px"
          clearable
          @clear="initList()"
          @keyup.enter.native="handleQueryList"
          @selection-change="handleSelectionChange"
        >
        </el-input>

        <el-select
          v-model="selectCollegeList"
          ref="selectCollege"
          @change="changeCollege"
          filterable
          multiple
          collapse-tags
          placeholder="请选择学院"
        >
          <el-option
            v-for="item in collegeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="selectClassList"
          ref="selectClass"
          @change="changeClass"
          filterable
          multiple
          collapse-tags
          :disabled="selectCollegeList.length === 0"
          placeholder="请选择班级"
        >
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="courseId"
          filterable
          :disabled="selectClassList.length === 0"
          @change="changeCourse"
          placeholder="请选择课程"
        >
          <el-option
            v-for="item in courseList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <span style="height: 40px">
          <el-button
            icon="el-icon-search"
            type="primary"
            plain
            circle
            style="margin-right: 20px"
            @click="initList()"
          ></el-button>
        </span>
      </div>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      stripe
      width="500"
      class="tableBox"
      :header-cell-style="{ 'text-align': 'left' }"
      :cell-style="{ 'text-align': 'left' }"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="num" label="学号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="gender" label="性别"></el-table-column>
      <el-table-column prop="className" label="班级"></el-table-column>
      <el-table-column prop="collegeName" label="学院"></el-table-column>
      <el-table-column prop="courseName" label="课程"></el-table-column>
      <el-table-column prop="status" label="状态"
        ><template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'attended'" type="success">
            已签到
          </el-tag>
          <el-tag v-else-if="scope.row.status === 'absent'" type="danger">
            缺勤
          </el-tag>
          <el-tag v-else>未知</el-tag>
        </template></el-table-column
      >
      <el-table-column prop="time" label="时间"></el-table-column>
    </el-table>
    <el-pagination
      class="pageList"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="counts"
      @size-change="handleSizeChange"
      :current-page.sync="page"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getRecordPage } from "../api/recordApi";
import {
  getSelectCollege,
  getSelectClass,
  getSelectCourse,
} from "../api/generalApi";
export default {
  data() {
    return {
      input: "",
      counts: 0,
      page: 1,
      pageSize: 10,
      checkList: [],
      selectClassList: [],
      classArr: [],
      classList: [],
      selectCollegeList: [],
      collegeArr: [],
      collegeList: [],
      courseId: "",
      courseList: [],
      tableData: [
        {
          num: 123456789,
          name: "张三",
          gender: "男",
          class: "计算机21-4",
          college: "计算机学院",
          course: "数据结构",
          time: "2023-05-22 18:08:12",
        },
      ],
    };
  },

  created() {
    if (
      this.GLOBAL.collegeList.length == 0 ||
      this.GLOBAL.classList.length == 0 ||
      this.GLOBAL.courseId==''
    )
      this.initList();
    else {
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
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.input ? this.input : undefined,
        courseId: this.courseId ? this.courseId : undefined,
        collegeList: this.collegeArr ? this.collegeArr : undefined,
        classList: this.classArr ? this.classArr : undefined,
      };
      await getRecordPage(params)
        .then((res) => {
          //console.log(res);
          if (String(res.data.code) === "1") {
            this.tableData = res.data.data.dataList || [];
            this.counts = res.data.data.count;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
      //获取“筛选学院”下拉框数据
      await getSelectCollege()
        .then((res) => {
          //console.log(res);
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
    //选择学院后，获取“筛选班级“下拉框数据
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
    //选择班级后，获取“筛选课程”下拉框数据
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
    handleQueryList() {
      this.page = 1;
      this.initList();
    },
    //选择操作
    handleSelectionChange(val) {
      let checkArr = [];
      val.forEach((n) => {
        checkArr.push(n.id);
      });
      this.checkList = checkArr;
    },
    //翻页操作
    handleSizeChange(val) {
      this.pageSize = val;
      this.initList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.initList();
    },
  },
};
</script>

<style>
.dashboard-container .container {
  background: #fff;
  position: relative;
  z-index: 1;
  padding: 30px 28px;
  border-radius: 4px;
}
.tableBar {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
}
.pageList {
  text-align: center;
  margin-top: 30px;
}
</style>

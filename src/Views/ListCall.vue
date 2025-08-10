<template>
  <div class="container">
    <div class="tableBar">
      <div>
        <el-input
          v-model="input"
          placeholder="搜索学号或姓名"
          style="width: 215px"
          clearable
          @clear="manualRefresh()"
          @keyup.enter.native="handleQueryList"
        >
        </el-input>

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

        <el-button
          type="success"
          plain
          icon="el-icon-refresh-left"
          @click="manualRefresh()"
        >
          刷新
        </el-button>

        <el-button
          v-if="!isAttendance"
          type="primary"
          plain
          icon="el-icon-message-solid"
          @click="startAttendance()"
        >
          发起签到
        </el-button>

        <el-button
          v-else
          type="warning"
          plain
          icon="el-icon-s-release"
          @click="endAttendance()"
        >
          结束签到
        </el-button>

      </div>
    </div>
    <div class="tableBar2">
      <el-select
        v-model="gender"
        style="width: 90px"
        clearable
        filterable
        placeholder="性别"
      >
        <el-option
          v-for="item in genderList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="selectCollegeList"
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
        filterable
        multiple
        collapse-tags
        :disabled="selectCollegeList.length === 0"
        @change="changeClass"
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
      <el-select
        v-model="selectStateList"
        style="width: 140px"
        multiple
        collapse-tags
        @change="changeStatus"
        placeholder="状态"
      >
        <el-option
          v-for="item in stateList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span class="tableLab">
        <el-button
          type="success"
          plain
          icon="el-icon-check"
          @click="markAttendance('batch', 'attended')"
        >
          签到
        </el-button>
        <el-button
          type="danger"
          plain
          icon="el-icon-close"
          @click="markAttendance('batch', 'absent')"
        >
          缺勤
        </el-button>
      </span>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      @selection-change="handleSelectionChange"
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
      <el-table-column prop="college" label="学院"></el-table-column>
      <el-table-column prop="status" label="状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'attended'" type="success">
            已签到
          </el-tag>
          <el-tag v-else-if="scope.row.status === 'absent'" type="danger">
            缺勤
          </el-tag>
          <el-tag v-else>未签到</el-tag>
        </template>
      </el-table-column
      >
      <el-table-column label="操作" width="100%" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: #67c23a"
            @click="markAttendance('single', 'attended', scope.row.id)"
          >
            签到
            <!-- <img src='../../images/icons/edit.png' style='width: 20px;height: 20px'/> -->
          </el-button>
          <el-button
            type="text"
            style="color: #f56c6c"
            @click="markAttendance('single', 'absent', scope.row.id)"
          >
            缺勤
            <!-- <img src='../../images/icons/del.png' style='width: 20px;height: 20px'/> -->
          </el-button>
        </template>
      </el-table-column>
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
import {getListCallPage} from "../api/studentApi";
import {markAttendance, startAttendance, endAttendance} from "../api/callNameApi";
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
      gender: "",
      genderList: [
        {value: "男", label: "男"},
        {value: "女", label: "女"},
      ],
      selectStateList: [],
      stateArr: [],
      stateList: [
        {id: "attended", name: "已签到"},
        {id: "absent", name: "缺勤"},
        // {id: "no", name: "未签到"},
        // { id: "unattended", name: "未签到" },
      ],
      selectClassList: [], //已选择的筛选班级
      classArr: [], //提交给后端的
      classList: [], //筛选列表展示的数据
      selectCollegeList: [],
      collegeArr: [],
      collegeList: [],
      courseId: "",
      courseList: [],
      tableData: [
        {
          id: "",
          num: "",
          name: "",
          gender: "",
          className: "",
          college: "",
          status: "",
        },
      ],
      isAttendance: false,
      isManualRefresh: false, // 区分手动刷新和自动刷新的标志
    };
  },

  created() {
    if (
      this.GLOBAL.collegeList.length == 0 ||
      this.GLOBAL.classList.length == 0 ||
      this.GLOBAL.courseId == ''
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
    // 启动定时器，每5秒刷新一次
    this.intervalId = setInterval(() => {
      this.isManualRefresh = false;
      this.initList();
    }, 5000);
  },

  beforeDestroy() {
    // 在组件销毁之前清除定时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  methods: {
    async initList() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.input ? this.input : undefined,
        gender: this.gender ? this.gender : undefined,
        collegeList: this.collegeArr ? this.collegeArr : undefined,
        classList: this.classArr ? this.classArr : undefined,
        courseId: this.courseId ? this.courseId : undefined,
        stateList: this.stateArr ? this.stateArr : undefined,
      };
      //console.log(params);

      //获取“筛选学院”下拉框数据
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

      if (
        this.selectCollegeList.length == 0 ||
        this.selectClassList.length == 0 ||
        this.courseId == ""
      ) {
        this.$message.warning("请填写学院 班级 课程");
        this.tableData = []
        return;
      }
      // if (!this.isAttendance) {
      //   this.tableData = null;
      //   return;
      // }
      //获取列表数据
      await getListCallPage(params)
        .then((res) => {
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
      if (this.isManualRefresh) {
        this.$notify({
          title: "刷新成功",
          message: "已刷新信息",
          type: "success",
        });
      }
    },
    manualRefresh() {
      this.isManualRefresh = true;
      this.initList();
    },
    //选择学院后，获取“筛选班级“下拉框数据
    changeCollege(id) {
      this.GLOBAL.collegeList = this.selectCollegeList;
      this.selectClassList = [];
      this.courseId = "";
      this.collegeArr = [];
      if (this.selectCollegeList.length == 0) {
        return;
      }
      for (let i = 0; i < this.selectCollegeList.length; i++) {
        this.collegeArr.push(this.selectCollegeList[i]);
      }
      if (this.collegeArr.length == 0) return;
      getSelectClass(this.collegeArr)
        .then((res) => {
          if (String(res.data.code) === "1") {
            this.classList = res.data.data;
            this.banSelectClass = false;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },
    changeClass(value) {
      this.GLOBAL.classList = this.selectClassList;
      this.courseId = "";
      this.classArr = [];
      for (let i = 0; i < this.selectClassList.length; i++) {
        this.classArr.push(this.selectClassList[i]);
      }
      if (this.classArr.length == 0) return;
      getSelectCourse(this.classArr)
        .then((res) => {
          if (String(res.data.code) === "1") {
            this.courseList = res.data.data;
            this.banSelectCourse = false;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },
    changeStatus(value) {
      this.stateArr = [];
      for (let i = 0; i < this.selectStateList.length; i++) {
        this.stateArr.push(this.selectStateList[i]);
      }
      //console.log(this.stateArr);
    },

    startAttendance() {
      let obj = {courseId: this.courseId, classsId: this.selectClassList[0]};
      console.log(obj);
      startAttendance(obj)
        .then((res) => {
          if (String(res.data.code) === "1") {
            // 更新表格中学生的点名状态
            this.initList();
            this.$message.success("发起点名成功");
            this.isAttendance = true;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
    },

    endAttendance() {
      let obj = {courseId: this.courseId, classsId: this.selectClassList[0]};
      endAttendance(obj)
        .then((res) => {
          if (String(res.data.code) === "1") {
            // 更新表格中学生的点名状态
            this.initList();
            this.$message.success("已结束点名");
            this.isAttendance = false;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
    },

    markAttendance(pattern, status, id) {
      let checkArr = [];
      if (pattern === "batch") {
        // 批量操作
        checkArr = this.checkList;
      } else {
        // 单个点名操作
        checkArr.push(id);
      }
      let obj = {ids: checkArr, courseId: this.courseId, status: status};
      //console.log(obj);
      markAttendance(obj)
        .then((res) => {
          if (String(res.data.code) === "1") {
            // 更新表格中学生的点名状态
            if (pattern === "batch") {
              this.initList();
            } else {
              this.tableData.forEach((student) => {
                if (student.id == id) student.status = status;
              });
            }
            this.$message.success("点名成功");
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((error) => {
          this.$message.error("点名失败:" + error);
        });
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

<style scoped>
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

.tableBar2 {
  display: flex;
  margin-bottom: 20px;
  padding: 5px;
  justify-content: space-between;
}

.pageList {
  text-align: center;
  margin-top: 30px;
}
</style>

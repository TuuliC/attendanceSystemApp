<template>
  <div class="show">
    <el-select v-model="gender" clearable filterable placeholder="请选择性别">
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
      placeholder="请选择学院（必选）"
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
      @change="changeClass"
      filterable
      multiple
      collapse-tags
      :disabled="selectCollegeList.length === 0"
      placeholder="请选择班级（必选）"
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
      placeholder="请选择课程（必选）"
    >
      <el-option
        v-for="item in courseList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <div>
      <div class="text">
        姓名：{{ callNameData.name }}<br />学号：{{ callNameData.num }}
      </div>
      <div v-if="callNameData.id" style="padding: 10px; font-size: 22px">
        状态：
        <el-tag v-if="callNameData.status === 'attended'" type="success">
          已签到
        </el-tag>
        <el-tag v-else-if="callNameData.status === 'absent'" type="danger">
          缺勤
        </el-tag>
        <el-tag v-else>未签到</el-tag>
      </div>
      <div v-if="callNameData.id" style="padding: 10px; font-size: 22px" >
        操作:
        <el-button
          type="success"
          plain
          size="medium"
          icon="el-icon-check"
          @click="markAttendance('attended', callNameData.id)"
        >
          签到
        </el-button>
        <el-button
          type="danger"
          plain
          size="medium"
          icon="el-icon-close"
          @click="markAttendance('absent', callNameData.id)"
        >
          缺勤
        </el-button>
      </div>
      <div @click="callName">
        <img src="../../static/image/callName.png" />
      </div>
    </div>
  </div>
</template>
  <script>
import { ramdomCall, markAttendance } from "../api/callNameApi";
import {
  getSelectClass,
  getSelectCollege,
  getSelectCourse,
} from "../api/generalApi";
export default {
  data() {
    return {
      callNameData: { id: "", name: "张三", num: "0", status: "" },
      // id: "",
      // name: "张三",
      // num: "123456789",
      // status: "",
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
      banSelectClass: true,
      banSelectCourse: true,
    };
  },
  created() {
    if (
      this.GLOBAL.collegeList.length == 0 ||
      this.GLOBAL.classList.length == 0 ||
      this.GLOBAL.courseId == ""
    )
      this.initList();
    else {
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
            this.banSelectClass = false;
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
      //console.log(this.GLOBAL.classList);
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
            this.banSelectCourse = false;
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
    callName() {
      var that = this;
      if (
        that.selectCollegeList.length == 0 ||
        that.selectClassList.length == 0 ||
        !that.courseId
      ) {
        this.$message.warning("请填写学院 班级 课程");
        return;
      }
      let parm = {
        gender: this.gender ? this.gender : undefined,
        classList: this.classArr,
        courseId: this.courseId,
      };
      ramdomCall(parm)
        .then((res) => {
          if (String(res.data.code) === "1") {
            let callList = res.data.data;
            const sleep = (delay) =>
              new Promise((resolve) => setTimeout(resolve, delay));
            async function repeatGreetingsLoop() {
              for (let i = 1; i < callList.length; i++) {
                that.callNameData.name = callList[i].name;
                that.callNameData.num = callList[i].num;
                await sleep(200);
              }
              that.callNameData = callList[0];
            }
            repeatGreetingsLoop();
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },
    markAttendance(status, id) {
      let obj = { ids: [id], courseId: this.courseId, status: status };
      //console.log(obj);
      markAttendance(obj)
        .then((res) => {
          if (String(res.data.code) === "1") {
            // 更新表格中学生的点名状态
            this.callNameData.status = status;
            this.$message.success("点名成功");
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((error) => {
          this.$message.error("点名失败:" + error);
        });
    },
  },
};
</script>
  <style >
.show {
  /* width: 100%;
  height: 100%;

  display: table-cell;
  vertical-align: middle;
  text-align: center; */
  margin: auto;
  width: 80%;
  text-align: center;
 
  padding: 20px;
}
.show img {
  padding: 40px;
}
.text {
  font-size: 30px;
  padding: 50px;
}
</style>
  
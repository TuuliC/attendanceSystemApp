<template>
  <div class="container">
    <el-button
      type="success"
      plain
      icon="el-icon-refresh-left"
      @click="manualRefresh"
    >
      刷新
    </el-button>
    <div class="attendance-info" v-if="isAttendance">
      <el-tag >签到中</el-tag>
      <p class="course-name">{{ courseName }}</p>
      <el-button
        type="success"
        plain
        icon="el-icon-check"
        @click="markAttendance"
      >
        签到
      </el-button>
    </div>
    <div class="no-attendance" v-else>
      当前无课程签到，或已完成签到
    </div>
  </div>
</template>
<script>
import { getAttendanceStatus } from "../api/attendanceApi";
import { markAttendance } from "../api/callNameApi";
import { storage } from "../storage/storage";
import router from "../router";

export default {
  data() {
    return {
      id: 2,
      isAttendance: false,
      courseName: "当前无课程签到，或已完成签到",
      courseId: "1",
      intervalId: null,
      isManualRefresh: false,
    };
  },
  created() {
    this.id = storage.get("id");
    this.initList();
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
      await getAttendanceStatus(this.id)
        .then((res) => {
          if (String(res.data.code) === "1") {
            if (res.data.data != null) {
              console.log(res.data.data);
              this.isAttendance = true;
              this.courseName = res.data.data.courseName;
              this.courseId = Number(res.data.data.courseId);
            } else {
              this.isAttendance = false;
            }
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
          if (this.isManualRefresh) {
            this.$notify({
              title: "刷新成功",
              message: "已刷新信息",
              type: "success",
            });
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },
    manualRefresh() {
      this.isManualRefresh = true;
      this.initList();
    },
    markAttendance() {
      let obj = { ids: [this.id], courseId: this.courseId, status: "attended" };
      markAttendance(obj)
        .then((res) => {
          if (String(res.data.code) === "1") {
            const now = new Date();
            const localDateString = now.toLocaleString();
            // 更新表格中学生的点名状态
            this.$alert(
              "签到成功，签到时间：" +
              localDateString +
              "，签到课程：" +
              this.courseName,
              "签到成功",
              {
                confirmButtonText: "确定",
              }
            );
            this.isAttendance = false;
            this.initList();
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((error) => {
          this.$message.error("签到失败:" + error);
        });
    },
    logout() {
      storage.remove("isAuthenticated");
      router.push("/login");
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
  padding: 20px;
  background-color: #f5f5f5;
}

.el-button {
  margin-bottom: 20px;
}

.attendance-info {
  text-align: center;
  background: white;
  padding: 40px;
  width: 60%;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.attendance-info .el-tag {
  margin-bottom: 20px;
  font-size: 18px;
}

.course-name {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
}

.no-attendance {
  font-size: 20px;
  color: #666;
  background: white;
  padding: 40px;
  width: 60%;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>

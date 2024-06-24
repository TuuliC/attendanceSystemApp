<template>
  <div class="container">
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
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'attended'" type="success">
            已签到
          </el-tag>
          <el-tag v-else-if="scope.row.status === 'absent'" type="danger">
            缺勤
          </el-tag>
          <el-tag v-else>未知</el-tag>
        </template>
      </el-table-column
      >
      <el-table-column prop="time" label="时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getStuRecord} from "../api/recordApi";
import {storage} from "../storage/storage";

export default {
  data() {
    return {
      id: 2,
      counts: 0,
      page: 1,
      tableData: [
        {
          num: 101,
          name: "李四",
          gender: "女",
          className: "计算机21-1",
          collegeName: "计算机学院",
          courseName: "数据结构",
          status: "attended",
          time: "2024-06-23 11:10:44"
        },
      ],
    };
  },

  created() {
    this.id = storage.get('id')
    this.initList();
  },

  methods: {
    async initList() {
      await getStuRecord(this.id)
        .then((res) => {
          //console.log(res);
          if (String(res.data.code) === "1") {
            console.log(res.data.data);
            this.tableData = res.data.data || [];
            console.log(this.tableData);
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
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

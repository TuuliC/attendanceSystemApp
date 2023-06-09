<template>
  <div class="container">
    <div class="tableBar">
      <div>
        <el-input
          v-model="input"
          placeholder="请输入课程名称"
          style="width: 250px"
          clearable
          
          @clear="initList()"
          @keyup.enter.native="handleQueryList"
        >
        </el-input>
        <!-- <el-select v-model="selectCollegeList" multiple filterable @change="changeCollege" placeholder="请选择学院">
          <el-option
            v-for="item in collegeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select> -->
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

      <span class="tableLab">
        <el-button
          type="text"
          size="small"
          style="color: #fdd24c"
          @click="deleteHandleTest('批量')"
        >
          批量删除
        </el-button>

        <el-button
          type="primary"
          style="background: #8cc5ff"
          @click="addStudent('add')"
          icon="el-icon-plus"
        >
          添加数据
        </el-button>
      </span>
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
      <el-table-column prop="courseName" label="课程名称"></el-table-column>
      <el-table-column prop="classListStr" label="选修班级"></el-table-column>
      <el-table-column prop="classCount" label="选修班级数量"></el-table-column>
      <el-table-column label="操作" width="100%" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="addStudent(scope.row.id)">
            修改
            <!-- <img src='../../images/icons/edit.png' style='width: 20px;height: 20px'/> -->
          </el-button>
          <el-button
            type="text"
            @click="deleteHandleTest('单删', scope.row.id)"
          >
            删除
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
import { getClassPage, deleteClass } from "../api/classApi";
import {getCoursePage} from "../api/courseApi"
export default {
  data() {
    return {
      input: "",
      counts: 0,
      page: 1,
      pageSize: 10,
      checkList: [],
      // selectCollegeList: [],
      // collegeArr:[],
      // collegeList: [],
      // ifSelectClass: true,
      tableData: [
        {
          id: 1,
          courseName: "课程test",
          classListStr:'班级',
          classCount: 10,
        },
      ],
    };
  },

  created() {
    this.initList();
  },

  methods: {
    async initList() {
      // let collegeArr = [];
      // for (let i = 0; i < this.selectCollegeList.length; i++) {
      //   collegeArr.push(this.selectCollegeList[i]);
      // }
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.input ? this.input : undefined,
      };
      console.log(params);
      //获取列表数据
      await getCoursePage(params)
        .then((res) => {
          if (String(res.data.code) === "1") {
            this.tableData = res.data.data.dataList || [];
            this.counts = res.data.data.count;
          }else {
            this.$message.error(res.data.msg || "操作失败");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
      // //获取“筛选学院”下拉框数据
      // await getSelectCollege()
      //   .then((res) => {
      //     if (String(res.data.code) === "1") {
      //       this.collegeList = res.data.data
      //     }else {
      //       this.$message.error(res.data.msg || "操作失败");
      //     }
      //   })
      //   .catch((err) => {
      //     this.$message.error("请求出错了：" + err);
      //   });
    },
    // changeCollege(){
    //   for (let i = 0; i < this.selectCollegeList.length; i++) {
    //     this.collegeArr.push(this.selectCollegeList[i]);
    //   }
    // },
    handleQueryList() {
      this.page = 1;
      this.initList();
    },
    //添加
    addStudent(parm) {
      console.log(parm);
      if (parm === "add") {
        this.$router.push({
          name: "add",
          params: { pattern: "course", id: undefined },
        });
      } else {
        this.$router.push({
          name: "add",
          params: { pattern: "course", id: parm },
        });
      }
    },
    // 删除
    deleteHandleTest(type, id) {
      if (type === "批量" && id === undefined) {
        if (this.checkList.length === 0) {
          return this.$message.error("请选择删除对象");
        }
      }
      this.$confirm("确定删除该班级, 是否继续?", "确定删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        let parm = type === "批量" ? this.checkList.join(",") : id;
        deleteClass(parm)
          .then((res) => {
            if (res.code === 1) {
              if (res.data === "success") this.$message.success("删除成功！");
              else this.$message.error(res.data);
              this.handleQueryList();
            } else {
              this.$message.error(res.msg || "操作失败");
            }
          })
          .catch((err) => {
            this.$message.error("请求出错了：" + err);
          });
      });
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

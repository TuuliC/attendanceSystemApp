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
        >
        </el-input>

        <el-select v-model="gender" filterable placeholder="请选择性别">
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
import { getStudentPage, deleteStudent } from "../api/studentApi";
import { getSelectCollege, getSelectClass } from "../api/generalApi";
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
        { value: "男", label: "男" },
        { value: "女", label: "女" },
      ],
      selectClassList: [], //已选择的筛选班级
      classArr: [], //提交给后端的
      classList: [], //筛选列表展示的数据
      selectCollegeList: [],
      collegeArr: [],
      collegeList: [],
      banSelectClass: true,
      tableData: [
        {
          id: 1,
          num: 123456789,
          name: "张三",
          gender: "男",
          className: "计算机21-4",
          college: "计算机学院",
        },
      ],
    };
  },

  created() {

    if (
      this.GLOBAL.collegeList.length == 0 ||
      this.GLOBAL.classList.length == 0
    )
      this.initList();
    else {
      this.collegeArr = this.GLOBAL.collegeList;
      this.classArr = this.GLOBAL.classList;
      this.initList();
      this.selectCollegeList = this.GLOBAL.collegeList;
      this.changeCollege();
      this.selectClassList = this.GLOBAL.classList;
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
      };

      //获取列表数据
      await getStudentPage(params)
        .then((res) => {
          // console.log(params);
          //console.log(res);
          //document.write(document.cookie)
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
    changeCollege(id) {
      // console.log(this.selectCollegeList);
      this.GLOBAL.collegeList = this.selectCollegeList;
      this.selectClassList = [];
      this.collegeArr = [];
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
      //console.log(this.selectClassList);
      this.GLOBAL.classList = this.selectClassList;
      this.classArr = [];
      for (let i = 0; i < this.selectClassList.length; i++) {
        this.classArr.push(this.selectClassList[i]);
      }
    },
    handleQueryList() {
      this.page = 1;
      this.initList();
    },
    //添加
    addStudent(parm) {
      if (parm === "add") {
        this.$router.push({
          name: "add",
          params: { pattern: "student", id: undefined },
        });
      } else {
        this.$router.push({
          name: "add",
          params: { pattern: "student", id: parm },
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
      this.$confirm("确定删除该学生, 是否继续?", "确定删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = [];
        if (type === "批量") {
          for (let i = 0; i < this.checkList.length; i++) {
            ids.push(this.checkList[i]);
          }
        } else ids.push(id);
        deleteStudent(ids)
          .then((res) => {
            if (res.data.code === 1) {
              this.$message.success("删除成功！");
              this.handleQueryList();
            } else {
              this.$message.error(res.data.msg || "操作失败");
            }
          })
          .catch((err) => {
            this.$message.error("请求出错了：" + err);
          });
      });
    },
    //选择操作
    handleSelectionChange(val) {
      //console.log(val);
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

<template>
  <div class="container1">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :inline="false"
      label-width="460px"
    >
      <el-form-item v-show="pattern === 'student'" label="学号" prop="num">
        <el-input
          :disabled="disabledNum"
          v-model="ruleForm.num"
          placeholder="学号"
          maxlength="20"
          style="width: 221px"
        />
      </el-form-item>
      <el-form-item v-show="pattern === 'student'" label="姓名" prop="name">
        <el-input
          v-model="ruleForm.name"
          placeholder="姓名"
          maxlength="20"
          style="width: 221px"
        />
      </el-form-item>
      <el-form-item v-show="pattern === 'student'" label="性别" prop="gender">
        <el-select
          v-model="ruleForm.gender"
          filterable
          placeholder="请选择性别"
        >
          <el-option
            v-for="item in genderList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-show="pattern === 'class'" label="班级名称" prop="class">
        <el-input
          v-model="ruleForm.className"
          placeholder="班级名称"
          maxlength="20"
          style="width: 221px"
        />
      </el-form-item>

      <el-form-item
        v-show="pattern === 'college'"
        label="学院名称"
        prop="college"
      >
        <el-input
          v-model="ruleForm.collegeName"
          placeholder="学院名称"
          maxlength="20"
          style="width: 221px"
        />
      </el-form-item>

      <el-form-item
        v-show="pattern === 'student' || pattern === 'class'"
        label="学院"
        prop="college"
      >
        <el-select
          v-model="ruleForm.college"
          placeholder="请选择学院"
          @change="changeCollege"
        >
          <el-option
            v-for="item in collegeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-show="pattern === 'student'" label="班级" prop="class">
        <el-select
          v-model="ruleForm.className"
          :disabled="banSelectClass"
          placeholder="请选择班级"
          @change="changeClass"
        >
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-show="pattern === 'course'" label="课程名称" prop="class">
        <el-input
          v-model="ruleForm.courseName"
          placeholder="课程名称"
          maxlength="20"
          style="width: 221px"
        />
      </el-form-item>

      <el-form-item
        v-show="pattern === 'course'"
        label="请选择选修班级"
        prop="classList"
      >
        <el-select
          v-model="selectClassList"
          value-key="id"
          filterable
          multiple
          placeholder="请选择选修班级"
          @change="changeSelectClass"
        >
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <div>
        <el-form-item label-width="400px">
          <el-button @click="goBackAddTest()"> 取消</el-button>
          <el-button type="primary" @click="submitFormAdd(false)">
            保存</el-button
          >
          <el-button
            v-if="actionType === 'add'"
            type="primary"
            class="continue"
            @click="submitFormAdd(true)"
          >
            保存并继续添加
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { addStudent, editStudent, queryStudentById } from "../api/studentApi";
import { addClass, editClass, queryClassById } from "../api/classApi";
import { addCollege, editCollege, queryCollegeById } from "../api/collegeApi";
import { getSelectClass, getSelectCollege } from "../api/generalApi";
import { queryCoueseById } from "../api/courseApi";

export default {
  data() {
    return {
      pattern: "",
      id: "",
      actionType: "",
      disabledNum: false,
      genderList: [
        { value: "男", label: "男" },
        { value: "女", label: "女" },
      ],
      selectClassId: "", //已选择的筛选班级
      classList: [], //筛选列表展示的数据
      selectClassList: [], //已选择的筛选班级（多选）
      classArr: [], //多选列表提交给后端的
      selectCollegeId: "",
      collegeList: [],
      banSelectClass: false,
      ruleForm: {
        num: "",
        name: "",
        gender: "",
        className: "",
        collegeName: "",
        courseName: "",
        classList: [],
        collegeList: [],
      },
    };
  },

  created() {
    console.log(this.$route);
    this.pattern = this.$route.params.pattern;
    this.id = this.$route.params.id;
    this.actionType = this.id ? "edit" : "add";
    if (this.id) {
      this.initAdd();
    }
    if (this.pattern === "student" && this.actionType === "edit")
      this.disabledNum = true;
    if (this.pattern === "student" || this.pattern === "class") this.getType();
    else if (this.pattern === "course") this.getType2();
  },

  methods: {
    async initAdd() {
      if (this.pattern === "student") {
        //console.log(this.id);
        queryStudentById(this.id).then((res) => {
          if (String(res.data.code) === "1") {
            this.ruleForm = res.data.data;
            //console.log(res.data.data);
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        });
      } else if (this.pattern === "class") {
        queryClassById(this.id).then((res) => {
          if (String(res.data.code) === "1") {
            this.ruleForm = res.data.data;
            //console.log(res.data.data);
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        });
      } else if (this.pattern === "college") {
        queryCollegeById(this.id).then((res) => {
          if (String(res.data.code) === "1") {
            this.ruleForm = res.data.data;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        });
      } else if (this.pattern === "course") {
        queryCoueseById(this.id).then((res) => {
          if (String(res.data.code) === "1") {
            this.ruleForm.courseName = res.data.data.courseName;
            this.selectClassList = res.data.data.selectClassList;
          } else {
            this.$message.error(res.data.msg || "操作失败");
          }
        });
      }
    },
    //选择学院后，获取“筛选班级“下拉框数据
    changeCollege(value) {
      this.selectCollegeId = value;
      console.log(this.selectCollegeId, value);
      // this.ruleForm.classId=''
      this.banSelectClass = false;
      if (this.pattern !== "student") return;
      getSelectClass([this.selectCollegeId]).then((res) => {
        if (res.data.code === 1) {
          this.classList = res.data.data;
          this.ruleForm.className = "";
        } else {
          this.$message.error(res.data.msg || "操作失败");
        }
      });
    },
    changeClass(value) {
      this.selectClassId = value;
    },
    changeSelectClass(value) {
      for (let i = 0; i < this.selectClassList.length; i++) {
        this.classArr.push(this.selectClassList[i]);
      }
    },
    //获取“筛选学院”下拉框数据
    getType() {
      getSelectCollege()
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

    getType2() {
      getSelectClass([undefined]).then((res) => {
        if (res.data.code === 1) {
          this.classList = res.data.data;
        } else {
          this.$message.error(res.data.msg || "操作失败");
        }
      });
    },

    goBackAddTest() {
      this.$router.back();
    },

    submitFormAdd(ifGoOn) {
      var that = this;
      if (this.pattern === "student") {
        let pram = {
          name: this.ruleForm.name,
          gender: this.ruleForm.gender,
          classId: this.selectClassId,
        };
        submitForm(addStudent, editStudent, pram);
      } else if (this.pattern === "class") {
        let pram = {
          className: this.ruleForm.className,
          collegeId: this.selectCollegeId,
        };
        submitForm(addClass, editClass, pram);
      } else if (this.pattern === "college") {
        let pram = {
          collegeName: this.ruleForm.collegeName,
        };
        // let pram = this.ruleForm.college
        submitForm(addCollege, editCollege, pram);
      }
      function submitForm(addFun, editFun, pram) {
        //添加
        if (that.actionType === "add") {
          if (that.pattern === "student") {
            Object.defineProperty(pram, "num", {
              value: that.ruleForm.num,
              enumerable: true,
            });
          }
          addFun(pram)
            .then((res) => {
              if (res.data.code === 1) {
                that.$message.success("添加成功！");
                if (!ifGoOn) {
                  setTimeout(() => {
                    that.goBackAddTest();
                  }, 2200);
                } else {
                  //继续添加
                  setTimeout(() => {
                    that.ruleForm = {
                      num: "",
                      name: "",
                      gender: "",
                      className: that.ruleForm.className,
                      college: that.ruleForm.college,
                      classList: that.ruleForm.classList,
                      collegeList: that.ruleForm.collegeList,
                    };
                  }, 2000);
                }
              } else {
                that.$message.error(res.data.msg || "操作失败");
              }
            })
            .catch((err) => {
              that.$message.error("请求出错了：" + err);
            });
        } else {
          //修改
          //console.log(that.id);
          Object.defineProperty(pram, "id", {
            value: that.id,
            enumerable: true,
          });
          editFun(pram)
            .then((res) => {
              if (res.data.code === 1) {
                that.$message.success("修改成功！");
                setTimeout(() => {
                  that.goBackAddTest();
                }, 2200);
              } else {
                that.$message.error(res.data.msg || "操作失败");
              }
            })
            .catch((err) => {
              that.$message.error("请求出错了：" + err);
            });
        }
      }
    },
  },
};
</script>

<style>
.continue {
  border-color: #333333 !important;
  background: #333333 !important;
  color: #ffffff !important;
}

.continue:hover {
  background-color: #999999 !important;
  border-color: #999999 !important;
  color: #ffffff !important;
}

.continue:active {
  background-color: #2a2a2a !important;
  border-color: #2a2a2a !important;
  color: #ffffff !important;
}

.container1 {
  margin: 30px;
  position: relative;
  z-index: 1;
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  min-height: 500px;
}
</style>

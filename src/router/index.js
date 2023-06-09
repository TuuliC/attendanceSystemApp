import Vue from 'vue'
import Router from 'vue-router'
import student from '../Views/Student'
import Main from '../Views/Main'
import home from '../Views/Home'
import add from '../Views/add'
import classs from '../Views/Class'
import college from '../Views/college'
import record from '../Views/record'
import randomCall from '../Views/RandomCall'
import listCall from '../Views/listCall'
import course from '../Views/course'

Vue.use(Router)

// 将路由与组件进行映射
const routes = [
  // 主路由
  {
    path: '/',
    component: Main,
    children: [
      // 子路由
      { path: 'home', name: '主页', component: home },
      { path: 'randomCall', name: '随机点名', component: randomCall },
      { path: 'listCall', name: '列表点名', component: listCall },
      { path: 'student', name: '学生管理', component: student },
      { path: 'class', name: '班级管理', component: classs },
      { path: 'college', name: '学院管理', component: college },
      { path: 'course', name: '课程管理', component: course },
      { path: 'record', name: '点名记录', component: record },
      { path: 'add', name: 'add', component: add }
    ]
  },


]
// 创建router实例.
const router = new Router({
  routes // (缩写)，相当于routes: routes
})

// 当前的router实例对外暴露
export default router

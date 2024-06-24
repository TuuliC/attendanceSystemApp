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
import attendance from '../Views/attendance'
import studentRecord from '../Views/StudentRecord'
import login from '../Views/loginPage'
import user from '../Views/User'
import {storage} from "../storage/storage";

Vue.use(Router)

// 将路由与组件进行映射
const commonRoutes = [
  // 主路由
  {
    path: '/',
    redirect: '/login', // 默认显示
    component: Main,
    children: [
      // 子路由
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: login
  },
  {
    path: '/user',
    name: '用户',
    component: user
  },
]
// 创建 router 实例
const router = new Router({
  mode: 'history', // 使用 history 模式
  routes: commonRoutes // 初始化时加载公共路由
});

// 初始的动态路由为空
let dynamicRoutes = [];

// 登录成功后根据用户类型设置路由
function setRoutesBasedOnUserType(userType) {
  if (userType === '2') {
    dynamicRoutes = [
      { path: '/attendance', name: '签到', component: attendance },
      { path: '/studentRecord', name: '签到记录', component: studentRecord }
    ];
  } else if (userType === '1') {
    dynamicRoutes = [
      { path: '/home', name: '主页', component: home },
      { path: '/randomCall', name: '随机点名', component: randomCall },
      { path: '/listCall', name: '列表点名', component: listCall },
      { path: '/student', name: '学生管理', component: student },
      { path: '/class', name: '班级管理', component: classs },
      { path: '/college', name: '学院管理', component: college },
      { path: '/course', name: '课程管理', component: course },
      { path: '/record', name: '点名记录', component: record },
      { path: '/add', name: 'add', component: add }
    ];
  } else {
    // 处理未知用户类型的情况，可以跳转到错误页面或默认页面
    dynamicRoutes = [];
  }

  // 替换路由配置
  router.matcher = new Router({
    mode: 'history',
    routes: [
      ...commonRoutes,
      {
        path: '/',
        component: Main,
        children: dynamicRoutes
      }
    ]
  }).matcher;
}

const currentUserType = storage.get('role');

// 设置初始路由
setRoutesBasedOnUserType(currentUserType);

// // 创建 router 实例
// const router = new Router({
//   mode: 'history', // 使用 history 模式
//   routes // 初始化时只加载公共路由
// });
//
// let registerRouteFresh = true; // 判断页面是否刷新以及第一次进入
// // let routesAdded = true; // 新增变量，用于标记路由是否已添加
// let registeredRoutes = []; // 用于记录已注册的路由名称
// router.beforeEach((to, from, next) => {
//   let isAuthenticated = storage.get("isAuthenticated"); // 判断用户是否已登录
//   console.log(isAuthenticated);
//   if (registerRouteFresh || storage.get('freshRoute')) {
//
//     if (storage.get('role') === '2') {
//       console.log('更新route1');
//       router.addRoutes(studentMenu.map(route => ({...route})));
//       console.log(router);
//     } else {
//       console.log('更新route2');
//       // router.addRoutes(rootMenu.map(route => ({...route})));
//       rootMenu.forEach(route => {
//         if (!registeredRoutes.includes(route.name)){
//           router.addRoute(route.name, route);
//           registeredRoutes.push(route.name);
//         }
//       });
//       console.log(router);
//     }
//     // routesAdded = true;
//     registerRouteFresh = false;
//     storage.set('freshRoute', false);
//
//     // next();
//   }
//   if (isAuthenticated === null) {
//     isAuthenticated = false;
//   }
//   console.log(storage.get('role'));
//   console.log(storage.get('role') === '2');
//   console.log(storage.get('role') === '1');
//   if (to.name !== '登录' && !isAuthenticated) {
//     console.log("跳转登录");
//     next({name: '登录'});
//   } else if (to.name === '登录' && isAuthenticated && storage.get('role') === '2') {
//     console.log("跳转签到");
//     next({name: '签到'});
//   } else if (to.name === '登录' && isAuthenticated && storage.get('role') === '1') {
//     console.log("跳转主页");
//     next({name: '主页'});
//   } else {
//     console.log("跳转下一个");
//     next();
//   }

// });

// 当前的 router 实例对外暴露
export default router

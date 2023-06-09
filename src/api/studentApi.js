import request from '../util/request.js'

export function getStudentPage(obj) {
    return request({
        url: '/student/getStudentPage',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function getListCallPage(obj) {
    return request({
        url: '/student/getListCallPage',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function deleteStudent(id) {
    return request({
        url: '/student/deleteStudent',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: id
    })
}
export function addStudent(obj) {
    return request({
        url: '/student/addStudent',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function editStudent(obj) {
    return request({
        url: '/student/updateStudent',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function queryStudentById(id) {
    return request({
        url: '/student/queryStudentById/' + id,//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'get',
        //data: id
    })
}


export default {
    getStudentPage, deleteStudent, addStudent, editStudent, queryStudentById
}
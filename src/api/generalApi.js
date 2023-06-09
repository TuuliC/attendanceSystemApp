import request from '../util/request.js'

export function getSelectCollege() {
    return request({
        url: '/college/getSelectCollege',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
    })
}
export function getSelectClass(collegeId) {
    return request({
        url: '/class/getSelectClass',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: collegeId 
    })
}
export function getSelectCourse(obj) {
    return request({
        url: '/course/getSelectCourse' ,//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
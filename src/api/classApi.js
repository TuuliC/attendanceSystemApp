import request from '../util/request.js'

export function getClassPage(obj) {
    return request({
        url: '/class/getClassPage',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function deleteClass(id) {
    return request({
        url: '/class/deleteClass',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: id
    })
}
export function addClass(obj) {
    return request({
        url: '/class/addClass',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function editClass(obj) {
    return request({
        url: '/class/updateClass',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function queryClassById(id) {
    return request({
        url: '/class/queryClassById/' + id,//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'get',
        //data: obj
    })
}
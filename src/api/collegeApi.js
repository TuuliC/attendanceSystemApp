import request from '../util/request.js'

export function getCollegePage(obj) {
    return request({
        url: '/college/getCollegePage',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function deleteCollege(id) {
    return request({
        url: '/college/deleteCollege',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: id
    })
}
export function addCollege(obj) {
    return request({
        url: '/college/addCollege',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function editCollege(obj) {
    return request({
        url: '/college/updateCollege',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function queryCollegeById(id) {
    return request({
        url: '/college/queryCollegeById/' + id,//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'get',
        //data: obj
    })
}
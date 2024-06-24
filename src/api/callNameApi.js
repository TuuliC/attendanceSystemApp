import request from '../util/request.js'

export function markAttendance(obj) {
    return request({
        url: '/attendance/listAttendance',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function ramdomCall(obj) {
    return request({
        url: '/attendance/randomAttendance',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function startAttendance(obj) {
    return request({
        url: '/attendance/startAttendance',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
export function endAttendance(obj) {
    return request({
        url: '/attendance/endAttendance',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}

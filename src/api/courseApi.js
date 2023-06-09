import request from '../util/request.js'

export function getCoursePage(obj) {
    return request({
        url: '/course/getCoursePage',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}

export function queryCoueseById(id) {
    return request({
        url: '/course/queryCoueseById/' + id,
        method: 'get',
    })
}

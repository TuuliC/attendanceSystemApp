import request from '../util/request.js'

export function getRecordPage(obj) {
    return request({
        url: '/record_detail/getRecordPage',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
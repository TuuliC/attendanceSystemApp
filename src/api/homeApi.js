import request from '../util/request.js'

export function getCallName(obj) {
    return request({
        url: '/',//请求地址 已经去除前面request中baseUrl相同的内容
        method: 'post',
        data: obj
    })
}
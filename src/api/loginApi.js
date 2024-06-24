import request from '../util/request.js'

export function vcimg(obj) {
  return request({
    url: '/vcimg',//请求地址 已经去除前面request中baseUrl相同的内容
    method: 'get',
  })
}
export function doLogin(obj) {
  return request({
    url: '/doLogin',//请求地址 已经去除前面request中baseUrl相同的内容
    method: 'post',
    data: obj,
  })
}

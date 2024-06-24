import request from '../util/request.js'

export function getStuRecord(id) {
  return request({
    url: '/record_detail/getStuRecord/' + id,//请求地址 已经去除前面request中baseUrl相同的内容
    method: 'get',
  })
}
export function getAttendanceStatus(id) {
  return request({
    url: '/attendance/getAttendanceStatus/' + id,//请求地址 已经去除前面request中baseUrl相同的内容
    method: 'get',
  })
}

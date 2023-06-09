import axios from 'axios'//引入axios

//axios.create能创造一个新的axios实例
const server = axios.create({
    baseURL: "http://localhost:8088", //配置请求的url
    timeout: 6000, //配置超时时间
    withCredentials: true,
    headers: {}//配置请求头
})

export default server

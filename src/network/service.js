import axios from "axios";

import { Loading } from 'element-ui'

const service = axios.create({

    baseURL: "http://127.0.0.1:8888/api/private/v1",

    timeout: 10000
});


service.interceptors.request.use(function (config) {

    config.headers.Authorization=window.sessionStorage.getItem("token")
    
    return config;

}, function (error) {

    console.log("========>", error);
    return Promise.reject(error);
});


// 添加响应拦截器
service.interceptors.response.use(function (response) {

    // setTimeout(() => {
    //     loadingservice.close()
    // }, 2000);

    const res = response.data

    if (res.status && res.status !== 200) {
        // 登录超时,重新登录

        return Promise.reject(res || 'error')
    } else {
        return Promise.resolve(res)
    }

}, function (error) {

    Toast.clear()
    console.log('err' + error) // for debug


    return Promise.reject(error);
});


export default service
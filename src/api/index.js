import axios from 'axios'

const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL
axios.interceptors.request.use(function (config) {
  // 将token给到一个前后台约定好的key中，作为请求发送
  let token = localStorage.getItem('mytoken')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 登陆验证
export const checkUser = params => {
  return axios.post('login', params).then(res => res.data)
}
// 获取用户登陆列表
export const getUserList = params => {
  return axios.get('users', params).then(res => res.data)
}
// 用户数据列表
export const userList = params => {
  return axios.get('users', params).then(res => res.data)
}
// 更换用户状态
// export const changeUserState = params => {
//   return axios.put('users/:' + params.uId + '/state/:' + params.type, params).then(res => res.data)
// }
export const changeUserState = params => {
  return axios.put(`users/${params.uid}/state/${params.type}`, params).then(res => res.data)
}
// 添加用户
export const addUser = params => {
  return axios.post('users', params).then(res => res.data)
}

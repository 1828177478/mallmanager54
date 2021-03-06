// axios插件
import axios from 'axios'
var MyPlugin = { }
MyPlugin.install = function (Vue) {
  // 把请求的地址的相同的部分提取出来
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  axios.interceptors.request.use(
    function(config) {
      // console.log(config)
      console.log(config.url)
      if (config.url !== 'login') {
        // config参数 headers头部 url标识
        const AUTH_TOKEN = localStorage.getItem('token')
        config.headers['Authorization'] = AUTH_TOKEN
      }
      // 在发送请求之前做些什么
      return config
    },
    function(error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
  )


  
  //  添加实例方法
  Vue.prototype.$http = axios
}
export default MyPlugin

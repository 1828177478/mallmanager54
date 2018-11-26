// axios插件
import axios from 'axios'
var MyPlugin = { }
MyPlugin.install = function (Vue) {
  // 把请求的地址的相同的部分提取出来
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  //  添加实例方法
  Vue.prototype.$http = axios
}
export default MyPlugin

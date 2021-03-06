// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'
import MyPlugin from '@/plugins/http.js'
import myBread from '@/components/comment/mrBread.vue'
import moment from 'moment'

Vue.use(ElementUI)
Vue.use(MyPlugin)
Vue.config.productionTip = false

//面包屑
Vue.component(myBread.name,myBread)
// 全局过滤器
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({

  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

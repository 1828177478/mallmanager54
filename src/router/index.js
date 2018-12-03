import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/users/users.vue'
import Rights from '@/components/rights/rights.vue'
import Role from '@/components/role/role.vue'
import Goods from '@/components/goods/goods.vue'
import GoodsAdd from '@/components/goods/goodsAdd.vue'
import cateparams from '@/components/goods/cateparams.vue'
import Goodscate from '@/components/goods/goodscate.vue'
import Order from '@/components/order/order.vue'
import {Message} from 'element-ui'
Vue.use(Router)

const router  =  new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: User
      }, ,
      {
        name: 'rights',
        path: '/rights',
        component: Rights
      },
     {
        name: 'roles',
        path: '/roles',
        component: Role
      }, {
        name: 'goods',
        path: '/goods',
        component: Goods
      }, {
        name: 'goodsAdd',
        path: '/goodsAdd',
        component: GoodsAdd
      }, {
        name: 'params',
        path: '/params',
        component: cateparams
      }, {
        name: 'categories',
        path: '/categories',
        component: Goodscate
      }, {
        name: 'orders',
        path: '/orders',
        component: Order
      },]
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to, from)
  // 如果要去的是login next()
  if (to.path === '/login') {
    next()
  } else {
    // 如果去的不是login
    // 判断token token存在next()
    const token = localStorage.getItem('token')
    if (!token) {
      // this.$router -> router
      // 回到登录
      // this.$message.warning('asdasd')
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
      return
    }
    next()
  }
})

export default router
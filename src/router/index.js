import Vue from 'vue'

import VueRouter from 'vue-router'

import Home from '../views/Home.vue'

import Login from '../components/Login.vue'

import welecome from '../components/welcome.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login

  }, {
    path: '/home',
    component: Home,
    redirect: '/welecome',
    children: [
      {
        path: '/welecome',
        component: welecome
      },
      {
        path: '/users',
        component: () => import('../views/Users.vue')
      }
      , {
        path: '/rights',
        component: () => import('../components/power/power.vue')
      }, {
        path: '/roles',
        component: () => import('../components/power/role.vue')
      },
      {
        path: '/goods',
        component: () => import('../components/goods/goodslist.vue'),

      },
      {
        path: '/goods/add',
        component: () => import('../components/goods/addgoods.vue'),
      },
      {
        path: '/categories',
        component: () => import('../components/goods/goodsCategories.vue')
      },
      {
        path: '/params',
        component: () => import('../components/goods/CateParams.vue')
      },
      {
        path: '/orders',
        component: () => import('../components/order/order.vue')
      },
      {
        path: '/reports',
        component: () => import('../components/STATS/status.vue')
      }

    ]
  }
]



const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {

  if (to.path === "/login") {
    next()
  }


  const tokenstr = window.sessionStorage.getItem("token")

  if (!tokenstr) {

    next("/login")

  }


  next()
})

export default router

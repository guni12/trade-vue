import Vue from 'vue'
import Router from 'vue-router'
import Front from '@/components/Front'
import Login from '@/components/Login'
import Register from '@/components/Register'
import NotFound from '@/components/NotFound'
import Currentmarket from '@/components/Currentmarket'

Vue.use(Router)

var token = "";

if (localStorage.getItem('token')) {
    token = JSON.parse(localStorage.getItem('token'));
}


const ifNotAuthenticated = (to, from, next) => {
    if (!token) {
        next()
        return
    }
    next('/')
}

const ifAuthenticated = (to, from, next) => {
    if (token) {
        next()
        return
    }
    next('/login')
}


export default new Router({
  mode: 'history',
  routes: [
    {
        path: '/',
        name: 'Front',
        component: Front
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/current',
        name: 'Current',
        component: Currentmarket,
        beforeEnter: ifAuthenticated,
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/views/Welcome'
import User from '@/views/user/User'
import GoodList from '@/views/goods/GoodList'
import Rights from '@/views/rights/Rights'
import Roles from '@/views/rights/Roles'
import Categories from '@/views/goods/Categories'
import Params from '@/views/goods/Params'
import AddGood from '@/views/goods/AddGood'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: User
            },
            {
                path: '/goods',
                component: GoodList
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: Categories
            },
            {
                path: '/params',
                component: Params
            },
            {
                path: '/goods-add',
                component: AddGood
            }
        ]
    }

]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next()
    }
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        Message.error('未登录或登陆已过期')
        return next('/login')
    }
    next()
})

export default router

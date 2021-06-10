import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/views/Welcome'
import User from '@/views/User'
import GoodList from '@/views/GoodList'
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
            }
        ]
    }

]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
        return
    }
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        Message.error('未登录或登陆已过期')
        next('/login')
        return
    }
    next()
})

export default router

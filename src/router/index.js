import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'

const Login = () => import(/* webpackChunkName: "login_home" */ '@/components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home" */ '@/components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home" */ '@/views/Welcome.vue')

const User = () => import(/* webpackChunkName: "user" */ '@/views/user/User.vue')

const GoodList = () => import(/* webpackChunkName: "goods" */ '@/views/goods/GoodList.vue')
const Categories = () => import(/* webpackChunkName: "goods" */ '@/views/goods/Categories.vue')
const Params = () => import(/* webpackChunkName: "goods" */ '@/views/goods/Params.vue')
const AddGood = () => import(/* webpackChunkName: "goods" */ '@/views/goods/AddGood.vue')

const Rights = () => import(/* webpackChunkName: "rights" */ '@/views/rights/Rights.vue')
const Roles = () => import(/* webpackChunkName: "rights" */ '@/views/rights/Roles.vue')

const Orders = () => import(/* webpackChunkName: "orders" */ '@/views/orders/Orders.vue')

const Reports = () => import(/* webpackChunkName: "reports" */ '@/views/reports/Reports.vue')

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
            },
            {
                path: '/orders',
                component: Orders
            },
            {
                path: '/reports',
                component: Reports
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

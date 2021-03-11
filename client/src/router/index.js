import Vue from 'vue'
import VueRouter from 'vue-router'
import { Capacitor } from '@capacitor/core'
import Landing from '../views/Landing.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        meta: { needAuth: true },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    },
    {
        path: '/dashboard/:id',
        name: 'Task',
        meta: { needAuth: true },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Task.vue'),
        props: true,
    },
    {
        path: '/editor/:id?',
        name: 'Editor',
        meta: { needAuth: true },
        component: () => import(/* webpackChunkName: "editor" */ '../views/Editor.vue'),
        props: true,
    },
    {
        path: '/account',
        name: 'Account',
        meta: { needAuth: true },
        component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue'),
    },
    {
        path: '/account/:id',
        name: 'Service',
        meta: { needAuth: true },
        component: () => import(/* webpackChunkName: "account" */ '../views/Service.vue'),
        props: true,
    },
    {
        path: '/login',
        name: 'SignIn',
        component: () => import(/* webpackChunkName: "auth" */ '../views/SignIn.vue'),
    },
    {
        path: '/register',
        name: 'SignUp',
        component: () => import(/* webpackChunkName: "auth" */ '../views/SignUp.vue'),
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "setting" */ '../views/Setting.vue'),
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue'),
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes,
})

const platform = Capacitor.getPlatform()

router.beforeEach((to, from, next) => {
    if ((platform === 'android' || platform === 'ios') && to.name === 'Landing') {
        next({ name: 'Dashboard' })
        return
    }

    if (to.matched.some(m => m.meta.needAuth)) {
        const hasAuthCookie = /Authorization=(.+?)(;|$)/.test(decodeURIComponent(document.cookie))

        if (!hasAuthCookie) {
            next({ name: 'SignIn' })
            return
        }
    }
    next()
})

export default router

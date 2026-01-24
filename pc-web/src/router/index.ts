import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('@/views/My.vue')
  },
  {
    path: '/match',
    name: 'Match',
    component: () => import('@/views/Match.vue')
  },
  {
    path: '/dating',
    name: 'Dating',
    component: () => import('@/views/Dating.vue')
  },
  {
    path: '/activities',
    name: 'Activities',
    component: () => import('@/views/Activities.vue')
  },
  {
    path: '/matchmaker',
    name: 'Matchmaker',
    component: () => import('@/views/Matchmaker.vue')
  },
  {
    path: '/updates',
    name: 'Updates',
    component: () => import('@/views/Updates.vue')
  },
  {
    path: '/academy',
    name: 'Academy',
    component: () => import('@/views/Academy.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router


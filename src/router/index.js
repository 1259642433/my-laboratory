import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/board'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@v/Home')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@v/Login')
  },
  {
    path: '/live',
    name: 'Live',
    component: () => import('@v/Live')
  },
  {
    path: '/vrlive',
    name: 'VRLive',
    component: () => import('@v/VRLive')
  },
  {
    path: '/imgscroll',
    name: 'ImgScroll',
    component: () => import('@v/ImgScroll')
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('@v/Board')
  },
  {
    path: '/webrtc',
    name: 'WebRTC',
    component: () => import('@v/WebRTC')
  },
  {
    path: '/sea',
    name: 'Sea',
    component: () => import('@v/Sea')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@v/Test')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

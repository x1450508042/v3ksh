import { createRouter, createWebHistory } from 'vue-router'
import trendPage from "../views/trendPage.vue"
import screenPage from "../views/screenPage.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'screenPage',
      component: screenPage
    },
    {
      path: '/trend',
      name: 'home',
      component: trendPage
    },

    {
      path: '/store',
      name: 'storePage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/storePage.vue')
    },
    {
      path:'/seller',
      name:'sellerPage',
      component:()=>import('../views/sellerPage.vue')
    },
    {
      path:'/rank',
      name:'rankPage',
      component:()=>import('../views/rankPage.vue')
    },
    {
      path:'/map',
      name:'mapPage',
      component:()=>import('../views/mapPage.vue')
    },
    {
      path:'/hot',
      name:'hotPage',
      component:()=>import('../views/hotPage.vue')
    },
    {
      path: '/pinia',
      name: 'pinia',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/初试pinia.vue')
    }
  ]
})

export default router

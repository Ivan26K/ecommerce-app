import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/products'
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/modules/products/pages/ProductsPage.vue')
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/modules/products/pages/ProductDetailPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/user/pages/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/modules/user/pages/RegisterPage.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/modules/user/pages/CartPage.vue')
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/modules/user/pages/FavoritesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/components/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// Глобальний захист маршрутів
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router

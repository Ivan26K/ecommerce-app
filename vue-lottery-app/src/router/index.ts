import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Головна | Vue Lottery App' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'Про додаток | Vue Lottery App' }
  },
  {
    path: '/lottery',
    name: 'Lottery',
    component: () => import('@/views/LotteryView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Учасники | Vue Lottery App'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Вхід | Vue Lottery App' }
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('@/views/UserDetailView.vue'),
    meta: { title: 'Профіль | Vue Lottery App' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
  // Зміна заголовка
  document.title = (to.meta.title as string) || 'Vue Lottery App'

  // Авторизація
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router

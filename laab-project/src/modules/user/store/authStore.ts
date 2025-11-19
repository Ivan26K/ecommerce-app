import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type CreateUserPayload } from '@/api/authApi'
import type { LoginPayload, User } from '@/types/types'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  // Логін
  async function login(payload: LoginPayload) {
    loading.value = true
    error.value = null
    try {
      const data = await authApi.login(payload)
      token.value = data.access_token
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      await fetchProfile()
      // router.push('/') // Можна робити переадресацію тут або в компоненті
    } catch (err: any) {
      error.value = 'Invalid email or password'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Реєстрація (НОВЕ)
  async function register(payload: CreateUserPayload) {
    loading.value = true
    error.value = null
    try {
      await authApi.register(payload)
      // Після реєстрації відразу логінимось
      await login({ email: payload.email, password: payload.password })
    } catch (err: any) {
      error.value = 'Registration failed'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Профіль
  async function fetchProfile() {
    if (!token.value) return
    try {
      user.value = await authApi.getProfile()
    } catch (err) {
      logout()
    }
  }

  // Логаут
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    // router.push('/login')
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register, // Експортуємо
    fetchProfile,
    logout
  }
})
